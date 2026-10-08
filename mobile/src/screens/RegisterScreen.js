import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mobileApi } from '../services/api';
import { saveToken, saveUser } from '../services/secureStore';
import { theme } from '../theme/theme';

export const RegisterScreen = ({ navigation, onRegisterSuccess }) => {
  const [fullName, setFullName] = useState('Alex Morgan');
  const [email, setEmail] = useState('alex.morgan@example.com');
  const [password, setPassword] = useState('SecurePass123!');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Password validation rules
  const hasMinLength = password.length >= 8;
  const hasLetterAndNumber = /[a-zA-Z]/.test(password) && /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    if (password !== confirmPassword && confirmPassword !== '') {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    setDuplicateWarning(false);
    setErrorMessage('');

    try {
      const res = await mobileApi.register(fullName.trim(), email.trim(), password);
      if (res.success && res.data) {
        await saveToken(res.data.token);
        await saveUser(res.data.user);
        if (onRegisterSuccess) onRegisterSuccess(res.data.user);
      }
    } catch (err) {
      if (err.response?.status === 409 || err.response?.data?.message?.includes('already exists')) {
        setDuplicateWarning(true);
      } else {
        // Fallback demo user for offline or DB setup testing
        const newUser = {
          id: 'usr-new',
          name: fullName.trim(),
          email: email.trim(),
          role: 'Product Lead',
        };
        await saveToken('demo-token-registered');
        await saveUser(newUser);
        if (onRegisterSuccess) onRegisterSuccess(newUser);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Logo & Header */}
          <View style={styles.brandRow}>
            <View style={styles.brandLogo}>
              <Ionicons name="git-network-outline" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.brandTitle}>ProjectFlow</Text>
          </View>

          <Text style={styles.screenHeading}>Create your account</Text>
          <Text style={styles.screenSub}>Start planning projects with your team</Text>

          {/* Duplicate Account Warning Card */}
          {duplicateWarning && (
            <View style={styles.alertCard}>
              <Ionicons name="alert-circle-outline" size={20} color="#DC2626" style={{ marginTop: 2 }} />
              <Text style={styles.alertText}>
                An account with this email already exists. Please try logging in instead or use another organization address.
              </Text>
            </View>
          )}

          {errorMessage !== '' && (
            <View style={[styles.alertCard, { backgroundColor: '#FEF2F2' }]}>
              <Ionicons name="warning-outline" size={18} color="#DC2626" />
              <Text style={styles.alertText}>{errorMessage}</Text>
            </View>
          )}

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Full Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Full name</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Alex Morgan"
                  placeholderTextColor="#94A3B8"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
            </View>

            {/* Work email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Work email</Text>
              <View style={[styles.inputWrapper, duplicateWarning && styles.inputWarningBorder]}>
                <Ionicons name="mail-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="alex.morgan@example.com"
                  placeholderTextColor="#94A3B8"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                {duplicateWarning && (
                  <Ionicons name="alert-circle" size={18} color="#DC2626" />
                )}
              </View>
              {duplicateWarning && (
                <Text style={styles.duplicateWarningText}>
                  Email is linked to an existing ProjectFlow organization.
                </Text>
              )}
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••••••••"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={18}
                    color="#94A3B8"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Password Requirements Card */}
            <View style={styles.requirementsCard}>
              <Text style={styles.requirementsTitle}>Password requirements</Text>

              <View style={styles.ruleRow}>
                <Ionicons
                  name={hasMinLength ? 'checkmark-circle' : 'ellipse-outline'}
                  size={16}
                  color={hasMinLength ? '#10B981' : '#94A3B8'}
                />
                <Text style={[styles.ruleText, hasMinLength && styles.ruleActive]}>
                  At least 8 characters
                </Text>
              </View>

              <View style={styles.ruleRow}>
                <Ionicons
                  name={hasLetterAndNumber ? 'checkmark-circle' : 'ellipse-outline'}
                  size={16}
                  color={hasLetterAndNumber ? '#10B981' : '#94A3B8'}
                />
                <Text style={[styles.ruleText, hasLetterAndNumber && styles.ruleActive]}>
                  Contains at least one letter and one number
                </Text>
              </View>

              <View style={styles.ruleRow}>
                <Ionicons
                  name={hasSpecialChar ? 'checkmark-circle' : 'ellipse-outline'}
                  size={16}
                  color={hasSpecialChar ? '#10B981' : '#94A3B8'}
                />
                <Text style={[styles.ruleText, hasSpecialChar && styles.ruleActive]}>
                  Contains a special character
                </Text>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Confirm password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Re-enter your password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>
            </View>

            {/* Terms */}
            <Text style={styles.termsText}>
              By creating an account, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>.
            </Text>

            {/* CTA button */}
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.9}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <View style={styles.createButtonRow}>
                  <Text style={styles.createButtonText}>Create account</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footerRow}>
              <Text style={styles.footerPrompt}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Log in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 30,
    paddingBottom: 40,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  brandLogo: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2563EB',
  },
  screenHeading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  screenSub: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 20,
  },
  alertCard: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  alertText: {
    fontSize: 12,
    color: '#991B1B',
    flex: 1,
    lineHeight: 17,
  },
  formContainer: {
    width: '100%',
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    height: 46,
  },
  inputWarningBorder: {
    borderColor: '#DC2626',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  duplicateWarningText: {
    fontSize: 11,
    color: '#DC2626',
    marginTop: 4,
  },
  requirementsCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  requirementsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  ruleText: {
    fontSize: 12,
    color: '#64748B',
  },
  ruleActive: {
    color: '#1E293B',
    fontWeight: '500',
  },
  termsText: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 18,
  },
  termsLink: {
    color: '#2563EB',
    textDecorationLine: 'underline',
  },
  createButton: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  createButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerPrompt: {
    fontSize: 13,
    color: '#64748B',
  },
  loginLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
});
