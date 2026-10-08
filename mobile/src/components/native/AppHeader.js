import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';
import { useMobileTheme } from '../../context/MobileThemeContext';

export const AppHeader = ({
  title = 'ProjectFlow',
  subtitle,
  onMenuPress,
  onSearchPress,
  onNewPress,
  onNotificationPress,
  userInitials = 'AM',
  rightAction, // 'avatar' | 'newButton' | 'edit' | 'none'
  onEditPress,
}) => {
  const themeContext = useMobileTheme();
  const currentTheme = themeContext?.theme || theme;
  const isDark = themeContext?.isDark || false;

  return (
    <View style={[styles.header, { backgroundColor: currentTheme.colors.card, borderBottomColor: currentTheme.colors.border }]}>
      <View style={styles.leftSection}>
        <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
          <Ionicons name="menu" size={24} color={currentTheme.colors.text} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <View style={styles.brandRow}>
            {title === 'ProjectFlow' && (
              <View style={styles.miniLogo}>
                <Ionicons name="grid" size={13} color="#FFFFFF" />
              </View>
            )}
            <Text style={[styles.headerTitle, { color: currentTheme.colors.text }]}>{title}</Text>
          </View>
          {subtitle && <Text style={[styles.headerSubtitle, { color: currentTheme.colors.textSecondary }]}>{subtitle}</Text>}
        </View>
      </View>

      <View style={styles.rightSection}>
        {onSearchPress && (
          <TouchableOpacity onPress={onSearchPress} style={styles.iconButton}>
            <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}

        {rightAction === 'newButton' && (
          <TouchableOpacity onPress={onNewPress} style={styles.newButton}>
            <Ionicons name="add" size={16} color="#FFFFFF" />
            <Text style={styles.newButtonText}>New</Text>
          </TouchableOpacity>
        )}

        {onNotificationPress && (
          <TouchableOpacity onPress={onNotificationPress} style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={22} color={theme.colors.textSecondary} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        )}

        {rightAction === 'avatar' && (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userInitials}</Text>
          </View>
        )}

        {rightAction === 'edit' && onEditPress && (
          <TouchableOpacity onPress={onEditPress} style={styles.iconButton}>
            <Ionicons name="pencil-outline" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 6,
    position: 'relative',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  miniLogo: {
    width: 22,
    height: 22,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  headerSubtitle: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  notificationDot: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.danger,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: theme.radius.sm,
    gap: 4,
  },
  newButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
  },
  avatarText: {
    color: theme.colors.primaryDark,
    fontSize: 12,
    fontWeight: '700',
  },
});
