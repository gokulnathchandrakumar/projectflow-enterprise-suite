# ProjectFlow Mobile Application (React Native + Expo)

The touch-native Android mobile client engineered for cross-platform project management. Connects to the unified Express REST API and PostgreSQL/MySQL database alongside the React Web client.

---

## 1. Key Architectural Features
- **Expo & React Native**: High-performance mobile client supporting Android APK builds and Expo Go.
- **`expo-secure-store`**: Token security layer storing authentication credentials encrypted on-device.
- **Offline / Network Shield**: Automatic error interceptor presenting clean connection recovery states without app crashes.
- **Pull-To-Refresh Synchronization**: `RefreshControl` integrated across Dashboard, Projects, and Tasks to instantly pull updates made on the web.

---

## 2. Running Locally

```bash
# 1. Install dependencies
cd mobile
npm install

# 2. Configure API Endpoint in .env
# For Android Emulator:
EXPO_PUBLIC_API_URL=http://10.0.2.2:5000/api
# For Physical Device over Wi-Fi:
# EXPO_PUBLIC_API_URL=http://<YOUR_IP>:5000/api

# 3. Start Expo development server
npx expo start
```

---

## 3. Generating Standalone Android APK (EAS Build)

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Log in to Expo account
eas login

# Build standalone Android APK
eas build -p android --profile preview
```
