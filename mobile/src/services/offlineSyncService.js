import { storage } from './secureStore';
import { mobileApi } from './api';

const OFFLINE_QUEUE_KEY = 'projectflow_offline_queue';

/**
 * Service to manage offline mutation queue and automatic background synchronization.
 */
export const offlineSyncService = {
  // Retrieve all currently pending operations
  getQueue: async () => {
    try {
      const raw = await storage.getItem(OFFLINE_QUEUE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn('Error reading offline queue:', e);
      return [];
    }
  },

  // Save the queue to local storage
  saveQueue: async (queue) => {
    try {
      await storage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
    } catch (e) {
      console.warn('Error saving offline queue:', e);
    }
  },

  // Enqueue a new operation
  enqueue: async (type, payload) => {
    const queue = await offlineSyncService.getQueue();
    const item = {
      id: `op-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      type, // 'CREATE_TASK' | 'UPDATE_TASK' | 'DELETE_TASK'
      payload,
      timestamp: new Date().toISOString(),
      retryCount: 0,
    };
    queue.push(item);
    await offlineSyncService.saveQueue(queue);
    return item;
  },

  // Clear all pending items
  clearQueue: async () => {
    await offlineSyncService.saveQueue([]);
  },

  // Sync / replay pending operations to backend REST API
  syncQueue: async () => {
    const queue = await offlineSyncService.getQueue();
    if (queue.length === 0) {
      return { success: true, processed: 0, remaining: 0 };
    }

    const remaining = [];
    let processed = 0;

    for (const op of queue) {
      try {
        if (op.type === 'CREATE_TASK') {
          await mobileApi.createTask(op.payload);
        } else if (op.type === 'UPDATE_TASK') {
          await mobileApi.updateTask(op.payload.id, op.payload.data);
        } else if (op.type === 'DELETE_TASK') {
          await mobileApi.deleteTask(op.payload.id);
        }
        processed++;
      } catch (err) {
        // If error is network interruption, keep in queue for future retry
        op.retryCount = (op.retryCount || 0) + 1;
        remaining.push(op);
      }
    }

    await offlineSyncService.saveQueue(remaining);

    return {
      success: remaining.length === 0,
      processed,
      remaining: remaining.length,
    };
  },
};
