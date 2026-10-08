import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

export const AddTaskModal = ({ visible, onClose, onSave }) => {
  const [taskName, setTaskName] = useState('Prepare production deployment checklist');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('HIGH');
  const [status, setStatus] = useState('IN_PROGRESS');
  const [dueDate, setDueDate] = useState('2024-10-31');

  const handleSave = () => {
    if (!taskName.trim()) {
      alert('Please enter a task name.');
      return;
    }
    onSave({
      name: taskName.trim(),
      description: description.trim(),
      priority,
      status,
      dueDate,
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.brandGroup}>
            <Ionicons name="menu" size={22} color="#0F172A" />
            <Text style={styles.brandTitle}>ProjectFlow</Text>
          </View>
          <Ionicons name="notifications-outline" size={20} color="#64748B" />
        </View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Active Sprint Context Card */}
          <View style={styles.sprintCard}>
            <View>
              <Text style={styles.sprintLabel}>Active Sprint</Text>
              <Text style={styles.sprintTitle}>Website Redesign Q4</Text>
            </View>
            <View style={styles.sprintBadge}>
              <Text style={styles.sprintBadgeText}>Sprint 03</Text>
            </View>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Title Row */}
            <View style={styles.formHeaderRow}>
              <View>
                <Text style={styles.formTitle}>Add task</Text>
                <Text style={styles.formSubtitle}>
                  Create a new deliverable within Website Redesign
                </Text>
              </View>
              <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Task Name Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Task name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Prepare production deployment checklist"
                placeholderTextColor="#94A3B8"
                value={taskName}
                onChangeText={setTaskName}
              />
            </View>

            {/* Description Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Description</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Provide instructions, links, or context..."
                placeholderTextColor="#94A3B8"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Priority Segmented Control */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Priority</Text>
              <View style={styles.segmentedContainer}>
                <TouchableOpacity
                  style={[
                    styles.segmentButton,
                    priority === 'LOW' && styles.segmentButtonActiveLow,
                  ]}
                  onPress={() => setPriority('LOW')}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      priority === 'LOW' && styles.segmentTextActiveLow,
                    ]}
                  >
                    ↓ Low
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.segmentButton,
                    priority === 'MEDIUM' && styles.segmentButtonActiveMed,
                  ]}
                  onPress={() => setPriority('MEDIUM')}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      priority === 'MEDIUM' && styles.segmentTextActiveMed,
                    ]}
                  >
                    = Medium
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.segmentButton,
                    priority === 'HIGH' && styles.segmentButtonActiveHigh,
                  ]}
                  onPress={() => setPriority('HIGH')}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      priority === 'HIGH' && styles.segmentTextActiveHigh,
                    ]}
                  >
                    ↑ High
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Status and Due Date Row */}
            <View style={styles.rowFields}>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Status</Text>
                <TouchableOpacity style={styles.dropdownInput}>
                  <Text style={styles.dropdownValue}>In Progress</Text>
                  <Ionicons name="chevron-down" size={14} color="#64748B" />
                </TouchableOpacity>
              </View>

              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Due date</Text>
                <View style={styles.dateInputWrapper}>
                  <TextInput
                    style={styles.dateInput}
                    value={dueDate}
                    onChangeText={setDueDate}
                  />
                  <Ionicons name="calendar-outline" size={16} color="#64748B" />
                </View>
              </View>
            </View>

            {/* Assignee Row */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Assignee</Text>
              <View style={styles.assigneeCard}>
                <View style={styles.assigneeAvatar}>
                  <Text style={styles.assigneeAvatarText}>AM</Text>
                </View>
                <View style={styles.assigneeInfo}>
                  <Text style={styles.assigneeName}>Alex Morgan</Text>
                  <Text style={styles.assigneeEmail}>alex@projectflow.internal</Text>
                </View>
                <View style={styles.assignedBadge}>
                  <Ionicons name="checkmark" size={12} color="#2563EB" />
                  <Text style={styles.assignedBadgeText}>Assigned</Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonsRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Save task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 52,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563EB',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sprintCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  sprintLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  sprintTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  sprintBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  sprintBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  formHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  formSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 13,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 72,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  segmentedContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentButtonActiveLow: {
    backgroundColor: '#E2E8F0',
  },
  segmentButtonActiveMed: {
    backgroundColor: '#FEF3C7',
  },
  segmentButtonActiveHigh: {
    backgroundColor: '#FEE2E2',
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentTextActiveHigh: {
    color: '#DC2626',
    fontWeight: '700',
  },
  segmentTextActiveMed: {
    color: '#D97706',
    fontWeight: '700',
  },
  segmentTextActiveLow: {
    color: '#475569',
    fontWeight: '700',
  },
  rowFields: {
    flexDirection: 'row',
    gap: 12,
  },
  dropdownInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    backgroundColor: '#FFFFFF',
  },
  dropdownValue: {
    fontSize: 13,
    color: '#0F172A',
  },
  dateInputWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    backgroundColor: '#FFFFFF',
  },
  dateInput: {
    fontSize: 13,
    color: '#0F172A',
    flex: 1,
  },
  assigneeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  assigneeAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  assigneeAvatarText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  assigneeInfo: {
    flex: 1,
  },
  assigneeName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  assigneeEmail: {
    fontSize: 11,
    color: '#64748B',
  },
  assignedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
    gap: 3,
  },
  assignedBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563EB',
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
