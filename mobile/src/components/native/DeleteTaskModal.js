import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';

export const DeleteTaskModal = ({
  visible,
  taskName = 'Finalize homepage wireframes',
  onConfirm,
  onCancel,
  loading = false,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Warning Icon in circle */}
          <View style={styles.warningIconContainer}>
            <Ionicons name="warning-outline" size={28} color="#DC2626" />
          </View>

          {/* Title */}
          <Text style={styles.title}>Delete this task?</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Are you sure you want to delete <Text style={styles.boldName}>"{taskName}"</Text>? This action cannot be undone.
          </Text>

          {/* Context box */}
          <View style={styles.contextBox}>
            <Ionicons name="information-circle-outline" size={18} color="#2563EB" style={{ marginTop: 2 }} />
            <Text style={styles.contextText}>
              3 dependencies and 14 team activity logs tied to this item will be archived.
            </Text>
          </View>

          {/* Actions */}
          <TouchableOpacity
            style={[styles.deleteButton, loading && { opacity: 0.7 }]}
            onPress={onConfirm}
            disabled={loading}
          >
            <Ionicons name="trash-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.deleteButtonText}>
              {loading ? 'Deleting...' : 'Delete task'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderTopWidth: 4,
    borderTopColor: '#DC2626',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  warningIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  boldName: {
    fontWeight: '700',
    color: '#0F172A',
  },
  contextBox: {
    width: '100%',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  contextText: {
    fontSize: 12,
    color: '#1E40AF',
    flex: 1,
    lineHeight: 16,
  },
  deleteButton: {
    width: '100%',
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  cancelButton: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '600',
  },
});
