import Sidebar from "@/components/(sidebar-menu)/sidebar-menu";
import { useTheme } from "@/context/ThemeContext";
import { api } from "@/services/api";
import { getChartsStyles } from "@/styles/charts.styles";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import Svg, {
  Circle,
  Line,
  Polygon,
  Polyline,
  Rect,
  Text as SvgText,
} from "react-native-svg";

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

const formatBRLPrecise = (value: number) =>
  value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

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
  const { width, height } = useWindowDimensions();
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

  // Tooltip do gráfico de barras: aparece no hover (web/desktop) ou no tap (touch)
  const [hoveredBar, setHoveredBar] = useState<{
    month: string;
    label: string;
    color: string;
    value: number;
    x: number;
    y: number;
  } | null>(null);

  const [hoveredLinePoint, setHoveredLinePoint] = useState<{
    month: string;
    label: string;
    color: string;
    value: number;
    x: number;
    y: number;
  } | null>(null);

  const [rawExpenses, setRawExpenses] = useState<RawExpense[]>([]);
  const [rawRevenues, setRawRevenues] = useState<RawRevenue[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Altura do bloco acima dos gráficos (título + filtro de ano + legenda).
  // Medida em tempo real via onLayout para que o cálculo da altura dos
  // gráficos funcione em qualquer tamanho de tela/fonte, sem valores fixos.
  const [topBlockHeight, setTopBlockHeight] = useState(0);

  // Largura real da área de conteúdo (ao lado da sidebar), medida via
  // onLayout no próprio ScrollView. Evita chutar a largura da sidebar
  // (ex: "250") — se a sidebar mudar de tamanho, o cálculo continua certo.
  const [scrollAreaWidth, setScrollAreaWidth] = useState(0);

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

  // Cálculos de dimensão dos cards
  // Precisa bater exatamente com o paddingLeft + paddingRight de
  // styles.content (charts.styles.ts). Um valor diferente aqui faz os
  // cards ficarem mais largos que o espaço realmente disponível, empurrando
  // o card da direita ("Visão em Linhas") para fora da margem da tela.
  const horizontalPadding = isMobile ? 12 + 12 : 44 + 44;
  const gapWidth = isMobile ? 0 : 20;
  // Usa a largura medida do ScrollView (já exclui a sidebar automaticamente,
  // pois o ScrollView é o irmão flex:1 da Sidebar). Enquanto não mede
  // (primeiro render = 0), cai no `width` da janela como aproximação inicial.
  const baseWidth = scrollAreaWidth > 0 ? scrollAreaWidth : width;
  const availableWidth = baseWidth - horizontalPadding;
  const cardWidth = isMobile ? availableWidth : (availableWidth - gapWidth) / 2;
  const chartWidth = Math.max(cardWidth - 32, 280);

  // Altura dinâmica do gráfico: em vez de um valor fixo (280), calcula o
  // espaço vertical que sobrou na tela — mesmo princípio do Calendário, que
  // estica as linhas da grade até preencher a altura disponível.
  //   altura da tela
  // - padding vertical do ScrollView (styles.content)
  // - bloco medido acima do grid (título + filtro + legenda)
  // - "moldura" do card (padding do chartCard + título do card)
  const CONTENT_VERTICAL_PADDING = isMobile ? 64 + 90 : 44 + 44;
  const CHART_CARD_CHROME = 16 * 2 + 16 + 16; // padding do card + título + margem
  const MIN_CHART_HEIGHT = 280;
  const chartHeight = Math.max(
    height - CONTENT_VERTICAL_PADDING - topBlockHeight - CHART_CARD_CHROME - 20, // respiro extra antes do grid
    MIN_CHART_HEIGHT
  );

  // --- Escala compartilhada entre os dois gráficos (Barras e Linhas) ---
  // Ambos usam exatamente os mesmos limites/ticks de eixo Y e a mesma
  // posição X por mês, para que a numeração, as linhas de grade e o
  // alinhamento dos meses fiquem idênticos nos dois gráficos.
  const activeSeriesCount =
    (showExpenses ? 1 : 0) + (showIncomes ? 1 : 0) + (showTotal ? 1 : 0);

  const allValues = [
    ...(showExpenses ? monthlyExpenses : []),
    ...(showIncomes ? monthlyIncomes : []),
    ...(showTotal ? totals : []),
  ];
  const rawMax = allValues.length > 0 ? Math.max(...allValues) : 0;
  const rawMin = allValues.length > 0 ? Math.min(...allValues) : 0;
  const { min: minVal, max: maxVal, step } = getNiceAxisBounds(rawMin, rawMax);
  const valRange = maxVal - minVal;

  const axisTicks: number[] = [];
  for (let v = minVal; v <= maxVal + step / 2; v += step) {
    axisTicks.push(Math.round(v));
  }

  const CHART_PADDING_LEFT = 46;
  const CHART_PADDING_TOP = 20;
  const CHART_PADDING_BOTTOM = 30;
  const usableWidth = chartWidth - CHART_PADDING_LEFT;
  const usableHeight = chartHeight - CHART_PADDING_BOTTOM - CHART_PADDING_TOP;
  const groupWidth = usableWidth / 12;

  const valueToY = (v: number) =>
    CHART_PADDING_TOP + usableHeight * ((maxVal - v) / valRange);
  const zeroY = valueToY(0);
  // Posição X de cada mês (centro da "coluna" do mês) — usada tanto para o
  // rótulo do mês quanto para os pontos do gráfico de linhas.
  const monthX = (monthIdx: number) =>
    CHART_PADDING_LEFT + monthIdx * groupWidth + groupWidth / 2;

  const renderGroupedBarChart = () => {
    if (activeSeriesCount === 0) {
      return (
        <View style={styles.chartCardEmpty}>
          <Text style={styles.chartCardEmptyText}>
            Selecione ao menos um dado acima.
          </Text>
        </View>
      );
    }

    const paddingLeft = CHART_PADDING_LEFT;
    const barWidth = Math.min(groupWidth / (activeSeriesCount + 1), 10);

    const barHitboxes: Array<{
      key: string;
      month: string;
      label: string;
      color: string;
      value: number;
      x: number;
      y: number;
      width: number;
      height: number;
    }> = [];

    MONTHS_SHORT.forEach((label, monthIdx) => {
      const groupStartX =
        paddingLeft +
        monthIdx * groupWidth +
        (groupWidth - activeSeriesCount * barWidth) / 2;

      let currentBarIndex = 0;

      const addBar = (
        show: boolean,
        seriesLabel: string,
        color: string,
        value: number | undefined,
        key: string
      ) => {
        if (!show) return;

        const safeValue = Number(value) || 0;
        const barHeight = Math.abs((safeValue / valRange) * usableHeight);
        const x = groupStartX + currentBarIndex * barWidth;
        const y = safeValue >= 0 ? zeroY - barHeight : zeroY;

        barHitboxes.push({
          key,
          month: label,
          label: seriesLabel,
          color,
          value: safeValue,
          x,
          y,
          width: Math.max(barWidth - 1, 1),
          height: Math.max(barHeight, 2),
        });

        currentBarIndex++;
      };

      addBar(
        showExpenses,
        "Despesas Anuais",
        "#e53e3e",
        monthlyExpenses[monthIdx],
        `exp-${monthIdx}`
      );
      addBar(
        showIncomes,
        "Receitas Anuais",
        "#38a169",
        monthlyIncomes[monthIdx],
        `inc-${monthIdx}`
      );
      addBar(
        showTotal,
        "Total sobra/falta",
        "#3182ce",
        totals[monthIdx],
        `tot-${monthIdx}`
      );
    });

    return (
      <View style={{ position: "relative" }}>
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
                        width={Math.max(barWidth - 1, 1)}
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
                        width={Math.max(barWidth - 1, 1)}
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
                        width={Math.max(barWidth - 1, 1)}
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

        {barHitboxes.map((bar) => (
          <Pressable
            key={`hit-${bar.key}`}
            onHoverIn={() =>
              setHoveredBar({
                month: bar.month,
                label: bar.label,
                color: bar.color,
                value: bar.value,
                x: bar.x,
                y: bar.y,
              })
            }
            onHoverOut={() => setHoveredBar(null)}
            onPress={() =>
              setHoveredBar((prev) =>
                prev &&
                prev.x === bar.x &&
                prev.y === bar.y &&
                prev.label === bar.label
                  ? null
                  : {
                      month: bar.month,
                      label: bar.label,
                      color: bar.color,
                      value: bar.value,
                      x: bar.x,
                      y: bar.y,
                    }
              )
            }
            style={{
              position: "absolute",
              left: bar.x,
              top: bar.y,
              width: bar.width,
              height: bar.height,
            }}
          />
        ))}

        {hoveredBar && (
          <View
            style={[
              styles.tooltipContainer,
              {
                pointerEvents: "none",
                left: Math.min(
                  Math.max(hoveredBar.x - 70, 4),
                  chartWidth - 164
                ),
                top: Math.max(hoveredBar.y - 74, 4),
              },
            ]}
          >
            <Text style={styles.tooltipMonth}>{hoveredBar.month}</Text>
            <View style={styles.tooltipRow}>
              <View
                style={[
                  styles.tooltipSwatch,
                  { backgroundColor: hoveredBar.color },
                ]}
              />
              <Text style={styles.tooltipText}>
                {hoveredBar.label}: {formatBRLPrecise(hoveredBar.value)}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderLineChart = () => {
    if (activeSeriesCount === 0) {
      return (
        <View style={styles.chartCardEmpty}>
          <Text style={styles.chartCardEmptyText}>
            Selecione ao menos um dado acima.
          </Text>
        </View>
      );
    }

    const paddingLeft = CHART_PADDING_LEFT;

    const seriesConfig: Array<{
      key: string;
      label: string;
      color: string;
      data: number[];
    }> = [];
    if (showExpenses) {
      seriesConfig.push({
        key: "expenses",
        label: "Despesas Anuais",
        color: "#e53e3e",
        data: monthlyExpenses,
      });
    }
    if (showIncomes) {
      seriesConfig.push({
        key: "incomes",
        label: "Receitas Anuais",
        color: "#38a169",
        data: monthlyIncomes,
      });
    }
    if (showTotal) {
      seriesConfig.push({
        key: "total",
        label: "Total sobra/falta",
        color: "#3182ce",
        data: totals,
      });
    }

    const pointHitboxes = seriesConfig.flatMap((series) =>
      series.data.map((val, monthIdx) => ({
        key: `${series.key}-pt-${monthIdx}`,
        month: MONTHS_SHORT[monthIdx],
        label: series.label,
        color: series.color,
        value: Number(val) || 0,
        x: monthX(monthIdx),
        y: valueToY(Number(val) || 0),
      }))
    );

    return (
      <View style={{ position: "relative" }}>
        <Svg width={chartWidth} height={chartHeight}>
          {/* Linhas de Grade + Rótulos do Eixo Y — mesma escala/numeração
              do gráfico de barras (axisTicks é compartilhado). */}
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

          <Line
            x1={paddingLeft}
            y1={zeroY}
            x2={chartWidth}
            y2={zeroY}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
          />

          {/* Rótulos dos meses: mesma posição (monthX) e estilo do
              gráfico de barras, garantindo o alinhamento embaixo. */}
          {MONTHS_SHORT.map((label, monthIdx) => (
            <SvgText
              key={`month-${monthIdx}`}
              x={monthX(monthIdx)}
              y={chartHeight - 8}
              fill={AXIS_LABEL_COLOR}
              fontSize="10"
              textAnchor="middle"
            >
              {label}
            </SvgText>
          ))}

          {/* Área sombreada abaixo de cada linha (mesmo efeito do gráfico
              antigo), fechando o polígono na linha do zero (zeroY) */}
          {seriesConfig.map((series) => {
            const linePoints = series.data.map(
              (v, i) => `${monthX(i)},${valueToY(v)}`
            );
            const lastIdx = series.data.length - 1;
            const areaPoints = [
              ...linePoints,
              `${monthX(lastIdx)},${zeroY}`,
              `${monthX(0)},${zeroY}`,
            ].join(" ");
            return (
              <Polygon
                key={`${series.key}-area`}
                points={areaPoints}
                fill={series.color}
                fillOpacity={0.15}
                stroke="none"
              />
            );
          })}

          {/* Uma linha (polyline) por série ativa */}
          {seriesConfig.map((series) => {
            const points = series.data
              .map((v, i) => `${monthX(i)},${valueToY(v)}`)
              .join(" ");
            return (
              <Polyline
                key={series.key}
                points={points}
                fill="none"
                stroke={series.color}
                strokeWidth="2.5"
              />
            );
          })}

          {/* Pontos de cada série, com hitbox expandida para hover/tap */}
          {seriesConfig.map((series) =>
            series.data.map((val, monthIdx) => {
              const px = monthX(monthIdx);
              const py = valueToY(val);
              return (
                <React.Fragment key={`${series.key}-pt-${monthIdx}`}>
                  <Circle
                    cx={px}
                    cy={py}
                    r={5}
                    fill={series.color}
                    stroke={cardBg}
                    strokeWidth={2}
                  />
                  <Circle cx={px} cy={py} r={22} fill="transparent" />
                </React.Fragment>
              );
            })
          )}
        </Svg>

        {pointHitboxes.map((point) => (
          <Pressable
            key={`hit-${point.key}`}
            onHoverIn={() =>
              setHoveredLinePoint({
                month: point.month,
                label: point.label,
                color: point.color,
                value: point.value,
                x: point.x,
                y: point.y,
              })
            }
            onHoverOut={() => setHoveredLinePoint(null)}
            onPress={() =>
              setHoveredLinePoint((prev) =>
                prev &&
                prev.x === point.x &&
                prev.y === point.y &&
                prev.label === point.label
                  ? null
                  : {
                      month: point.month,
                      label: point.label,
                      color: point.color,
                      value: point.value,
                      x: point.x,
                      y: point.y,
                    }
              )
            }
            style={{
              position: "absolute",
              left: point.x - 12,
              top: point.y - 12,
              width: 24,
              height: 24,
              borderRadius: 12,
            }}
          />
        ))}

        {hoveredLinePoint && (
          <View
            style={[
              styles.tooltipContainer,
              {
                pointerEvents: "none",
                left: Math.min(
                  Math.max(hoveredLinePoint.x - 70, 4),
                  chartWidth - 164
                ),
                top: Math.max(hoveredLinePoint.y - 65, 4),
              },
            ]}
          >
            <Text style={styles.tooltipMonth}>{hoveredLinePoint.month}</Text>
            <View style={styles.tooltipRow}>
              <View
                style={[
                  styles.tooltipSwatch,
                  { backgroundColor: hoveredLinePoint.color },
                ]}
              />
              <Text style={styles.tooltipText}>
                {hoveredLinePoint.label}:{" "}
                {formatBRLPrecise(hoveredLinePoint.value)}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Sidebar activeScreen="Gráficos" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        onLayout={(e) => setScrollAreaWidth(e.nativeEvent.layout.width)}
      >
        <View
          onLayout={(e) => setTopBlockHeight(e.nativeEvent.layout.height)}
          style={{
            position: "relative",
            zIndex: 100,
          }}
        >
          <Text style={styles.title}>📊 Gráfico de Despesas e Receitas</Text>

          {loadError && !isLoadingData && (
            <Text
              style={[styles.label, { color: "#e53e3e", marginBottom: 16 }]}
            >
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

              <Pressable
                style={styles.calendarIconButton}
                onPress={() => setShowYearPicker((prev) => !prev)}
              >
                <Ionicons name="calendar-outline" size={18} color="#FFFFFF" />
              </Pressable>
            </View>

            {showYearPicker && (
              <View style={styles.popoverCard}>
                <View style={styles.popoverHeader}>
                  <Pressable
                    onPress={() => handleSelectYear(selectedYear - 1)}
                    style={styles.arrowButton}
                  >
                    <Ionicons
                      name="chevron-back"
                      size={18}
                      color={colors.textColor}
                    />
                  </Pressable>

                  <Text style={styles.popoverHeaderTitle}>{selectedYear}</Text>

                  <Pressable
                    onPress={() => handleSelectYear(selectedYear + 1)}
                    style={styles.arrowButton}
                  >
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={colors.textColor}
                    />
                  </Pressable>
                </View>

                <View style={styles.pickerGrid}>
                  {getYearsList(selectedYear).map((yr) => {
                    const isSelected = yr === selectedYear;
                    return (
                      <Pressable
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
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}
          </View>
          {/* Chips Legenda / Controles */}
          <View style={styles.legendContainer}>
            <Pressable
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
            </Pressable>

            <Pressable
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
            </Pressable>

            <Pressable
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
            </Pressable>
          </View>
        </View>
        {/* Grid dos Gráficos Lado a Lado */}
        {!isLoadingData ? (
          <View style={styles.chartsGrid}>
            {/* Gráfico 1: Barras Agrupadas SVG */}
            <View
              style={[
                styles.chartCard,
                { width: isMobile ? "100%" : cardWidth },
              ]}
            >
              <Text style={styles.chartCardTitle}>Visão em Barras</Text>
              {renderGroupedBarChart()}
            </View>

            {/* Gráfico 2: Linhas */}
            <View
              style={[
                styles.chartCard,
                { width: isMobile ? "100%" : cardWidth },
              ]}
            >
              <Text style={styles.chartCardTitle}>Visão em Linhas</Text>
              {renderLineChart()}
            </View>
          </View>
        ) : (
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
      </ScrollView>
    </View>
  );
}
