import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBadge, PriorityBadge } from '../components/native/StatusBadge';
import { ProgressBar } from '../components/native/ProgressBar';
import { DeleteTaskModal } from '../components/native/DeleteTaskModal';
import { AddTaskModal } from './AddTaskModal';
import { mobileApi } from '../services/api';
import { theme } from '../theme/theme';

export const ProjectDetailScreen = ({ route, navigation }) => {
  const projectName = route?.params?.projectName || 'Website Redesign';
  const [searchTask, setSearchTask] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Initial reference tasks matching Screenshot 3 Right exactly
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

  const toggleTaskCompletion = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newStatus = !t.completed;
          return {
            ...t,
            completed: newStatus,
            status: newStatus ? 'COMPLETED' : 'PENDING',
            dueDateText: newStatus ? 'Completed' : t.dueDateText,
          };
        }
        return t;
      })
    );
  };

  const handleAddTask = (newTaskData) => {
    const created = {
      id: `task-${Date.now()}`,
      name: newTaskData.name,
      priority: newTaskData.priority || 'HIGH',
      status: newTaskData.status || 'IN_PROGRESS',
      dueDateText: newTaskData.dueDate || '2024-10-31',
      isOverdue: false,
      completed: false,
    };
    setTasks([created, ...tasks]);
    setIsAddModalOpen(false);
  };

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      setTasks(tasks.filter((t) => t.id !== taskToDelete.id));
      setTaskToDelete(null);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchTask.toLowerCase());
    return matchesSearch;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Custom Detail Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={20} color="#2563EB" />
          <Text style={styles.backText}>Projects</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {projectName}
        </Text>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="pencil-outline" size={18} color="#0F172A" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="ellipsis-vertical" size={18} color="#0F172A" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Project Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTopRow}>
            <StatusBadge status="IN_PROGRESS" size="small" />
            <Text style={styles.sprintTag}>Q4 Strategic</Text>
          </View>

          <Text style={styles.projectTitle}>Website Redesign</Text>
          <Text style={styles.projectDescription}>
            Modernizing corporate web presence and customer portal with responsive UI patterns.
          </Text>

          {/* Details metadata */}
          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={14} color="#64748B" />
            <Text style={styles.metaText}>Due Oct 31, 2024 (in 14 days)</Text>
          </View>

          <View style={styles.metaRow}>
            <Ionicons name="person-outline" size={14} color="#64748B" />
            <Text style={styles.metaText}>Owner: Alex Morgan</Text>
          </View>

          {/* Progress */}
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressFraction}>5 of 12 completed (42%)</Text>
          </View>
          <ProgressBar progress={42} color="#2563EB" height={6} />
        </View>

        {/* Tasks Section Header */}
        <View style={styles.tasksHeaderRow}>
          <View style={styles.tasksTitleGroup}>
            <Text style={styles.tasksTitle}>Tasks</Text>
            <View style={styles.tasksCountBadge}>
              <Text style={styles.tasksCountText}>{tasks.length}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.addTaskButton}
            onPress={() => setIsAddModalOpen(true)}
          >
            <Ionicons name="add" size={16} color="#FFFFFF" />
            <Text style={styles.addTaskText}>Add task</Text>
          </TouchableOpacity>
        </View>

        {/* Search input */}
        <View style={styles.searchWrapper}>
          <Ionicons name="search-outline" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tasks..."
            placeholderTextColor="#94A3B8"
            value={searchTask}
            onChangeText={setSearchTask}
          />
        </View>

        {/* Filters dropdown row */}
        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.dropdownChip}>
            <Text style={styles.dropdownChipText}>Status: All</Text>
            <Ionicons name="chevron-down" size={13} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.dropdownChip}>
            <Text style={styles.dropdownChipText}>Priority: All</Text>
            <Ionicons name="chevron-down" size={13} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterSettingIcon}>
            <Ionicons name="options-outline" size={18} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* Tasks List */}
        <View style={styles.tasksList}>
          {filteredTasks.map((task) => (
            <View key={task.id} style={styles.taskCard}>
              <View style={styles.taskMainRow}>
                {/* Checkbox */}
                <TouchableOpacity
                  style={[styles.checkbox, task.completed && styles.checkboxActive]}
                  onPress={() => toggleTaskCompletion(task.id)}
                >
                  {task.completed && <Ionicons name="checkmark" size={13} color="#FFFFFF" />}
                </TouchableOpacity>

                {/* Name */}
                <Text
                  style={[
                    styles.taskName,
                    task.completed && styles.taskNameCompleted,
                  ]}
                >
                  {task.name}
                </Text>

                {/* Menu */}
                <TouchableOpacity
                  onPress={() => setTaskToDelete(task)}
                  style={{ padding: 4 }}
                >
                  <Ionicons name="ellipsis-vertical" size={16} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              {/* Badges Row */}
              <View style={styles.taskBadgesRow}>
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
                    <Ionicons name="calendar-outline" size={12} color="#64748B" />
                    <Text style={styles.dateBadgeText}>{task.dueDateText}</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Add Task Modal */}
      <AddTaskModal
        visible={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddTask}
      />

      {/* Delete Task Confirmation Modal */}
      <DeleteTaskModal
        visible={!!taskToDelete}
        taskName={taskToDelete?.name}
        onConfirm={confirmDeleteTask}
        onCancel={() => setTaskToDelete(null)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    maxWidth: 180,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    padding: 4,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sprintTag: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  projectDescription: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#475569',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  progressFraction: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0F172A',
  },
  tasksHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tasksTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tasksTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  tasksCountBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  tasksCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  addTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  addTaskText: {
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
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  dropdownChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  dropdownChipText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  filterSettingIcon: {
    marginLeft: 'auto',
    padding: 6,
  },
  tasksList: {
    gap: 10,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
  },
  taskMainRow: {
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
  taskBadgesRow: {
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
