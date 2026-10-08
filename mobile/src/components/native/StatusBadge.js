import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';

export const StatusBadge = ({ status, size = 'normal' }) => {
  let label = status || 'Not Started';
  let bg = theme.colors.neutralBg;
  let text = theme.colors.neutralText;
  let showCheck = false;

  const normalized = (status || '').toUpperCase();

  if (normalized === 'IN_PROGRESS' || normalized === 'IN PROGRESS') {
    label = 'In Progress';
    bg = '#EFF6FF';
    text = '#2563EB';
  } else if (normalized === 'COMPLETED') {
    label = 'Completed';
    bg = '#DCFCE7';
    text = '#15803D';
    showCheck = true;
  } else if (normalized === 'IN_REVIEW' || normalized === 'IN REVIEW') {
    label = 'In Review';
    bg = '#FEF9C3';
    text = '#A16207';
  } else if (normalized === 'NOT_STARTED' || normalized === 'NOT STARTED') {
    label = 'Not Started';
    bg = '#F1F5F9';
    text = '#64748B';
  }

  return (
    <View style={[styles.badge, { backgroundColor: bg }, size === 'small' && styles.smallBadge]}>
      {showCheck && (
        <Ionicons name="checkmark-circle" size={13} color={text} style={{ marginRight: 3 }} />
      )}
      <Text style={[styles.badgeText, { color: text }, size === 'small' && styles.smallBadgeText]}>
        {label}
      </Text>
    </View>
  );
};

export const PriorityBadge = ({ priority }) => {
  let label = priority || 'Medium';
  let bg = '#FEF3C7';
  let text = '#B45309';
  let symbol = '=';

  const normalized = (priority || '').toUpperCase();

  if (normalized === 'HIGH') {
    label = 'High';
    bg = '#FEE2E2';
    text = '#B91C1C';
    symbol = '↑';
  } else if (normalized === 'MEDIUM') {
    label = 'Medium';
    bg = '#FEF3C7';
    text = '#B45309';
    symbol = '=';
  } else if (normalized === 'LOW') {
    label = 'Low';
    bg = '#F1F5F9';
    text = '#64748B';
    symbol = '↓';
  }

  return (
    <View style={[styles.priorityBadge, { backgroundColor: bg }]}>
      <Text style={[styles.prioritySymbol, { color: text }]}>{symbol}</Text>
      <Text style={[styles.priorityText, { color: text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.full,
    alignSelf: 'flex-start',
  },
  smallBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  smallBadgeText: {
    fontSize: 10,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: theme.radius.full,
    gap: 3,
    alignSelf: 'flex-start',
  },
  prioritySymbol: {
    fontSize: 12,
    fontWeight: '700',
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
