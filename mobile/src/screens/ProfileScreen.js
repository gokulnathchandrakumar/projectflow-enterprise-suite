import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { removeToken, removeUser, saveUser, getUser } from '../services/secureStore';
import { useMobileTheme } from '../context/MobileThemeContext';
import { EditProfileModal } from '../components/native/EditProfileModal';
import { NotificationModal } from '../components/native/NotificationModal';

export const ProfileScreen = ({ navigation, onLogout }) => {
  const { themeMode, setThemeMode, isDark, theme } = useMobileTheme();
  const [user, setUser] = useState({
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    role: 'Senior Product Lead',
    avatarInitials: 'AM',
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const stored = await getUser();
      if (stored && stored.name) {
        setUser({
          ...stored,
          avatarInitials: stored.name.trim().split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase() || 'AM',
        });
      }
    };
    fetchUser();
  }, []);

  const handleSaveProfile = async (updated) => {
    setUser(updated);
    await saveUser(updated);
    setIsEditModalOpen(false);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to sign out of ProjectFlow Enterprise?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await removeToken();
            await removeUser();
            if (onLogout) onLogout();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: isDark ? '#090D16' : '#FFFFFF' },
      ]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: isDark ? '#131B2E' : '#FFFFFF',
            borderBottomColor: isDark ? '#1E293B' : '#E2E8F0',
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <TouchableOpacity style={{ padding: 4 }}>
            <Ionicons
              name="menu"
              size={22}
              color={isDark ? '#FFFFFF' : '#0F172A'}
            />
          </TouchableOpacity>
          <View style={styles.titleBreadcrumb}>
            <Text style={styles.brandTitle}>ProjectFlow</Text>
            <Text style={styles.slash}>/</Text>
            <Text
              style={[
                styles.pageTitle,
                { color: isDark ? '#FFFFFF' : '#0F172A' },
              ]}
            >
              Settings
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setIsNotificationOpen(true)}
          >
            <Ionicons
              name="notifications-outline"
              size={20}
              color={isDark ? '#FFFFFF' : '#0F172A'}
            />
            <View style={styles.dot} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setIsEditModalOpen(true)}
          >
            <Ionicons
              name="pencil-outline"
              size={18}
              color={isDark ? '#FFFFFF' : '#0F172A'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={[
          styles.container,
          { backgroundColor: isDark ? '#090D16' : '#F8FAFC' },
        ]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: isDark ? '#131B2E' : '#FFFFFF',
              borderColor: isDark ? '#1E293B' : '#E2E8F0',
            },
          ]}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.avatarInitials}</Text>
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text
                style={[
                  styles.userName,
                  { color: isDark ? '#FFFFFF' : '#0F172A' },
                ]}
              >
                {user.name}
              </Text>
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>Pro</Text>
              </View>
            </View>
            <Text
              style={[
                styles.userEmail,
                { color: isDark ? '#94A3B8' : '#64748B' },
              ]}
            >
              {user.email}
            </Text>
            <Text
              style={[
                styles.userRole,
                { color: isDark ? '#64748B' : '#94A3B8' },
              ]}
            >
              {user.role}  •  Enterprise Suite
            </Text>
          </View>

          <TouchableOpacity
            style={styles.editCardBtn}
            onPress={() => setIsEditModalOpen(true)}
          >
            <Ionicons name="create-outline" size={18} color="#2563EB" />
          </TouchableOpacity>
        </View>

        {/* Section: APPEARANCE */}
        <View style={styles.sectionHeaderRow}>
          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? '#94A3B8' : '#64748B' },
            ]}
          >
            APPEARANCE
          </Text>
          <TouchableOpacity onPress={() => setThemeMode('SYSTEM')}>
            <Text style={styles.deviceDefaultText}>Device default</Text>
          </TouchableOpacity>
        </View>

        {/* Theme Mode Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: isDark ? '#131B2E' : '#FFFFFF',
              borderColor: isDark ? '#1E293B' : '#E2E8F0',
            },
          ]}
        >
          <View style={styles.themeTitleRow}>
            <View
              style={[
                styles.themeIconBox,
                { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' },
              ]}
            >
              <Ionicons name="color-palette-outline" size={18} color="#2563EB" />
            </View>
            <View>
              <Text
                style={[
                  styles.itemTitle,
                  { color: isDark ? '#FFFFFF' : '#0F172A' },
                ]}
              >
                Theme Mode
              </Text>
              <Text
                style={[
                  styles.itemSubtitle,
                  { color: isDark ? '#94A3B8' : '#64748B' },
                ]}
              >
                Personalize workspace palette
              </Text>
            </View>
          </View>

          {/* Segmented control */}
          <View
            style={[
              styles.themeSegmentContainer,
              { backgroundColor: isDark ? '#090D16' : '#F1F5F9' },
            ]}
          >
            <TouchableOpacity
              style={[styles.themeSegment, themeMode === 'LIGHT' && styles.themeSegmentActive]}
              onPress={() => setThemeMode('LIGHT')}
            >
              <Ionicons
                name="sunny-outline"
                size={14}
                color={themeMode === 'LIGHT' ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B'}
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.themeSegmentText, themeMode === 'LIGHT' && styles.themeSegmentTextActive]}>
                Light
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.themeSegment, themeMode === 'DARK' && styles.themeSegmentActive]}
              onPress={() => setThemeMode('DARK')}
            >
              <Ionicons
                name="moon-outline"
                size={14}
                color={themeMode === 'DARK' ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B'}
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.themeSegmentText, themeMode === 'DARK' && styles.themeSegmentTextActive]}>
                Dark
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.themeSegment, themeMode === 'SYSTEM' && styles.themeSegmentActive]}
              onPress={() => setThemeMode('SYSTEM')}
            >
              <Ionicons
                name="phone-portrait-outline"
                size={14}
                color={themeMode === 'SYSTEM' ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B'}
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.themeSegmentText, themeMode === 'SYSTEM' && styles.themeSegmentTextActive]}>
                System
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.themeFooterRow}>
            <Ionicons
              name="information-circle-outline"
              size={14}
              color={isDark ? '#64748B' : '#64748B'}
            />
            <Text
              style={[
                styles.themeFooterText,
                { color: isDark ? '#64748B' : '#64748B' },
              ]}
            >
              System follows your phone's setting.
            </Text>
          </View>
        </View>

        {/* Section: GENERAL SETTINGS */}
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? '#94A3B8' : '#64748B', marginTop: 16, marginBottom: 10 },
          ]}
        >
          GENERAL SETTINGS
        </Text>

        <View
          style={[
            styles.settingsListCard,
            {
              backgroundColor: isDark ? '#131B2E' : '#FFFFFF',
              borderColor: isDark ? '#1E293B' : '#E2E8F0',
            },
          ]}
        >
          {/* Row 1: Notifications */}
          <TouchableOpacity
            style={styles.settingsRow}
            onPress={() => setIsNotificationOpen(true)}
          >
            <View style={[styles.settingIconBox, { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' }]}>
              <Ionicons name="notifications-outline" size={18} color="#2563EB" />
            </View>
            <View style={styles.settingDetails}>
              <Text
                style={[
                  styles.settingName,
                  { color: isDark ? '#FFFFFF' : '#0F172A' },
                ]}
              >
                Notifications
              </Text>
              <Text
                style={[
                  styles.settingSub,
                  { color: isDark ? '#94A3B8' : '#64748B' },
                ]}
              >
                Push, Email summaries
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>

          <View style={[styles.rowDivider, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]} />

          {/* Row 2: Security & 2FA */}
          <TouchableOpacity style={styles.settingsRow}>
            <View style={[styles.settingIconBox, { backgroundColor: isDark ? '#064E3B' : '#DCFCE7' }]}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#16A34A" />
            </View>
            <View style={styles.settingDetails}>
              <Text
                style={[
                  styles.settingName,
                  { color: isDark ? '#FFFFFF' : '#0F172A' },
                ]}
              >
                Security & Two-Factor Auth
              </Text>
              <Text
                style={[
                  styles.settingSub,
                  { color: isDark ? '#94A3B8' : '#64748B' },
                ]}
              >
                Hardware key & Authenticator
              </Text>
            </View>
            <View style={styles.enabledBadge}>
              <Text style={styles.enabledBadgeText}>Enabled</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>

          <View style={[styles.rowDivider, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]} />

          {/* Row 3: Offline Sync & Cache */}
          <TouchableOpacity
            style={styles.settingsRow}
            onPress={() => navigation.navigate('Diagnostics')}
          >
            <View style={[styles.settingIconBox, { backgroundColor: isDark ? '#78350F' : '#FEF3C7' }]}>
              <Ionicons name="cube-outline" size={18} color="#D97706" />
            </View>
            <View style={styles.settingDetails}>
              <Text
                style={[
                  styles.settingName,
                  { color: isDark ? '#FFFFFF' : '#0F172A' },
                ]}
              >
                Offline Sync & Cache
              </Text>
              <Text
                style={[
                  styles.settingSub,
                  { color: isDark ? '#94A3B8' : '#64748B' },
                ]}
              >
                Local storage verified
              </Text>
            </View>
            <View style={styles.queuedBadge}>
              <Text style={styles.queuedBadgeText}>Healthy</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>

          <View style={[styles.rowDivider, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]} />

          {/* Row 4: Language & Region */}
          <TouchableOpacity style={styles.settingsRow}>
            <View style={[styles.settingIconBox, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
              <Ionicons name="globe-outline" size={18} color="#475569" />
            </View>
            <View style={styles.settingDetails}>
              <Text
                style={[
                  styles.settingName,
                  { color: isDark ? '#FFFFFF' : '#0F172A' },
                ]}
              >
                Language & Region
              </Text>
              <Text
                style={[
                  styles.settingSub,
                  { color: isDark ? '#94A3B8' : '#64748B' },
                ]}
              >
                English - US
              </Text>
            </View>
            <Text style={styles.langCode}>EN (US)</Text>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[
            styles.logoutButton,
            {
              backgroundColor: isDark ? '#131B2E' : '#FFFFFF',
              borderColor: isDark ? '#7F1D1D' : '#FCA5A5',
            },
          ]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={18} color="#DC2626" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* Footer Build info */}
        <Text style={styles.buildFooter}>
          ProjectFlow Enterprise  •  Build v4.12.0 (Stable)
        </Text>
      </ScrollView>

      {/* Edit Profile Modal */}
      <EditProfileModal
        visible={isEditModalOpen}
        currentUser={user}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
      />

      {/* Notifications Modal */}
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
  },
  header: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  titleBreadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2563EB',
  },
  slash: {
    fontSize: 14,
    color: '#94A3B8',
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 4,
    position: 'relative',
  },
  dot: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DC2626',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
  },
  proBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  proBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
  },
  userEmail: {
    fontSize: 12,
    marginBottom: 2,
  },
  userRole: {
    fontSize: 11,
  },
  editCardBtn: {
    padding: 6,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  deviceDefaultText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  themeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  themeIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  itemSubtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  themeSegmentContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 4,
    marginBottom: 12,
    gap: 4,
  },
  themeSegment: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  themeSegmentActive: {
    backgroundColor: '#2563EB',
  },
  themeSegmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  themeSegmentTextActive: {
    color: '#FFFFFF',
  },
  themeFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  themeFooterText: {
    fontSize: 11,
  },
  settingsListCard: {
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  settingIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingDetails: {
    flex: 1,
  },
  settingName: {
    fontSize: 13,
    fontWeight: '600',
  },
  settingSub: {
    fontSize: 11,
    marginTop: 1,
  },
  enabledBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    marginRight: 6,
  },
  enabledBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#16A34A',
  },
  queuedBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    marginRight: 6,
  },
  queuedBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D97706',
  },
  langCode: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginRight: 6,
  },
  rowDivider: {
    height: 1,
    marginLeft: 58,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 16,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },
  buildFooter: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
  },
});
