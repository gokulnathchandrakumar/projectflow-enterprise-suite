import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '../components/native/AppHeader';
import { PriorityBadge } from '../components/native/StatusBadge';
import { DeleteTaskModal } from '../components/native/DeleteTaskModal';
import { AddTaskModal } from './AddTaskModal';
import { MobileCalendarView } from '../components/native/MobileCalendarView';
import { NotificationModal } from '../components/native/NotificationModal';
import { mobileApi } from '../services/api';
import { theme } from '../theme/theme';
import { useMobileTheme } from '../context/MobileThemeContext';

export const TasksScreen = ({ navigation }) => {
  const themeContext = useMobileTheme();
  const theme = themeContext?.theme || defaultTheme;
  const isDark = themeContext?.isDark || false;

  const [viewMode, setViewMode] = useState('LIST'); // 'LIST' | 'CALENDAR'
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [refreshing, setRefreshing] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const [tasks, setTasks] = useState([
    {
      id: 'task-1',
      name: 'Finalize homepage wireframes',
      priority: 'HIGH',
      status: 'PENDING',
      dueDateText: 'Oct 18 (Overdue)',
      isOverdue: true,
      completed: false,
    },
    {
      id: 'task-2',
      name: 'Security review sign-off',
      priority: 'HIGH',
      status: 'PENDING',
      dueDateText: 'Oct 22, 2024',
      isOverdue: false,
      completed: false,
    },
    {
      id: 'task-3',
      name: 'Prepare vendor contract draft',
      priority: 'MEDIUM',
      status: 'PENDING',
      dueDateText: 'Oct 25, 2024',
      isOverdue: false,
      completed: false,
    },
    {
      id: 'task-4',
      name: 'Audit legacy information architecture',
      priority: 'LOW',
      status: 'COMPLETED',
      dueDateText: 'Completed',
      isOverdue: false,
      completed: true,
    },
  ]);

  const fetchTasks = async () => {
    try {
      const res = await mobileApi.getTasks({
        search: searchQuery || undefined,
        priority: selectedFilter === 'ALL' ? undefined : selectedFilter,
      });
      if (res.success && res.data?.tasks && res.data.tasks.length > 0) {
        setTasks(
          res.data.tasks.map((t) => ({
            id: t.id,
            name: t.name,
            priority: t.priority,
            status: t.status,
            dueDateText: t.dueDate ? new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Oct 25, 2024',
            isOverdue: false,
            completed: t.status === 'COMPLETED',
          }))
        );
      }
    } catch (err) {
      // Graceful local state preservation
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedFilter]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTasks();
  }, [selectedFilter]);

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          return {
            ...t,
            completed: nextCompleted,
            status: nextCompleted ? 'COMPLETED' : 'PENDING',
            dueDateText: nextCompleted ? 'Completed' : t.dueDateText,
          };
        }
        return t;
      })
    );
  };

  const handleAddTask = (data) => {
    const newTask = {
      id: `task-${Date.now()}`,
      name: data.name,
      priority: data.priority,
      status: data.status,
      dueDateText: data.dueDate,
      isOverdue: false,
      completed: false,
    };
    setTasks([newTask, ...tasks]);
    setIsAddModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (taskToDelete) {
      setTasks(tasks.filter((t) => t.id !== taskToDelete.id));
      setTaskToDelete(null);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === 'ALL' ||
      (selectedFilter === 'HIGH' && t.priority === 'HIGH') ||
      (selectedFilter === 'MEDIUM' && t.priority === 'MEDIUM') ||
      (selectedFilter === 'LOW' && t.priority === 'LOW') ||
      (selectedFilter === 'COMPLETED' && t.completed);
    return matchesSearch && matchesFilter;
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <AppHeader
        title="ProjectFlow"
        rightAction="avatar"
        userInitials="AM"
        onNotificationPress={() => setIsNotificationOpen(true)}
      />

      {/* Segmented View Mode Switcher */}
      <View style={[styles.segmentedWrapper, { backgroundColor: isDark ? '#131B2E' : '#F1F5F9' }]}>
        <TouchableOpacity
          style={[
            styles.segmentBtn,
            viewMode === 'LIST' && [styles.segmentBtnActive, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }],
          ]}
          onPress={() => setViewMode('LIST')}
        >
          <Ionicons
            name="list"
            size={15}
            color={viewMode === 'LIST' ? theme.colors.primary : theme.colors.textMuted}
          />
          <Text
            style={[
              styles.segmentText,
              { color: viewMode === 'LIST' ? theme.colors.primary : theme.colors.textMuted },
            ]}
          >
            Deliverables
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.segmentBtn,
            viewMode === 'CALENDAR' && [styles.segmentBtnActive, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }],
          ]}
          onPress={() => setViewMode('CALENDAR')}
        >
          <Ionicons
            name="calendar-outline"
            size={15}
            color={viewMode === 'CALENDAR' ? theme.colors.primary : theme.colors.textMuted}
          />
          <Text
            style={[
              styles.segmentText,
              { color: viewMode === 'CALENDAR' ? theme.colors.primary : theme.colors.textMuted },
            ]}
          >
            Calendar
          </Text>
        </TouchableOpacity>
      </View>

      {viewMode === 'CALENDAR' ? (
        <ScrollView
          style={[styles.container, { backgroundColor: theme.colors.background }]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <MobileCalendarView tasks={tasks} />
        </ScrollView>
      ) : (
        <ScrollView
          style={[styles.container, { backgroundColor: theme.colors.background }]}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Top Header Row with Add Task Button */}
          <View style={styles.headerRow}>
            <View style={styles.titleGroup}>
              <Text style={[styles.title, { color: theme.colors.text }]}>All Deliverables</Text>
              <View style={[styles.countBadge, { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' }]}>
                <Text style={styles.countText}>{tasks.length}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setIsAddModalOpen(true)}
            >
              <Ionicons name="add" size={16} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add task</Text>
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View
            style={[
              styles.searchWrapper,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Ionicons name="search-outline" size={18} color={theme.colors.textMuted} style={{ marginRight: 8 }} />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text }]}
              placeholder="Search tasks..."
              placeholderTextColor={theme.colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
            contentContainerStyle={styles.filterContent}
          >
            {['ALL', 'HIGH', 'MEDIUM', 'LOW', 'COMPLETED'].map((filterKey) => (
              <TouchableOpacity
                key={filterKey}
                style={[
                  styles.chip,
                  {
                    backgroundColor: selectedFilter === filterKey ? theme.colors.primary : theme.colors.card,
                    borderColor: selectedFilter === filterKey ? theme.colors.primary : theme.colors.border,
                  },
                ]}
                onPress={() => setSelectedFilter(filterKey)}
              >
                <Text
                  style={[
                    styles.chipText,
                    {
                      color: selectedFilter === filterKey ? '#FFFFFF' : theme.colors.textMuted,
                    },
                  ]}
                >
                  {filterKey === 'ALL'
                    ? 'All'
                    : filterKey.charAt(0) + filterKey.slice(1).toLowerCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Task Cards */}
          <View style={styles.cardsList}>
            {filteredTasks.map((task) => (
              <View
                key={task.id}
                style={[
                  styles.taskCard,
                  {
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <View style={styles.taskTopRow}>
                  <TouchableOpacity
                    style={[styles.checkbox, task.completed && styles.checkboxActive]}
                    onPress={() => toggleTask(task.id)}
                  >
                    {task.completed && <Ionicons name="checkmark" size={13} color="#FFFFFF" />}
                  </TouchableOpacity>

                  <Text
                    style={[
                      styles.taskName,
                      { color: theme.colors.text },
                      task.completed && styles.taskNameCompleted,
                    ]}
                  >
                    {task.name}
                  </Text>

                  <TouchableOpacity
                    onPress={() => setTaskToDelete(task)}
                    style={{ padding: 4 }}
                  >
                    <Ionicons name="ellipsis-vertical" size={16} color={theme.colors.textMuted} />
                  </TouchableOpacity>
                </View>

                <View style={styles.badgesRow}>
                  <PriorityBadge priority={task.priority} />

                  {task.isOverdue ? (
                    <View style={styles.overdueBadge}>
                      <Ionicons name="time-outline" size={12} color="#DC2626" />
                      <Text style={styles.overdueText}>{task.dueDateText}</Text>
                    </View>
                  ) : task.completed ? (
                    <View style={styles.completedBadge}>
                      <Text style={styles.completedBadgeText}>Completed</Text>
                    </View>
                  ) : (
                    <View style={styles.dateBadge}>
                      <Ionicons name="calendar-outline" size={12} color={theme.colors.textMuted} />
                      <Text style={[styles.dateBadgeText, { color: theme.colors.textMuted }]}>{task.dueDateText}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Add Task Modal */}
      <AddTaskModal
        visible={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddTask}
      />

      {/* Delete Confirmation Modal */}
      <DeleteTaskModal
        visible={!!taskToDelete}
        taskName={taskToDelete?.name}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setTaskToDelete(null)}
      />

      {/* Notification Modal */}
      <NotificationModal
        visible={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  segmentedWrapper: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 3,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 8,
    gap: 6,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  countBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
  },
  filterScroll: {
    marginBottom: 14,
  },
  filterContent: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  chipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  cardsList: {
    gap: 10,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
  },
  taskTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  taskName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    flex: 1,
  },
  taskNameCompleted: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 30,
    gap: 8,
  },
  overdueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  overdueText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#DC2626',
  },
  completedBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  completedBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#15803D',
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateBadgeText: {
    fontSize: 11,
    color: '#64748B',
  },
});
