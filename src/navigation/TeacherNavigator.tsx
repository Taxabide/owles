import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { colors } from '../constants/colors';

// Import your teacher screens here
// import TeacherDashboard from '../screens/Teacher/TeacherDashboard';
// import TeacherClasses from '../screens/Teacher/TeacherClasses';
// import TeacherStudents from '../screens/Teacher/TeacherStudents';
// import TeacherAssignments from '../screens/Teacher/TeacherAssignments';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Placeholder components for now
const TeacherDashboard = () => null;
const TeacherClasses = () => null;
const TeacherStudents = () => null;
const TeacherAssignments = () => null;

const TeacherTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Classes') {
            iconName = focused ? 'school' : 'school-outline';
          } else if (route.name === 'Students') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Assignments') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.teacher,
        tabBarInactiveTintColor: colors.gray[500],
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.teacher,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={TeacherDashboard}
        options={{ title: 'Teacher Dashboard' }}
      />
      <Tab.Screen 
        name="Classes" 
        component={TeacherClasses}
        options={{ title: 'My Classes' }}
      />
      <Tab.Screen 
        name="Students" 
        component={TeacherStudents}
        options={{ title: 'Students' }}
      />
      <Tab.Screen 
        name="Assignments" 
        component={TeacherAssignments}
        options={{ title: 'Assignments' }}
      />
    </Tab.Navigator>
  );
};

const TeacherNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.teacher,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="TeacherTabs" 
        component={TeacherTabs}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default TeacherNavigator;
