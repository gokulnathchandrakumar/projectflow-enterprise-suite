import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '../components/native/AppHeader';
import { theme } from '../theme/theme';

export const DiagnosticsScreen = ({ navigation }) => {
  const [offlineBannerVisible, setOfflineBannerVisible] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        title="ProjectFlow"
        onNotificationPress={() => {}}
        rightAction="none"
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Offline Notification Banner */}
        {offlineBannerVisible && (
          <View style={styles.offlineBanner}>
            <View style={styles.offlineLeft}>
              <Ionicons name="cloud-offline-outline" size={18} color="#DC2626" />
              <Text style={styles.offlineBannerText}>
                You're offline — Changes saved locally, will sync when connected.
              </Text>
            </View>
            <View style={styles.offlineActions}>
              <TouchableOpacity style={styles.retryBannerBtn} onPress={() => alert('Sync retried.')}>
                <Text style={styles.retryBannerText}>Retry</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setOfflineBannerVisible(false)}>
                <Ionicons name="close" size={16} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Error 500 Interruption Card */}
        <View style={styles.errorCard}>
          <View style={styles.errorHeader}>
            <View style={styles.serverIconBox}>
              <Ionicons name="server-outline" size={20} color="#DC2626" />
            </View>
            <View style={styles.errorBadgeRow}>
              <View style={styles.error500Badge}>
                <Text style={styles.error500Text}>ERROR 500</Text>
              </View>
              <Text style={styles.syncQueueText}>Sync Queue</Text>
            </View>
          </View>

          <Text style={styles.errorCardTitle}>
            Something went wrong — Server connection interrupted.
          </Text>

          <Text style={styles.errorCardDesc}>
            Requests could not be verified by the cloud cluster. Background queued updates are held safely in persistent device storage.
          </Text>

          {/* Local Cache Status Box */}
          <View style={styles.cacheStatusBox}>
            <View style={styles.cacheLeft}>
              <View style={styles.greenDot} />
              <Text style={styles.cacheText}>Local Cache Healthy (94.2 MB Cached)</Text>
            </View>
            <Ionicons name="shield-checkmark-outline" size={16} color="#16A34A" />
          </View>

          {/* Action buttons */}
          <View style={styles.errorButtonsRow}>
            <TouchableOpacity style={styles.outlineBtn} onPress={() => alert('Retrying cluster handshake...')}>
              <Ionicons name="refresh" size={14} color="#0F172A" style={{ marginRight: 4 }} />
              <Text style={styles.outlineBtnText}>Retry</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.outlineBtn} onPress={() => alert('Support ticket queued.')}>
              <Ionicons name="call-outline" size={14} color="#0F172A" style={{ marginRight: 4 }} />
              <Text style={styles.outlineBtnText}>Contact support</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Separator: ACTIVE INTERRUPTION */}
        <View style={styles.sectionDivider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ACTIVE INTERRUPTION</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Session Expired Card */}
        <View style={styles.sessionCard}>
          <View style={styles.handleBar} />

          <View style={styles.lockIconCircle}>
            <Ionicons name="lock-closed-outline" size={24} color="#2563EB" />
          </View>

          <Text style={styles.sessionTitle}>Session expired</Text>
          <Text style={styles.sessionSubtitle}>
            Your session has expired. Please log in again to continue working safely.
          </Text>

          {/* User Timeout Card */}
          <View style={styles.userTimeoutRow}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>AM</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Alex Morgan</Text>
              <Text style={styles.userEmail} numberOfLines={1}>alex.morgan@example.co...</Text>
            </View>
            <View style={styles.timeoutBadge}>
              <Ionicons name="time-outline" size={12} color="#DC2626" />
              <Text style={styles.timeoutBadgeText}>Timeout</Text>
            </View>
          </View>

          {/* Re-login Button */}
          <TouchableOpacity
            style={styles.reloginBtn}
            onPress={() => navigation.navigate('Login')}
          >
            <Ionicons name="log-in-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.reloginBtnText}>Log in again</Text>
          </TouchableOpacity>

          {/* Switch Account link */}
          <TouchableOpacity
            style={styles.switchAccountBtn}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.switchAccountText}>Switch workspace account</Text>
          </TouchableOpacity>
        </View>

        {/* Diagnostics Info Card */}
        <View style={styles.diagnosticsCard}>
          <View style={styles.diagHeader}>
            <View style={styles.diagLeft}>
              <Ionicons name="radio-outline" size={16} color="#B45309" />
              <Text style={styles.diagTitle}>Edge Node Diagnostics</Text>
            </View>
            <Text style={styles.diagSub}>Auto-polling</Text>
          </View>

          <View style={styles.diagBoxesRow}>
            <View style={styles.diagBox}>
              <Text style={styles.diagBoxLabel}>Sync Pending</Text>
              <Text style={styles.diagBoxValue}>14 Operations</Text>
            </View>

            <View style={styles.diagBox}>
              <Text style={styles.diagBoxLabel}>Network Protocol</Text>
              <Text style={styles.diagBoxValue}>Offline / Device Cache</Text>
            </View>
          </View>
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
    padding: 16,
    paddingBottom: 40,
  },
  offlineBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  offlineLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  offlineBannerText: {
    fontSize: 11,
    color: '#991B1B',
    flex: 1,
    lineHeight: 15,
  },
  offlineActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 6,
  },
  retryBannerBtn: {
    borderWidth: 1,
    borderColor: '#2563EB',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  retryBannerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  errorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  serverIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  error500Badge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  error500Text: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  syncQueueText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  errorCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  errorCardDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    marginBottom: 14,
  },
  cacheStatusBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
  },
  cacheLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16A34A',
  },
  cacheText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0F172A',
  },
  errorButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  outlineBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 10,
    borderRadius: 10,
  },
  outlineBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  sectionDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    paddingHorizontal: 10,
    letterSpacing: 0.5,
  },
  sessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  handleBar: {
    width: 36,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    marginBottom: 16,
  },
  lockIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  sessionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 16,
  },
  userTimeoutRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userAvatarText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  userEmail: {
    fontSize: 11,
    color: '#64748B',
  },
  timeoutBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
    gap: 4,
  },
  timeoutBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#DC2626',
  },
  reloginBtn: {
    width: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  reloginBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  switchAccountBtn: {
    padding: 4,
  },
  switchAccountText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  diagnosticsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
  },
  diagHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  diagLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  diagTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  diagSub: {
    fontSize: 11,
    color: '#64748B',
  },
  diagBoxesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  diagBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
  },
  diagBoxLabel: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 4,
  },
  diagBoxValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
});
