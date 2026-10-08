import { Platform } from 'react-native';

const TOKEN_KEY = 'projectflow_auth_token';
const USER_KEY = 'projectflow_auth_user';

// Web fallback using localStorage; native uses expo-secure-store
const isWeb = Platform.OS === 'web';

let SecureStore = null;
if (!isWeb) {
  // Dynamically require only on native to avoid web bundling errors
  SecureStore = require('expo-secure-store');
}

export const storage = {
  setItem: async (key, value) => {
    if (isWeb) {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  getItem: async (key) => {
    if (isWeb) {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },
  removeItem: async (key) => {
    if (isWeb) {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

export const saveToken = async (token) => {
  try {
    await storage.setItem(TOKEN_KEY, token);
  } catch (err) {
    console.error('Error saving token:', err);
  }
};

export const getToken = async () => {
  try {
    return await storage.getItem(TOKEN_KEY);
  } catch (err) {
    console.error('Error retrieving token:', err);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await storage.removeItem(TOKEN_KEY);
    await storage.removeItem(USER_KEY);
  } catch (err) {
    console.error('Error removing token:', err);
  }
};

export const removeUser = async () => {
  try {
    await storage.removeItem(USER_KEY);
  } catch (err) {
    console.error('Error removing user:', err);
  }
};

export const saveUser = async (user) => {
  try {
    await storage.setItem(USER_KEY, JSON.stringify(user));
  } catch (err) {
    console.error('Error saving user data:', err);
  }
};

export const getUser = async () => {
  try {
    const raw = await storage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error('Error retrieving user data:', err);
    return null;
  }
};
