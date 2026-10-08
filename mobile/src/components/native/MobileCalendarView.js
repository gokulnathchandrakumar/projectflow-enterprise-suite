import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobileTheme } from '../../context/MobileThemeContext';
import { PriorityBadge } from './StatusBadge';

export const MobileCalendarView = ({ tasks = [], onSelectTask }) => {
  const { theme, isDark } = useMobileTheme();
  const [currentDate, setCurrentDate] = useState(new Date(2024, 9, 1)); // Default Oct 2024 to match seed
  const [selectedDateStr, setSelectedDateStr] = useState('2024-10-18');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => {
    const now = new Date();
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
    const pad = (n) => String(n).padStart(2, '0');
    setSelectedDateStr(`${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`);
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Grid calculations
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const calendarDays = [];

  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const m = month === 0 ? 12 : month;
    const y = month === 0 ? year - 1 : year;
    const pad = (n) => String(n).padStart(2, '0');
    calendarDays.push({ day: d, isCurrentMonth: false, dateStr: `${y}-${pad(m)}-${pad(d)}` });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const pad = (n) => String(n).padStart(2, '0');
    calendarDays.push({ day: d, isCurrentMonth: true, dateStr: `${year}-${pad(month + 1)}-${pad(d)}` });
  }

  const remaining = (7 - (calendarDays.length % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    const m = month + 2 > 12 ? 1 : month + 2;
    const y = month + 2 > 12 ? year + 1 : year;
    const pad = (n) => String(n).padStart(2, '0');
    calendarDays.push({ day: d, isCurrentMonth: false, dateStr: `${y}-${pad(m)}-${pad(d)}` });
  }

  // Group tasks by date
  const tasksByDate = {};
  tasks.forEach((t) => {
    // Check dueDate or dueDateText
    let key = '';
    if (t.dueDate) {
      key = t.dueDate.split('T')[0];
    } else if (t.dueDateText) {
      if (t.dueDateText.includes('Oct 18')) key = '2024-10-18';
      else if (t.dueDateText.includes('Oct 22')) key = '2024-10-22';
      else if (t.dueDateText.includes('Oct 25')) key = '2024-10-25';
      else if (t.dueDateText.includes('Oct 31')) key = '2024-10-31';
      else if (t.dueDateText.includes('Nov 15')) key = '2024-11-15';
    }
    if (key) {
      if (!tasksByDate[key]) tasksByDate[key] = [];
      tasksByDate[key].push(t);
    }
  });

  const selectedTasks = tasksByDate[selectedDateStr] || [];

  return (
    <View style={styles.container}>
      {/* Calendar Card */}
      <View
        style={[
          styles.calendarCard,
          {
            backgroundColor: isDark ? '#131B2E' : '#FFFFFF',
            borderColor: isDark ? '#1E293B' : '#E2E8F0',
          },
        ]}
      >
        {/* Navigation header */}
        <View style={styles.navRow}>
          <Text
            style={[
              styles.monthTitle,
              { color: isDark ? '#FFFFFF' : '#0F172A' },
            ]}
          >
            {monthName}
          </Text>

          <View style={styles.navActions}>
            <TouchableOpacity onPress={goToToday} style={styles.todayButton}>
              <Text style={styles.todayText}>Today</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={prevMonth} style={styles.arrowButton}>
              <Ionicons
                name="chevron-back"
                size={18}
                color={isDark ? '#94A3B8' : '#475569'}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={nextMonth} style={styles.arrowButton}>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={isDark ? '#94A3B8' : '#475569'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Weekday headers */}
        <View style={styles.weekdaysRow}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((w, idx) => (
            <Text
              key={idx}
              style={[
                styles.weekdayText,
                { color: isDark ? '#64748B' : '#94A3B8' },
              ]}
            >
              {w}
            </Text>
          ))}
        </View>

        {/* Days grid */}
        <View style={styles.daysGrid}>
          {calendarDays.map((cell) => {
            const dateTasks = tasksByDate[cell.dateStr] || [];
            const hasTasks = dateTasks.length > 0;
            const hasOverdue = dateTasks.some((t) => t.isOverdue || t.status === 'HIGH');
            const isSelected = selectedDateStr === cell.dateStr;

            return (
              <TouchableOpacity
                key={cell.dateStr}
                onPress={() => setSelectedDateStr(cell.dateStr)}
                style={[
                  styles.dayCell,
                  isSelected && styles.dayCellSelected,
                  !cell.isCurrentMonth && styles.dayCellOutside,
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    {
                      color: isSelected
                        ? '#FFFFFF'
                        : cell.isCurrentMonth
                        ? isDark
                          ? '#FFFFFF'
                          : '#0F172A'
                        : isDark
                        ? '#475569'
                        : '#CBD5E1',
                    },
                    isSelected && { fontWeight: '700' },
                  ]}
                >
                  {cell.day}
                </Text>

                {/* Deadline indicator dot */}
                {hasTasks && (
                  <View
                    style={[
                      styles.taskDot,
                      {
                        backgroundColor: isSelected
                          ? '#FFFFFF'
                          : hasOverdue
                          ? '#DC2626'
                          : '#2563EB',
                      },
                    ]}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Legend */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.dotSmall, { backgroundColor: '#DC2626' }]} />
            <Text style={[styles.legendText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              Overdue
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dotSmall, { backgroundColor: '#2563EB' }]} />
            <Text style={[styles.legendText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              Deliverable Due
            </Text>
          </View>
        </View>
      </View>

      {/* Selected Day Agenda */}
      <View style={styles.agendaSection}>
        <Text
          style={[
            styles.agendaHeader,
            { color: isDark ? '#94A3B8' : '#475569' },
          ]}
        >
          DELIVERABLES FOR {selectedDateStr}
        </Text>

        {selectedTasks.length === 0 ? (
          <View
            style={[
              styles.emptyCard,
              {
                backgroundColor: isDark ? '#131B2E' : '#FFFFFF',
                borderColor: isDark ? '#1E293B' : '#E2E8F0',
              },
            ]}
          >
            <Ionicons name="calendar-outline" size={24} color="#94A3B8" />
            <Text
              style={[
                styles.emptyText,
                { color: isDark ? '#64748B' : '#94A3B8' },
              ]}
            >
              No milestones due on this date.
            </Text>
          </View>
        ) : (
          selectedTasks.map((t) => (
            <TouchableOpacity
              key={t.id}
              onPress={() => onSelectTask?.(t)}
              style={[
                styles.agendaCard,
                {
                  backgroundColor: isDark ? '#131B2E' : '#FFFFFF',
                  borderColor: isDark ? '#1E293B' : '#E2E8F0',
                },
              ]}
            >
              <View style={styles.agendaTop}>
                <Text
                  style={[
                    styles.agendaTaskName,
                    { color: isDark ? '#FFFFFF' : '#0F172A' },
                    t.completed && { textDecorationLine: 'line-through', color: '#94A3B8' },
                  ]}
                >
                  {t.name}
                </Text>
                <PriorityBadge priority={t.priority} />
              </View>

              <View style={styles.agendaMeta}>
                <Ionicons name="time-outline" size={13} color="#64748B" />
                <Text style={styles.agendaDateText}>
                  {t.dueDateText || t.dueDate || selectedDateStr}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  calendarCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  navActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  todayButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  todayText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563EB',
  },
  arrowButton: {
    padding: 6,
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: '700',
    width: 38,
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  dayCell: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 3,
    borderRadius: 19,
    position: 'relative',
  },
  dayCellSelected: {
    backgroundColor: '#2563EB',
  },
  dayCellOutside: {
    opacity: 0.4,
  },
  dayText: {
    fontSize: 13,
    fontWeight: '500',
  },
  taskDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    bottom: 4,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 11,
  },
  agendaSection: {
    gap: 8,
  },
  agendaHeader: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  emptyCard: {
    padding: 24,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    gap: 6,
  },
  emptyText: {
    fontSize: 12,
  },
  agendaCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  agendaTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  agendaTaskName: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  agendaMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  agendaDateText: {
    fontSize: 12,
    color: '#64748B',
  },
});
