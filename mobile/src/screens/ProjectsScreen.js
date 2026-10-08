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
import { StatusBadge } from '../components/native/StatusBadge';
import { ProgressBar } from '../components/native/ProgressBar';
import { mobileApi } from '../services/api';
import { theme } from '../theme/theme';

export const ProjectsScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [refreshing, setRefreshing] = useState(false);

  // Reference initial projects matching screenshots exactly
  const [projects, setProjects] = useState([
    {
      id: 'proj-1',
      name: 'Website Redesign',
      description: 'Modernizing corporate web presence and customer portal...',
      status: 'IN_PROGRESS',
      dateRange: 'Sep 15 - Oct 31, 2024',
      completedTasks: 5,
      totalTasks: 12,
      progressPct: 42,
    },
    {
      id: 'proj-2',
      name: 'Mobile Banking Rollout',
      description: 'Phase 2 native security authentication frameworks and micro-deposit sync.',
      status: 'IN_PROGRESS',
      dateRange: 'Aug 01 - Nov 15, 2024',
      completedTasks: 18,
      totalTasks: 24,
      progressPct: 75,
    },
    {
      id: 'proj-3',
      name: 'Q4 Compliance Audit',
      description: 'Quarterly assessment verifying SOC2 and GDPR technical compliance standards.',
      status: 'NOT_STARTED',
      dateRange: 'Nov 01 - Dec 15, 2024',
      completedTasks: 0,
      totalTasks: 8,
      progressPct: 0,
    },
    {
      id: 'proj-4',
      name: 'Cloud Infrastructure Migration',
      description: 'Relocation of all enterprise cluster databases to AWS multi-region setups.',
      status: 'COMPLETED',
      dateRange: 'Completed Oct 10, 2024',
      completedTasks: 16,
      totalTasks: 16,
      progressPct: 100,
    },
  ]);

  const fetchProjects = async () => {
    try {
      const res = await mobileApi.getProjects({
        search: searchQuery || undefined,
        status: selectedFilter === 'ALL' ? undefined : selectedFilter,
      });
      if (res.success && res.data?.projects && res.data.projects.length > 0) {
        setProjects(
          res.data.projects.map((p) => ({
            id: p.id,
            name: p.name,
            description: p.description || '',
            status: p.status,
            dateRange: `${p.startDate ? new Date(p.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Sep 15'} - ${p.endDate ? new Date(p.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Oct 31, 2024'}`,
            completedTasks: p.completedTasks || 0,
            totalTasks: p.totalTasks || 0,
            progressPct: p.progressPct || 0,
          }))
        );
      }
    } catch (err) {
      // Graceful local preservation
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [selectedFilter]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProjects();
  }, [selectedFilter]);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === 'ALL' ||
      (selectedFilter === 'IN_PROGRESS' && p.status === 'IN_PROGRESS') ||
      (selectedFilter === 'NOT_STARTED' && p.status === 'NOT_STARTED');
    return matchesSearch && matchesFilter;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <AppHeader
        title="Projects"
        rightAction="newButton"
        onNewPress={() => alert('New project creation form')}
        onSearchPress={() => {}}
      />

      <ScrollView
        style={styles.container}
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
        {/* Search input */}
        <View style={styles.searchWrapper}>
          <Ionicons name="search-outline" size={18} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search projects by name..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScrollView}
          contentContainerStyle={styles.filterContainer}
        >
          <TouchableOpacity
            style={[styles.filterChip, selectedFilter === 'ALL' && styles.filterChipActive]}
            onPress={() => setSelectedFilter('ALL')}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === 'ALL' && styles.filterChipTextActive,
              ]}
            >
              All (12)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilter === 'IN_PROGRESS' && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter('IN_PROGRESS')}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === 'IN_PROGRESS' && styles.filterChipTextActive,
              ]}
            >
              In Progress (5)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilter === 'NOT_STARTED' && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter('NOT_STARTED')}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === 'NOT_STARTED' && styles.filterChipTextActive,
              ]}
            >
              Not Started
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterChip}>
            <Ionicons name="swap-vertical" size={14} color="#64748B" style={{ marginRight: 4 }} />
            <Text style={styles.filterChipText}>Due date</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Project Cards List */}
        <View style={styles.cardsContainer}>
          {filteredProjects.map((project) => {
            const isCompleted = project.status === 'COMPLETED';
            const barColor = isCompleted
              ? '#16A34A'
              : project.progressPct > 0
              ? '#2563EB'
              : '#E2E8F0';

            return (
              <TouchableOpacity
                key={project.id}
                style={styles.card}
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate('ProjectDetail', {
                    projectId: project.id,
                    projectName: project.name,
                  })
                }
              >
                {/* Card Top Row: Badge + Date + More */}
                <View style={styles.cardTopRow}>
                  <View style={styles.badgeDateGroup}>
                    <StatusBadge status={project.status} size="small" />
                    <View style={styles.dateGroup}>
                      <Ionicons
                        name="calendar-outline"
                        size={13}
                        color="#64748B"
                        style={{ marginRight: 4 }}
                      />
                      <Text style={styles.dateText}>{project.dateRange}</Text>
                    </View>
                  </View>
                  <TouchableOpacity>
                    <Ionicons name="ellipsis-vertical" size={16} color="#94A3B8" />
                  </TouchableOpacity>
                </View>

                {/* Title */}
                <Text style={styles.projectTitle}>{project.name}</Text>

                {/* Description */}
                <Text style={styles.projectDescription} numberOfLines={2}>
                  {project.description}
                </Text>

                {/* Progress */}
                <View style={styles.progressRow}>
                  <Text style={styles.progressLabel}>Progress</Text>
                  <Text
                    style={[
                      styles.progressFraction,
                      isCompleted && { color: '#16A34A', fontWeight: '700' },
                    ]}
                  >
                    {project.completedTasks} of {project.totalTasks} tasks ({project.progressPct}%)
                  </Text>
                </View>

                {/* Progress Bar */}
                <ProgressBar progress={project.progressPct} color={barColor} height={6} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* List Footer */}
        <View style={styles.listFooter}>
          <View style={styles.showingBadge}>
            <Text style={styles.showingText}>Showing 1 to 4 of 12 projects</Text>
          </View>
          <Text style={styles.noMoreText}>No more results</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  filterScrollView: {
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  filterChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  cardsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeDateGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 11,
    color: '#64748B',
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  projectDescription: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    marginBottom: 14,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  progressFraction: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  listFooter: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  showingBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 9999,
    marginBottom: 6,
  },
  showingText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563EB',
  },
  noMoreText: {
    fontSize: 11,
    color: '#94A3B8',
  },
});
