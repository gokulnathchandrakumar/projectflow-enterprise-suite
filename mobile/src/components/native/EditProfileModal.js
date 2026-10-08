import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobileTheme } from '../../context/MobileThemeContext';

export const EditProfileModal = ({
  visible,
  currentUser,
  onClose,
  onSave,
}) => {
  const { theme, isDark } = useMobileTheme();
  const [name, setName] = useState(currentUser?.name || 'Alex Morgan');
  const [email, setEmail] = useState(currentUser?.email || 'alex.morgan@example.com');
  const [role, setRole] = useState(currentUser?.role || 'Senior Product Lead');
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || 'Alex Morgan');
      setEmail(currentUser.email || 'alex.morgan@example.com');
      setRole(currentUser.role || 'Senior Product Lead');
    }
  }, [currentUser, visible]);

  const handleSave = () => {
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    onSave({
      ...currentUser,
      name: name.trim(),
      email: email.trim(),
      role: role.trim(),
      avatarInitials: name.trim().split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase(),
    });
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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
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
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text
                style={[
                  styles.cancelText,
                  { color: isDark ? '#94A3B8' : '#64748B' },
                ]}
              >
                Cancel
              </Text>
            </TouchableOpacity>

            <Text
              style={[
                styles.headerTitle,
                { color: isDark ? '#FFFFFF' : '#0F172A' },
              ]}
            >
              Edit Profile
            </Text>

            <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.formContent}>
            {error !== '' && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color="#DC2626" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.avatarSection}>
              <View
                style={[
                  styles.avatarCircle,
                  { backgroundColor: '#2563EB' },
                ]}
              >
                <Text style={styles.avatarInitials}>
                  {name.trim().split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase() || 'AM'}
                </Text>
              </View>
              <Text style={[styles.avatarHint, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                Avatar initials update automatically
              </Text>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: isDark ? '#94A3B8' : '#334155' }]}>
                Full Name
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDark ? '#131B2E' : '#FFFFFF',
                    borderColor: isDark ? '#1E293B' : '#E2E8F0',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                  },
                ]}
                value={name}
                onChangeText={setName}
                placeholder="Full Name"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: isDark ? '#94A3B8' : '#334155' }]}>
                Work Email
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDark ? '#131B2E' : '#FFFFFF',
                    borderColor: isDark ? '#1E293B' : '#E2E8F0',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                  },
                ]}
                value={email}
                onChangeText={setEmail}
                placeholder="alex.morgan@example.com"
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: isDark ? '#94A3B8' : '#334155' }]}>
                Role / Title
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDark ? '#131B2E' : '#FFFFFF',
                    borderColor: isDark ? '#1E293B' : '#E2E8F0',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                  },
                ]}
                value={role}
                onChangeText={setRole}
                placeholder="Senior Product Lead"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
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
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cancelBtn: {
    padding: 6,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '500',
  },
  saveBtn: {
    padding: 6,
  },
  saveText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563EB',
  },
  formContent: {
    padding: 20,
    gap: 16,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarInitials: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  avatarHint: {
    fontSize: 11,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 10,
    gap: 8,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '500',
  },
});
