import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { getToken, getUser, removeToken, removeUser, saveToken, saveUser } from './src/services/secureStore';
import { mobileApi } from './src/services/api';
import { MobileThemeProvider, useMobileTheme } from './src/context/MobileThemeContext';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { ProjectsScreen } from './src/screens/ProjectsScreen';
import { ProjectDetailScreen } from './src/screens/ProjectDetailScreen';
import { TasksScreen } from './src/screens/TasksScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { DiagnosticsScreen } from './src/screens/DiagnosticsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const ProjectsStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

function ProjectsStackNavigator() {
  return (
    <ProjectsStack.Navigator screenOptions={{ headerShown: false }}>
      <ProjectsStack.Screen name="ProjectsList" component={ProjectsScreen} />
      <ProjectsStack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
    </ProjectsStack.Navigator>
  );
}

function ProfileStackNavigator({ onLogout }) {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain">
        {(props) => <ProfileScreen {...props} onLogout={onLogout} />}
      </ProfileStack.Screen>
      <ProfileStack.Screen name="Diagnostics" component={DiagnosticsScreen} />
    </ProfileStack.Navigator>
  );
}

function MainNavigator({ currentUser, setCurrentUser, handleLogout }) {
  const { theme, isDark } = useMobileTheme();

  return (
    <NavigationContainer>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {currentUser ? (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: isDark ? '#94A3B8' : '#64748B',
            tabBarStyle: {
              height: 60,
              paddingBottom: 8,
              paddingTop: 6,
              backgroundColor: theme.colors.card,
              borderTopWidth: 1,
              borderTopColor: theme.colors.border,
            },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '600',
            },
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Dashboard') {
                iconName = focused ? 'grid' : 'grid-outline';
              } else if (route.name === 'Projects') {
                iconName = focused ? 'folder' : 'folder-outline';
              } else if (route.name === 'Tasks') {
                iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
              } else if (route.name === 'Profile') {
                iconName = focused ? 'person' : 'person-outline';
              }

              return <Ionicons name={iconName} size={22} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Dashboard" component={DashboardScreen} />
          <Tab.Screen name="Projects" component={ProjectsStackNavigator} />
          <Tab.Screen name="Tasks" component={TasksScreen} />
          <Tab.Screen name="Profile">
            {(props) => <ProfileStackNavigator {...props} onLogout={handleLogout} />}
          </Tab.Screen>
        </Tab.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login">
            {(props) => (
              <LoginScreen {...props} onLoginSuccess={(u) => setCurrentUser(u)} />
            )}
          </Stack.Screen>
          <Stack.Screen name="Register">
            {(props) => (
              <RegisterScreen {...props} onRegisterSuccess={(u) => setCurrentUser(u)} />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        let token = await getToken();
        if (!token) {
          // Seamless dev auto-bootstrap with seeded DB user
          try {
            const res = await mobileApi.login('alex.morgan@example.com', 'Password123!');
            if (res.success && res.data) {
              await saveToken(res.data.token);
              await saveUser(res.data.user);
              token = res.data.token;
            }
          } catch (loginErr) {
            console.warn('Auto-bootstrap login failed:', loginErr.message);
          }
        }
        if (token) {
          const user = await getUser();
          setCurrentUser(user || { email: 'alex.morgan@example.com', name: 'Alex Morgan' });
        }
      } catch (e) {
        console.warn('Auth check fallback:', e);
      } finally {
        setInitializing(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await removeToken();
    await removeUser();
    setCurrentUser(null);
  };

  if (initializing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.splashText}>ProjectFlow Enterprise Mobile</Text>
      </View>
    );
  }

  return (
    <MobileThemeProvider>
      <MainNavigator
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        handleLogout={handleLogout}
      />
    </MobileThemeProvider>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  splashText: {
    marginTop: 14,
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
});
