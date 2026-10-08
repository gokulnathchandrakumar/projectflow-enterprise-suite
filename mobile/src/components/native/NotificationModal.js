import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobileTheme } from '../../context/MobileThemeContext';

export const NotificationModal = ({ visible, onClose }) => {
  const { theme, isDark } = useMobileTheme();
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Sprint 03 deadline updated',
      desc: 'Website Redesign deliverables moved to Oct 31, 2024',
      time: '12m ago',
      unread: true,
      icon: 'calendar-outline',
      color: '#2563EB',
    },
    {
      id: '2',
      title: 'Security review sign-off',
      desc: 'Marcus Vance marked SOC2 audit task as ready for sign-off',
      time: '1h ago',
      unread: true,
      icon: 'shield-checkmark-outline',
      color: '#16A34A',
    },
    {
      id: '3',
      title: 'Compliance Audit comment',
      desc: 'Elena Rossi uploaded 2 attachments to legacy infrastructure report',
      time: '3h ago',
      unread: false,
      icon: 'chatbubble-outline',
      color: '#F59E0B',
    },
  ]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={[
          styles.container,
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
            <View style={[styles.bellBox, { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' }]}>
              <Ionicons name="notifications" size={18} color="#2563EB" />
            </View>
            <Text
              style={[
                styles.headerTitle,
                { color: isDark ? '#FFFFFF' : '#0F172A' },
              ]}
            >
              Notifications
            </Text>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity onPress={markAllRead} style={styles.markReadBtn}>
              <Text style={styles.markReadText}>Mark all read</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons
                name="close"
                size={22}
                color={isDark ? '#94A3B8' : '#64748B'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Notifications list */}
        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {notifications.map((n) => (
            <View
              key={n.id}
              style={[
                styles.itemCard,
                {
                  backgroundColor: isDark ? '#131B2E' : '#F8FAFC',
                  borderColor: isDark ? '#1E293B' : '#E2E8F0',
                },
              ]}
            >
              <View
                style={[
                  styles.itemIconBox,
                  { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' },
                ]}
              >
                <Ionicons name={n.icon} size={18} color={n.color} />
              </View>

              <View style={styles.itemBody}>
                <View style={styles.itemTitleRow}>
                  <Text
                    style={[
                      styles.itemTitle,
                      { color: isDark ? '#FFFFFF' : '#0F172A' },
                    ]}
                  >
                    {n.title}
                  </Text>
                  {n.unread && <View style={styles.unreadDot} />}
                </View>

                <Text
                  style={[
                    styles.itemDesc,
                    { color: isDark ? '#94A3B8' : '#64748B' },
                  ]}
                >
                  {n.desc}
                </Text>

                <Text
                  style={[
                    styles.itemTime,
                    { color: isDark ? '#64748B' : '#94A3B8' },
                  ]}
                >
                  {n.time}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 56,
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
  bellBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  markReadBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  markReadText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  closeBtn: {
    padding: 4,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  itemIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemBody: {
    flex: 1,
  },
  itemTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
  },
  itemDesc: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 6,
  },
  itemTime: {
    fontSize: 11,
  },
});
