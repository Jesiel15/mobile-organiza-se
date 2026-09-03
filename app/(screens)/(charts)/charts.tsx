import Sidebar from "@/components/(sidebar-menu)/sidebar-menu";
import { useTheme } from "@/context/ThemeContext";
import { api } from "@/services/api";
import { getChartsStyles } from "@/styles/charts.styles";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import Svg, { Line, Rect, Text as SvgText } from "react-native-svg";

const MONTHS_SHORT = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

const GRID_LINE_COLOR = "rgba(255,255,255,0.08)";
const AXIS_LABEL_COLOR = "rgba(226,232,240,0.6)";

const formatBRL = (value: number) =>
  `R$ ${Math.round(value).toLocaleString("pt-BR")}`;

const formatAxisNumber = (value: number) =>
  Math.round(value).toLocaleString("pt-BR");

/**
 * "Nice numbers" para eixos de gráfico (algoritmo clássico de Paul Heckbert).
 * Em vez de travar o eixo num valor fixo (ex: sempre até 12.000), calcula um
 * teto/piso arredondado a partir do maior/menor valor real dos dados, para
 * que o eixo sempre acompanhe o ano selecionado e continue com números
 * "redondos" (múltiplos de 500/1000/2000/5000 etc.) em vez de valores feios.
 */
const niceNum = (range: number, round: boolean) => {
  if (range === 0) return 0;
  const exponent = Math.floor(Math.log10(range));
  const fraction = range / Math.pow(10, exponent);
  let niceFraction: number;

  if (round) {
    if (fraction < 1.5) niceFraction = 1;
    else if (fraction < 3) niceFraction = 2;
    else if (fraction < 7) niceFraction = 5;
    else niceFraction = 10;
  } else {
    if (fraction <= 1) niceFraction = 1;
    else if (fraction <= 2) niceFraction = 2;
    else if (fraction <= 5) niceFraction = 5;
    else niceFraction = 10;
  }

  return niceFraction * Math.pow(10, exponent);
};

const getNiceAxisBounds = (rawMin: number, rawMax: number, maxTicks = 6) => {
  // Sempre inclui o zero no intervalo (linha de base do gráfico).
  const min = Math.min(rawMin, 0);
  const max = Math.max(rawMax, 0);

  if (min === 0 && max === 0) {
    return { min: 0, max: 1000, step: 200 };
  }

  const range = niceNum(max - min, false);
  const step = niceNum(range / (maxTicks - 1), true);
  const niceMin = Math.floor(min / step) * step;
  const niceMax = Math.ceil(max / step) * step;

  return { min: niceMin, max: niceMax, step };
};

type RawExpense = {
  id: number;
  valueExpense: number | string;
  dateExpense: string; // "2026-01-15" ou "2026-01-15T00:00:00.000000Z"
};

type RawRevenue = {
  id: number;
  valueRevenue: number | string;
  dateRevenue: string;
};

/**
 * As rotas de listagem usam `Resource::collection(...)`, que por padrão o
 * Laravel embrulha em `{ data: [...] }`. Isso torna a normalização segura
 * independente de o backend estar (ou vir a estar) com `withoutWrapping()`.
 */
function extractArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (
    payload &&
    typeof payload === "object" &&
    Array.isArray((payload as any).data)
  ) {
    return (payload as any).data as T[];
  }
  return [];
}

/**
 * Extrai ano/mês direto da string, sem passar por `new Date(str)`.
 * Evita o bug de timezone (mostrar o dia/mês anterior) porque não
 * deixa o motor de JS reinterpretar a data como UTC e converter
 * para o fuso local na hora de ler getFullYear()/getMonth().
 */
const parseYearMonth = (dateStr: string) => {
  const datePart = dateStr.split("T")[0];
  const [year, month] = datePart.split("-").map(Number);
  return { year, monthIndex: month - 1 };
};

/**
 * Agrupa uma lista de lançamentos (despesas ou receitas) em um
 * array de 12 posições (Jan..Dez) somando os valores do ano filtrado.
 */
function aggregateByMonth<T>(
  items: T[],
  year: number,
  getDate: (item: T) => string,
  getValue: (item: T) => number | string
): number[] {
  const monthly = Array(12).fill(0);
  if (!Array.isArray(items)) return monthly;
  for (const item of items) {
    const { year: itemYear, monthIndex } = parseYearMonth(getDate(item));
    if (itemYear === year && monthIndex >= 0 && monthIndex < 12) {
      monthly[monthIndex] += Number(getValue(item)) || 0;
    }
  }
  return monthly;
}

export default function ChartsScreen() {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isMobile = width < 1024;
  const styles = getChartsStyles(colors, isMobile);

  // Filtro de Data: Somente Ano
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [yearInputText, setYearInputText] = useState<string>(
    selectedYear.toString()
  );
  const [isYearFocused, setIsYearFocused] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  // Visibilidade dos 3 dados
  const [showExpenses, setShowExpenses] = useState(true);
  const [showIncomes, setShowIncomes] = useState(true);
  const [showTotal, setShowTotal] = useState(true);

  // Dados vindos da API (buscados uma vez; a filtragem por ano é feita no client)
  const [rawExpenses, setRawExpenses] = useState<RawExpense[]>([]);
  const [rawRevenues, setRawRevenues] = useState<RawRevenue[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoadingData(true);
      setLoadError(null);
      try {
        const [expensesRes, revenuesRes] = await Promise.all([
          api.get<RawExpense[]>("/expenses"),
          api.get<RawRevenue[]>("/revenues"),
        ]);

        if (!isMounted) return;
        setRawExpenses(extractArray<RawExpense>(expensesRes.data));
        setRawRevenues(extractArray<RawRevenue>(revenuesRes.data));
      } catch (err) {
        console.warn("Falha ao buscar dados do gráfico:", err);
        if (isMounted) {
          setLoadError("Não foi possível carregar os dados. Tente novamente.");
        }
      } finally {
        if (isMounted) setIsLoadingData(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Agrega os dados brutos por mês, refazendo o cálculo sempre que o ano
  // selecionado (ou os dados recebidos da API) mudarem.
  const monthlyExpenses = useMemo(
    () =>
      aggregateByMonth(
        rawExpenses,
        selectedYear,
        (e) => e.dateExpense,
        (e) => e.valueExpense
      ),
    [rawExpenses, selectedYear]
  );

  const monthlyIncomes = useMemo(
    () =>
      aggregateByMonth(
        rawRevenues,
        selectedYear,
        (r) => r.dateRevenue,
        (r) => r.valueRevenue
      ),
    [rawRevenues, selectedYear]
  );

  const cardBg = colors.surface || "#242A33";

  const handleYearInputChange = (text: string) => {
    setYearInputText(text);
    if (text.length === 4) {
      const parsedYear = Number(text);
      if (parsedYear >= 1900 && parsedYear <= 2100) {
        setSelectedYear(parsedYear);
      }
    }
  };

  const getYearsList = (currentYear: number) => {
    const years = [];
    for (let i = currentYear - 4; i <= currentYear + 4; i++) {
      years.push(i);
    }
    return years;
  };

  const handleSelectYear = (year: number) => {
    setSelectedYear(year);
    setYearInputText(year.toString());
    setShowYearPicker(false);
  };

  // Cálculo de Totais
  const totals = monthlyIncomes.map((inc, idx) => inc - monthlyExpenses[idx]);

  // Preparação de Datasets para o LineChart
  const activeDatasetsLine = [];
  if (showExpenses) {
    activeDatasetsLine.push({
      data: monthlyExpenses,
      color: (opacity = 1) => `rgba(229, 62, 62, ${opacity})`,
      strokeWidth: 2.5,
    });
  }
  if (showIncomes) {
    activeDatasetsLine.push({
      data: monthlyIncomes,
      color: (opacity = 1) => `rgba(56, 161, 105, ${opacity})`,
      strokeWidth: 2.5,
    });
  }
  if (showTotal) {
    activeDatasetsLine.push({
      data: totals,
      color: (opacity = 1) => `rgba(49, 130, 206, ${opacity})`,
      strokeWidth: 2.5,
    });
  }

  const lineChartData = {
    labels: MONTHS_SHORT,
    datasets:
      activeDatasetsLine.length > 0
        ? activeDatasetsLine
        : [{ data: Array(12).fill(0), color: () => GRID_LINE_COLOR }],
  };

  // Cálculos de dimensão dos cards
  const sidebarWidth = isMobile ? 0 : 250;
  const horizontalPadding = isMobile ? 32 : 64;
  const gapWidth = isMobile ? 0 : 20;
  const availableWidth = width - sidebarWidth - horizontalPadding;
  const cardWidth = isMobile ? availableWidth : (availableWidth - gapWidth) / 2;
  const chartWidth = Math.max(cardWidth - 32, 280);
  const chartHeight = 280;

  const baseChartConfig = {
    backgroundColor: cardBg,
    backgroundGradientFrom: cardBg,
    backgroundGradientTo: cardBg,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(226, 232, 240, ${opacity})`,
    labelColor: () => AXIS_LABEL_COLOR,
    fillShadowGradientOpacity: 0.15,
    propsForBackgroundLines: {
      stroke: GRID_LINE_COLOR,
      strokeDasharray: "4",
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: cardBg,
    },
    formatYLabel: (y: string) => formatBRL(Number(y)),
    formatXLabel: (x: string) => x,
  };

  // Renderizador do Gráfico de Barras Agrupadas Customizado em SVG
  const renderGroupedBarChart = () => {
    const activeSeriesCount =
      (showExpenses ? 1 : 0) + (showIncomes ? 1 : 0) + (showTotal ? 1 : 0);

    if (activeSeriesCount === 0) {
      return (
        <View style={styles.chartCardEmpty}>
          <Text style={styles.chartCardEmptyText}>
            Selecione ao menos um dado acima.
          </Text>
        </View>
      );
    }

    const paddingLeft = 46;
    const paddingBottom = 30;
    const paddingTop = 20;
    const usableWidth = chartWidth - paddingLeft;
    const usableHeight = chartHeight - paddingBottom - paddingTop;

    const allValues = [
      ...(showExpenses ? monthlyExpenses : []),
      ...(showIncomes ? monthlyIncomes : []),
      ...(showTotal ? totals : []),
    ];
    const rawMax = allValues.length > 0 ? Math.max(...allValues) : 0;
    const rawMin = allValues.length > 0 ? Math.min(...allValues) : 0;
    const {
      min: minVal,
      max: maxVal,
      step,
    } = getNiceAxisBounds(rawMin, rawMax);
    const valRange = maxVal - minVal;

    const axisTicks: number[] = [];
    for (let v = minVal; v <= maxVal + step / 2; v += step) {
      axisTicks.push(Math.round(v));
    }

    const groupWidth = usableWidth / 12;
    const barWidth = Math.min(groupWidth / (activeSeriesCount + 1), 10);

    const zeroY = paddingTop + usableHeight * (maxVal / valRange);
    const valueToY = (v: number) =>
      paddingTop + usableHeight * ((maxVal - v) / valRange);

    return (
      <Svg width={chartWidth} height={chartHeight}>
        {/* Linhas de Grade + Rótulos do Eixo Y (escala dinâmica) */}
        {axisTicks.map((tickVal, i) => {
          const y = valueToY(tickVal);
          return (
            <React.Fragment key={i}>
              <Line
                x1={paddingLeft}
                y1={y}
                x2={chartWidth}
                y2={y}
                stroke={GRID_LINE_COLOR}
                strokeDasharray="4"
                strokeWidth="1"
              />
              <SvgText
                x={paddingLeft - 8}
                y={y + 4}
                fill={AXIS_LABEL_COLOR}
                fontSize="10"
                textAnchor="end"
              >
                {formatAxisNumber(tickVal)}
              </SvgText>
            </React.Fragment>
          );
        })}

        {/* Linha Zero */}
        <Line
          x1={paddingLeft}
          y1={zeroY}
          x2={chartWidth}
          y2={zeroY}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
        />

        {/* Render das Barras Agrupadas */}
        {MONTHS_SHORT.map((label, monthIdx) => {
          const groupStartX =
            paddingLeft +
            monthIdx * groupWidth +
            (groupWidth - activeSeriesCount * barWidth) / 2;

          let currentBarIndex = 0;

          return (
            <React.Fragment key={monthIdx}>
              {/* Rótulo do Mês */}
              <SvgText
                x={paddingLeft + monthIdx * groupWidth + groupWidth / 2}
                y={chartHeight - 8}
                fill={AXIS_LABEL_COLOR}
                fontSize="10"
                textAnchor="middle"
              >
                {label}
              </SvgText>

              {/* Barra: Despesas */}
              {showExpenses &&
                (() => {
                  const val = monthlyExpenses[monthIdx];
                  const barHeight = Math.abs((val / valRange) * usableHeight);
                  const x = groupStartX + currentBarIndex * barWidth;
                  const y = val >= 0 ? zeroY - barHeight : zeroY;
                  currentBarIndex++;
                  return (
                    <Rect
                      key={`exp-${monthIdx}`}
                      x={x}
                      y={y}
                      width={barWidth - 1}
                      height={Math.max(barHeight, 2)}
                      fill="#e53e3e"
                      rx={1.5}
                    />
                  );
                })()}

              {/* Barra: Receitas */}
              {showIncomes &&
                (() => {
                  const val = monthlyIncomes[monthIdx];
                  const barHeight = Math.abs((val / valRange) * usableHeight);
                  const x = groupStartX + currentBarIndex * barWidth;
                  const y = val >= 0 ? zeroY - barHeight : zeroY;
                  currentBarIndex++;
                  return (
                    <Rect
                      key={`inc-${monthIdx}`}
                      x={x}
                      y={y}
                      width={barWidth - 1}
                      height={Math.max(barHeight, 2)}
                      fill="#38a169"
                      rx={1.5}
                    />
                  );
                })()}

              {/* Barra: Sobra/Falta */}
              {showTotal &&
                (() => {
                  const val = totals[monthIdx];
                  const barHeight = Math.abs((val / valRange) * usableHeight);
                  const x = groupStartX + currentBarIndex * barWidth;
                  const y = val >= 0 ? zeroY - barHeight : zeroY;
                  currentBarIndex++;
                  return (
                    <Rect
                      key={`tot-${monthIdx}`}
                      x={x}
                      y={y}
                      width={barWidth - 1}
                      height={Math.max(barHeight, 2)}
                      fill="#3182ce"
                      rx={1.5}
                    />
                  );
                })()}
            </React.Fragment>
          );
        })}
      </Svg>
    );
  };

  return (
    <View style={styles.container}>
      <Sidebar activeScreen="Gráficos" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>
          Gráfico de Despesas e Receitas/Salários Anual
        </Text>

        {isLoadingData && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.label}>Carregando dados...</Text>
          </View>
        )}

        {loadError && !isLoadingData && (
          <Text style={[styles.label, { color: "#e53e3e", marginBottom: 16 }]}>
            {loadError}
          </Text>
        )}

        {/* Input de Ano */}
        <View style={styles.filterContainer}>
          <Text style={styles.label}>Filtrar por Ano</Text>

          <View
            style={[
              styles.dateInputWrapper,
              isYearFocused && styles.dateInputWrapperFocused,
            ]}
          >
            <TextInput
              style={[
                styles.dateTextInput,
                {
                  outlineStyle: "none",
                  outlineWidth: 0,
                  outlineColor: "transparent",
                } as any,
              ]}
              value={yearInputText}
              onChangeText={handleYearInputChange}
              onFocus={() => setIsYearFocused(true)}
              onBlur={() => setIsYearFocused(false)}
              placeholder="AAAA"
              placeholderTextColor={colors.gray || "#a0aec0"}
              keyboardType="numeric"
              maxLength={4}
              underlineColorAndroid="transparent"
            />

            <TouchableOpacity
              style={styles.calendarIconButton}
              activeOpacity={0.7}
              onPress={() => setShowYearPicker((prev) => !prev)}
            >
              <Ionicons name="calendar-outline" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {showYearPicker && (
            <View style={styles.popoverCard}>
              <View style={styles.popoverHeader}>
                <TouchableOpacity
                  onPress={() => handleSelectYear(selectedYear - 1)}
                  style={styles.arrowButton}
                >
                  <Ionicons
                    name="chevron-back"
                    size={18}
                    color={colors.textColor}
                  />
                </TouchableOpacity>

                <Text style={styles.popoverHeaderTitle}>{selectedYear}</Text>

                <TouchableOpacity
                  onPress={() => handleSelectYear(selectedYear + 1)}
                  style={styles.arrowButton}
                >
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={colors.textColor}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.pickerGrid}>
                {getYearsList(selectedYear).map((yr) => {
                  const isSelected = yr === selectedYear;
                  return (
                    <TouchableOpacity
                      key={yr}
                      style={[
                        styles.pickerGridItem,
                        isSelected && styles.pickerGridItemSelected,
                      ]}
                      onPress={() => handleSelectYear(yr)}
                    >
                      <Text
                        style={[
                          styles.pickerGridText,
                          isSelected && styles.pickerGridTextSelected,
                        ]}
                      >
                        {yr}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        </View>

        {/* Chips Legenda / Controles */}
        <View style={styles.legendContainer}>
          <TouchableOpacity
            style={styles.legendItem}
            onPress={() => setShowExpenses(!showExpenses)}
          >
            <View
              style={[
                styles.legendBadge,
                { backgroundColor: showExpenses ? "#e53e3e" : "#4a5568" },
              ]}
            />
            <Text style={styles.legendText}>Despesas Anuais (R$)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.legendItem}
            onPress={() => setShowIncomes(!showIncomes)}
          >
            <View
              style={[
                styles.legendBadge,
                { backgroundColor: showIncomes ? "#38a169" : "#4a5568" },
              ]}
            />
            <Text style={styles.legendText}>Receitas Anuais (R$)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.legendItem}
            onPress={() => setShowTotal(!showTotal)}
          >
            <View
              style={[
                styles.legendBadge,
                { backgroundColor: showTotal ? "#3182ce" : "#4a5568" },
              ]}
            />
            <Text style={styles.legendText}>Total sobra/falta (R$)</Text>
          </TouchableOpacity>
        </View>

        {/* Grid dos Gráficos Lado a Lado */}
        <View style={styles.chartsGrid}>
          {/* Gráfico 1: Barras Agrupadas SVG */}
          <View
            style={[styles.chartCard, { width: isMobile ? "100%" : cardWidth }]}
          >
            <Text style={styles.chartCardTitle}>Visão em Barras</Text>
            {renderGroupedBarChart()}
          </View>

          {/* Gráfico 2: Linhas */}
          <View
            style={[styles.chartCard, { width: isMobile ? "100%" : cardWidth }]}
          >
            <Text style={styles.chartCardTitle}>Visão em Linhas</Text>
            {activeDatasetsLine.length > 0 ? (
              <LineChart
                data={lineChartData}
                width={chartWidth}
                height={chartHeight}
                chartConfig={baseChartConfig}
                style={styles.chartStyle}
                withInnerLines
                withOuterLines={false}
                bezier={false}
                fromZero
              />
            ) : (
              <View style={styles.chartCardEmpty}>
                <Text style={styles.chartCardEmptyText}>
                  Selecione ao menos um dado acima.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
