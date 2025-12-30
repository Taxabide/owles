import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { colors } from '../constants/colors';

// Import your admin screens here
// import AdminDashboard from '../screens/Admin/AdminDashboard';
// import AdminUsers from '../screens/Admin/AdminUsers';
// import AdminSettings from '../screens/Admin/AdminSettings';
// import AdminReports from '../screens/Admin/AdminReports';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Placeholder components for now
const AdminDashboard = () => null;
const AdminUsers = () => null;
const AdminSettings = () => null;
const AdminReports = () => null;

const AdminTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Users') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Reports') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.admin,
        tabBarInactiveTintColor: colors.gray[500],
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.admin,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={AdminDashboard}
        options={{ title: 'Admin Dashboard' }}
      />
      <Tab.Screen 
        name="Users" 
        component={AdminUsers}
        options={{ title: 'Manage Users' }}
      />
      <Tab.Screen 
        name="Reports" 
        component={AdminReports}
        options={{ title: 'Reports' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={AdminSettings}
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
};

const AdminNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.admin,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="AdminTabs" 
        component={AdminTabs}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AdminNavigator;
