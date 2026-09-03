import Sidebar from "@/components/(sidebar-menu)/sidebar-menu";
import { useTheme } from "@/context/ThemeContext";
import { api } from "@/services/api";
import getCalendarStyles from "@/styles/calendar.styles";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

const WEEK_DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS_LIST = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

type RawExpense = {
  id: number;
  nameExpense: string;
  valueExpense?: number | string;
  dateExpense: string;
};

type RawRevenue = {
  id: number;
  nameRevenue: string;
  valueRevenue?: number | string;
  dateRevenue: string;
};

type CalendarEvent = {
  id: string;
  title: string;
  value?: number;
  date: string;
  type: "expense" | "revenue";
  color: string;
};

type GridDay = {
  dateString: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
};

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

const parseIsoDate = (dateStr: string) => {
  if (!dateStr) return "";
  return dateStr.split("T")[0];
};

export default function CalendarScreen() {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const styles = getCalendarStyles(colors, isMobile);

  const today = new Date();
  const [monthYearFilter, setMonthYearFilter] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [showMonthPicker, setShowMonthPicker] = useState<boolean>(false);
  const [currentSelectedYear, setCurrentSelectedYear] = useState<number>(
    today.getFullYear()
  );

  const [rawExpenses, setRawExpenses] = useState<RawExpense[]>([]);
  const [rawRevenues, setRawRevenues] = useState<RawRevenue[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCalendarData = async () => {
      setIsLoading(true);
      try {
        const [expensesRes, revenuesRes] = await Promise.all([
          api.get<RawExpense[]>("/expenses"),
          api.get<RawRevenue[]>("/revenues"),
        ]);

        if (!isMounted) return;

        setRawExpenses(extractArray<RawExpense>(expensesRes.data));
        setRawRevenues(extractArray<RawRevenue>(revenuesRes.data));
      } catch (err) {
        console.warn("Erro ao carregar os dados do calendário:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchCalendarData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleYearChange = (delta: number) => {
    setCurrentSelectedYear((prev) => prev + delta);
  };

  const handleSelectMonth = (monthIndex: number) => {
    setMonthYearFilter(new Date(currentSelectedYear, monthIndex, 1));
    setShowMonthPicker(false);
  };

  const handleSetCurrentMonth = () => {
    const now = new Date();
    setMonthYearFilter(new Date(now.getFullYear(), now.getMonth(), 1));
    setCurrentSelectedYear(now.getFullYear());
    setShowMonthPicker(false);
  };

  const handleMonthStep = (step: number) => {
    const newDate = new Date(
      monthYearFilter.getFullYear(),
      monthYearFilter.getMonth() + step,
      1
    );
    setMonthYearFilter(newDate);
    setCurrentSelectedYear(newDate.getFullYear());
  };

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};

    const addEvent = (evt: CalendarEvent) => {
      if (!evt.date) return;
      if (!map[evt.date]) map[evt.date] = [];
      map[evt.date].push(evt);
    };

    rawExpenses.forEach((exp) =>
      addEvent({
        id: `exp-${exp.id}`,
        title: exp.nameExpense,
        value: exp.valueExpense ? Number(exp.valueExpense) : undefined,
        date: parseIsoDate(exp.dateExpense),
        type: "expense",
        color: "#EF4444",
      })
    );

    rawRevenues.forEach((rev) =>
      addEvent({
        id: `rev-${rev.id}`,
        title: rev.nameRevenue,
        value: rev.valueRevenue ? Number(rev.valueRevenue) : undefined,
        date: parseIsoDate(rev.dateRevenue),
        type: "revenue",
        color: "#22C55E",
      })
    );

    return map;
  }, [rawExpenses, rawRevenues]);

  const gridDays = useMemo(() => {
    const year = monthYearFilter.getFullYear();
    const month = monthYearFilter.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startingDayOfWeek = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days: GridDay[] = [];
    const todayStr = today.toISOString().split("T")[0];

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, prevMonthLastDay - i);
      const dateString = prevDate.toISOString().split("T")[0];
      days.push({
        dateString,
        dayNumber: prevMonthLastDay - i,
        isCurrentMonth: false,
        isToday: dateString === todayStr,
      });
    }

    for (let day = 1; day <= totalDays; day++) {
      const monthFormatted = String(month + 1).padStart(2, "0");
      const dayFormatted = String(day).padStart(2, "0");
      const dateString = `${year}-${monthFormatted}-${dayFormatted}`;

      days.push({
        dateString,
        dayNumber: day,
        isCurrentMonth: true,
        isToday: dateString === todayStr,
      });
    }

    const remainingDays = (7 - (days.length % 7)) % 7;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      const dateString = nextDate.toISOString().split("T")[0];
      days.push({
        dateString,
        dayNumber: day,
        isCurrentMonth: false,
        isToday: dateString === todayStr,
      });
    }

    return days;
  }, [monthYearFilter]);

  const formattedMonthTitle = monthYearFilter.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  return (
    <View style={styles.container}>
      <Sidebar activeScreen="Calendário" />

      <View style={styles.mainContent}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
        >
          <Text style={styles.title}>Calendário 📅</Text>

          <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>Filtrar por Mês/Ano</Text>

            <TouchableOpacity
              style={styles.customPickerTrigger}
              activeOpacity={0.8}
              onPress={() => setShowMonthPicker((prev) => !prev)}
            >
              <Text style={styles.customPickerText}>
                {String(monthYearFilter.getMonth() + 1).padStart(2, "0")}/
                {monthYearFilter.getFullYear()}
              </Text>

              <View style={styles.iconContainer}>
                <Ionicons name="calendar-outline" size={20} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            {showMonthPicker && (
              <View style={styles.popoverCard}>
                <View style={styles.popoverHeader}>
                  <TouchableOpacity
                    onPress={() => handleYearChange(-1)}
                    style={styles.arrowButton}
                  >
                    <Ionicons
                      name="chevron-back"
                      size={20}
                      color={colors?.textColor || "#FFFFFF"}
                    />
                  </TouchableOpacity>
                  <Text style={styles.popoverYearText}>
                    {currentSelectedYear}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleYearChange(1)}
                    style={styles.arrowButton}
                  >
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={colors?.textColor || "#FFFFFF"}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.monthsGrid}>
                  {MONTHS_LIST.map((monthName, index) => {
                    const isSelected =
                      index === monthYearFilter.getMonth() &&
                      currentSelectedYear === monthYearFilter.getFullYear();
                    return (
                      <TouchableOpacity
                        key={monthName}
                        style={[
                          styles.monthGridItem,
                          isSelected && styles.monthGridItemSelected,
                        ]}
                        onPress={() => handleSelectMonth(index)}
                      >
                        <Text
                          style={[
                            styles.monthGridText,
                            isSelected && styles.monthGridTextSelected,
                          ]}
                        >
                          {monthName}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={styles.popoverFooter}>
                  <TouchableOpacity onPress={handleSetCurrentMonth}>
                    <Text style={styles.footerActionText}>este mês</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {isLoading ? (
            <ActivityIndicator
              color={colors?.primary || "#3182CE"}
              style={styles.loader}
            />
          ) : (
            <View style={styles.calendarCard}>
              <View style={styles.calendarHeaderControls}>
                <View style={styles.headerLeftControls}>
                  <TouchableOpacity
                    style={styles.navBtn}
                    onPress={() => handleMonthStep(-1)}
                  >
                    <Ionicons
                      name="chevron-back"
                      size={16}
                      color={colors?.textColor || "#FFFFFF"}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.navBtn}
                    onPress={() => handleMonthStep(1)}
                  >
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={colors?.textColor || "#FFFFFF"}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.navBtn}
                    onPress={handleSetCurrentMonth}
                  >
                    <Text style={styles.navBtnText}>Hoje</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.currentMonthTitle}>
                  {formattedMonthTitle}
                </Text>
              </View>

              <View style={styles.weekDaysHeader}>
                {WEEK_DAYS.map((dayName, index) => (
                  <View
                    key={dayName}
                    style={[
                      styles.weekDayCell,
                      index === 6 && { borderRightWidth: 0 },
                    ]}
                  >
                    <Text style={styles.weekDayText}>{dayName}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.daysGrid}>
                {gridDays.map((dayItem, index) => {
                  const dayEvents = eventsByDate[dayItem.dateString] || [];
                  const isFirstColumn = index % 7 === 0;

                  return (
                    <View
                      key={`${dayItem.dateString}-${index}`}
                      style={[
                        styles.dayCell,
                        !dayItem.isCurrentMonth && styles.otherMonthCell,
                        dayItem.isToday && styles.todayCell,
                        !isFirstColumn && { borderLeftWidth: 0 }, // Evita borda dupla entre colunas
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayNumber,
                          !dayItem.isCurrentMonth && styles.otherMonthDayNumber,
                        ]}
                      >
                        {dayItem.dayNumber}
                      </Text>

                      <View style={styles.eventsContainer}>
                        {dayEvents.map((evt) => (
                          <View key={evt.id} style={styles.eventCard}>
                            <View
                              style={[
                                styles.eventDot,
                                { backgroundColor: evt.color },
                              ]}
                            />
                            <Text
                              style={styles.eventText}
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              {evt.title}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
