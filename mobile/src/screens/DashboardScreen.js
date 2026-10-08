import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '../components/native/AppHeader';
import { DonutChart } from '../components/native/DonutChart';
import { ProgressBar } from '../components/native/ProgressBar';
import { StatusBadge } from '../components/native/StatusBadge';
import { NotificationModal } from '../components/native/NotificationModal';
import { mobileApi } from '../services/api';
import { offlineSyncService } from '../services/offlineSyncService';
import { useMobileTheme } from '../context/MobileThemeContext';

export const DashboardScreen = ({ navigation }) => {
  const { theme, isDark } = useMobileTheme();
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
    projectsInProgress: 0,
    completionRate: 0,
    completedPct: 0,
    inProgressPct: 0,
    pendingPct: 0,
    urgentTasks: 0,
    dueThisWeek: 0,
    activeProjects: [],
  });
  const [pendingQueueCount, setPendingQueueCount] = useState(0);
  const [syncWarningVisible, setSyncWarningVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [quarterDropdown, setQuarterDropdown] = useState('This Quarter');
  const [periodPickerOpen, setPeriodPickerOpen] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const checkSyncQueue = async () => {
    const queue = await offlineSyncService.getQueue();
    setPendingQueueCount(queue.length);
    setSyncWarningVisible(queue.length > 0);
  };

  const fetchStats = async () => {
    try {
      await checkSyncQueue();
      // Map dropdown to API range
      const rangeMap = {
        'This Quarter': 'this_quarter',
        'This Month': 'this_month',
        'This Week': 'this_week',
      };
      const range = rangeMap[quarterDropdown] || 'this_quarter';
      const res = await mobileApi.getDashboardSummary(range);
      if (res.success && res.data) {
        setStats({
          totalProjects: res.data.totalProjects ?? 0,
          totalTasks: res.data.totalTasks ?? 0,
          completedTasks: res.data.completedTasks ?? 0,
          inProgressTasks: res.data.inProgressTasks ?? 0,
          pendingTasks: res.data.pendingTasks ?? 0,
          projectsInProgress: res.data.projectsInProgress ?? 0,
          completionRate: res.data.completionRate ?? 0,
          completedPct: res.data.completedPct ?? 0,
          inProgressPct: res.data.inProgressPct ?? 0,
          pendingPct: res.data.pendingPct ?? 0,
          urgentTasks: res.data.urgentTasks ?? 0,
          dueThisWeek: res.data.dueThisWeek ?? 0,
          activeProjects: res.data.activeProjects ?? [],
        });
      }
    } catch (err) {
      console.warn('Dashboard fetch failed, keeping current data:', err.message);
    } finally {
      setRefreshing(false);
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [quarterDropdown]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStats();
  }, []);

  const handleRetrySync = async () => {
    const res = await offlineSyncService.syncQueue();
    if (res.success) {
      setSyncWarningVisible(false);
      setPendingQueueCount(0);
    } else {
      setPendingQueueCount(res.remaining);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: isDark ? '#090D16' : '#FFFFFF' },
      ]}
    >
      <AppHeader
        title="ProjectFlow"
        onNotificationPress={() => setNotificationOpen(true)}
        rightAction="avatar"
        userInitials="AM"
      />

      <ScrollView
        style={[
          styles.container,
          { backgroundColor: isDark ? '#090D16' : '#F8FAFC' },
        ]}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2563EB']}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Top Greeting */}
        <View style={styles.greetingRow}>
          <View>
            <Text
              style={[
                styles.greetingTitle,
                { color: isDark ? '#FFFFFF' : '#0F172A' },
              ]}
            >
              Good morning, Alex
            </Text>
            <Text
              style={[
                styles.greetingSubtitle,
                { color: isDark ? '#94A3B8' : '#64748B' },
              ]}
            >
              Overview of your team's workload
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.periodSelector,
              { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' },
            ]}
            onPress={() => setPeriodPickerOpen(!periodPickerOpen)}
          >
            <Text style={styles.periodText}>{quarterDropdown}</Text>
            <Ionicons name="chevron-down" size={14} color="#2563EB" />
          </TouchableOpacity>
        </View>

        {/* Period Picker Options */}
        {periodPickerOpen && (
          <View
            style={[
              styles.periodCard,
              {
                backgroundColor: isDark ? '#131B2E' : '#FFFFFF',
                borderColor: isDark ? '#1E293B' : '#E2E8F0',
              },
            ]}
          >
            {['This Quarter', 'This Month', 'This Year', 'All Time'].map((p) => (
              <TouchableOpacity
                key={p}
                style={styles.periodOption}
                onPress={() => {
                  setQuarterDropdown(p);
                  setPeriodPickerOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.periodOptionText,
                    {
                      color:
                        quarterDropdown === p
                          ? '#2563EB'
                          : isDark
                          ? '#CBD5E1'
                          : '#334155',
                      fontWeight: quarterDropdown === p ? '700' : '500',
                    },
                  ]}
                >
                  {p}
                </Text>
                {quarterDropdown === p && (
                  <Ionicons name="checkmark" size={16} color="#2563EB" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Sync Warning Card (Only shown if genuinely pending updates exist) */}
        {syncWarningVisible && (
          <View style={styles.syncCard}>
            <View style={styles.syncHeader}>
              <View style={styles.syncLeft}>
                <Ionicons name="warning-outline" size={18} color="#D97706" />
                <Text style={styles.syncTitle}>Sync warning</Text>
              </View>
              <TouchableOpacity onPress={() => setSyncWarningVisible(false)}>
                <Ionicons name="close" size={16} color="#92400E" />
              </TouchableOpacity>
            </View>
            <Text style={styles.syncBody}>
              {pendingQueueCount > 0
                ? `${pendingQueueCount} task updates pending offline sync`
                : 'Some task updates pending offline sync'}
            </Text>
            <TouchableOpacity style={styles.syncButton} onPress={handleRetrySync}>
              <Ionicons name="refresh" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.syncButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* System Metrics Section */}
        <View style={styles.sectionHeaderRow}>
          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? '#FFFFFF' : '#0F172A' },
            ]}
          >
            System Metrics
          </Text>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>View breakdown</Text>
          </TouchableOpacity>
        </View>

        {/* 2x2 Grid */}
        <View style={styles.metricsGrid}>
          {/* Card 1: Projects */}
          <View
            style={[
              styles.metricCard,
              {
                backgroundColor: isDark ? '#131B2E' : '#FFFFFF',
                borderColor: isDark ? '#1E293B' : '#E2E8F0',
              },
            ]}
          >
            <View style={styles.metricCardHeader}>
              <Text style={[styles.metricLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                Projects
              </Text>
              <Ionicons name="folder-outline" size={18} color="#2563EB" />
            </View>
            <Text
              style={[
                styles.metricValue,
                { color: isDark ? '#FFFFFF' : '#0F172A' },
              ]}
            >
              {stats.totalProjects}
            </Text>
            <Text style={[styles.metricSub, { color: '#16A34A' }]}>↑ {stats.projectsInProgress} active</Text>
          </View>

          {/* Card 2: Tasks */}
          <View
            style={[
              styles.metricCard,
              {
                backgroundColor: isDark ? '#131B2E' : '#FFFFFF',
                borderColor: isDark ? '#1E293B' : '#E2E8F0',
              },
            ]}
          >
            <View style={styles.metricCardHeader}>
              <Text style={[styles.metricLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                Tasks
              </Text>
              <Ionicons name="clipboard-outline" size={18} color="#2563EB" />
            </View>
            <Text
              style={[
                styles.metricValue,
                { color: isDark ? '#FFFFFF' : '#0F172A' },
              ]}
            >
              {stats.totalTasks}
            </Text>
            <Text style={[styles.metricSub, { color: '#D97706' }]}>⏱ {stats.dueThisWeek} due wk</Text>
          </View>

          {/* Card 3: Completed */}
          <View
            style={[
              styles.metricCard,
              {
                backgroundColor: isDark ? '#131B2E' : '#FFFFFF',
                borderColor: isDark ? '#1E293B' : '#E2E8F0',
              },
            ]}
          >
            <View style={styles.metricCardHeader}>
              <Text style={[styles.metricLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                Completed
              </Text>
              <Ionicons name="checkmark-circle-outline" size={18} color="#16A34A" />
            </View>
            <Text
              style={[
                styles.metricValue,
                { color: isDark ? '#FFFFFF' : '#0F172A' },
              ]}
            >
              {stats.completedTasks}
            </Text>
            <Text style={[styles.metricSub, { color: '#16A34A' }]}>✓ {stats.completionRate}% rate</Text>
          </View>

          {/* Card 4: In Progress */}
          <View
            style={[
              styles.metricCard,
              {
                backgroundColor: isDark ? '#131B2E' : '#FFFFFF',
                borderColor: isDark ? '#1E293B' : '#E2E8F0',
              },
            ]}
          >
            <View style={styles.metricCardHeader}>
              <Text style={[styles.metricLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                In Progress
              </Text>
              <Ionicons name="sync-outline" size={18} color="#2563EB" />
            </View>
            <Text
              style={[
                styles.metricValue,
                { color: isDark ? '#FFFFFF' : '#0F172A' },
              ]}
            >
              {stats.inProgressTasks}
            </Text>
            <Text style={[styles.metricSub, { color: '#2563EB' }]}>● On schedule</Text>
          </View>
        </View>

        {/* Pending Tasks Warning Row */}
        <View
          style={[
            styles.pendingTasksRow,
            {
              backgroundColor: isDark ? '#131B2E' : '#FFFFFF',
              borderColor: isDark ? '#1E293B' : '#E2E8F0',
            },
          ]}
        >
          <View style={styles.pendingLeft}>
            <Ionicons name="flag-outline" size={16} color="#DC2626" />
            <Text
              style={[
                styles.pendingText,
                { color: isDark ? '#FFFFFF' : '#1E293B' },
              ]}
            >
              Pending Tasks: {stats.pendingTasks} total
            </Text>
          </View>
          <View style={styles.urgentBadge}>
            <Text style={styles.urgentBadgeText}>{stats.urgentTasks} urgent</Text>
          </View>
        </View>

        {/* Task Status Distribution Card */}
        <View
          style={[
            styles.chartCard,
            {
              backgroundColor: isDark ? '#131B2E' : '#FFFFFF',
              borderColor: isDark ? '#1E293B' : '#E2E8F0',
            },
          ]}
        >
          <View style={styles.chartHeader}>
            <Text
              style={[
                styles.chartTitle,
                { color: isDark ? '#FFFFFF' : '#0F172A' },
              ]}
            >
              Task Status Distribution
            </Text>
            <Ionicons name="ellipsis-vertical" size={18} color="#94A3B8" />
          </View>
          <DonutChart
            total={stats.totalTasks}
            completed={stats.completedTasks}
            inProgress={stats.inProgressTasks}
            pending={stats.pendingTasks}
          />
        </View>

        {/* Projects in Progress Section */}
        <View style={styles.sectionHeaderRow}>
          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? '#FFFFFF' : '#0F172A' },
            ]}
          >
            Projects in progress
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Projects')}>
            <Text style={styles.sectionLink}>See all ({stats.totalProjects})</Text>
          </TouchableOpacity>
        </View>

        {stats.activeProjects && stats.activeProjects.length > 0 ? (
          stats.activeProjects.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={[
                styles.projectProgressCard,
                {
                  backgroundColor: isDark ? '#131B2E' : '#FFFFFF',
                  borderColor: isDark ? '#1E293B' : '#E2E8F0',
                },
              ]}
              onPress={() => navigation.navigate('Projects', { screen: 'ProjectDetail' })}
            >
              <View style={styles.projectTopRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text
                    style={[
                      styles.projectName,
                      { color: isDark ? '#FFFFFF' : '#0F172A' },
                    ]}
                    numberOfLines={1}
                  >
                    {p.name}
                  </Text>
                  <Text style={styles.projectSub} numberOfLines={1}>
                    {p.description || 'Active sprint deliverable'}
                  </Text>
                </View>
                <StatusBadge status={p.status || 'IN_PROGRESS'} size="small" />
              </View>
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>Progress</Text>
                <Text
                  style={[
                    styles.progressPct,
                    { color: isDark ? '#FFFFFF' : '#0F172A' },
                  ]}
                >
                  {p.progressPct}%
                </Text>
              </View>
              <ProgressBar progress={p.progressPct} color="#2563EB" />
              <View style={styles.projectFooter}>
                <View style={styles.dateRow}>
                  <Ionicons name="calendar-outline" size={13} color="#64748B" />
                  <Text style={styles.dateText}>
                    {p.endDate
                      ? new Date(p.endDate).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'Ongoing'}
                  </Text>
                </View>
                <View style={styles.avatarGroup}>
                  <View style={[styles.miniAvatar, { backgroundColor: '#DBEAFE' }]}>
                    <Text style={styles.miniAvatarText}>AM</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View
            style={[
              styles.projectProgressCard,
              {
                backgroundColor: isDark ? '#131B2E' : '#FFFFFF',
                borderColor: isDark ? '#1E293B' : '#E2E8F0',
                alignItems: 'center',
                paddingVertical: 18,
              },
            ]}
          >
            <Text style={{ color: isDark ? '#94A3B8' : '#64748B', fontSize: 13 }}>
              No active projects in this period.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Notifications Modal */}
      <NotificationModal
        visible={notificationOpen}
        onClose={() => setNotificationOpen(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  greetingSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
    gap: 4,
  },
  periodText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  periodCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 6,
    marginBottom: 14,
  },
  periodOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  periodOptionText: {
    fontSize: 13,
  },
  syncCard: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 18,
  },
  syncHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  syncLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  syncTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
  },
  syncBody: {
    fontSize: 12,
    color: '#B45309',
    marginBottom: 10,
  },
  syncButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#D97706',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  syncButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  sectionLink: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 14,
    gap: 10,
  },
  metricCard: {
    width: '48%',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  metricCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  metricSub: {
    fontSize: 11,
    fontWeight: '600',
  },
  pendingTasksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  pendingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pendingText: {
    fontSize: 13,
    fontWeight: '600',
  },
  urgentBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  urgentBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  chartCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  projectProgressCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  projectTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  projectName: {
    fontSize: 14,
    fontWeight: '700',
  },
  projectSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  progressPct: {
    fontSize: 11,
    fontWeight: '700',
  },
  projectFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 11,
    color: '#64748B',
  },
  avatarGroup: {
    flexDirection: 'row',
  },
  miniAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  miniAvatarText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#1E293B',
  },
});
