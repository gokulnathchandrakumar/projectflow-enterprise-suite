import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme/theme';

export const DonutChart = ({
  total = 0,
  completed = 0,
  inProgress = 0,
  pending = 0,
}) => {
  const completedPct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const inProgressPct = total > 0 ? Math.round((inProgress / total) * 100) : 0;
  const pendingPct = total > 0 ? Math.max(0, 100 - completedPct - inProgressPct) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.chartWrapper}>
        {/* Ring background representation */}
        <View style={styles.outerRing}>
          {/* Visual multi-tone ring borders */}
          <View style={[styles.ringSegment, styles.segmentGreen]} />
          <View style={[styles.ringSegment, styles.segmentBlue]} />
          <View style={[styles.ringSegment, styles.segmentOrange]} />
          
          {/* Inner cutout hole */}
          <View style={styles.innerHole}>
            <Text style={styles.centerNumber}>{total}</Text>
            <Text style={styles.centerLabel}>Total Tasks</Text>
          </View>
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendRow}>
          <View style={styles.legendLeft}>
            <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.legendLabel}>Completed</Text>
          </View>
          <View style={styles.legendRight}>
            <Text style={styles.legendCount}>{completed}</Text>
            <Text style={[styles.legendPct, { color: '#10B981' }]}>{completedPct}%</Text>
          </View>
        </View>

        <View style={styles.legendRow}>
          <View style={styles.legendLeft}>
            <View style={[styles.dot, { backgroundColor: '#2563EB' }]} />
            <Text style={styles.legendLabel}>In Progress</Text>
          </View>
          <View style={styles.legendRight}>
            <Text style={styles.legendCount}>{inProgress}</Text>
            <Text style={[styles.legendPct, { color: '#2563EB' }]}>{inProgressPct}%</Text>
          </View>
        </View>

        <View style={styles.legendRow}>
          <View style={styles.legendLeft}>
            <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.legendLabel}>Pending</Text>
          </View>
          <View style={styles.legendRight}>
            <Text style={styles.legendCount}>{pending}</Text>
            <Text style={[styles.legendPct, { color: '#F59E0B' }]}>{pendingPct}%</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  chartWrapper: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  outerRing: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 14,
    borderColor: '#10B981',
    borderTopColor: '#F59E0B',
    borderRightColor: '#F59E0B',
    borderBottomColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    transform: [{ rotate: '45deg' }],
  },
  ringSegment: {
    position: 'absolute',
  },
  innerHole: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-45deg' }],
  },
  centerNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  centerLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 1,
  },
  legendContainer: {
    width: '100%',
    paddingHorizontal: 8,
    gap: 8,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 13,
    color: '#334155',
  },
  legendRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  legendCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    minWidth: 20,
    textAlign: 'right',
  },
  legendPct: {
    fontSize: 12,
    fontWeight: '700',
    minWidth: 32,
    textAlign: 'right',
  },
});
