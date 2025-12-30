import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

// Import your student screens here
// import StudentDashboard from '../screens/Student/StudentDashboard';
// import StudentAssignments from '../screens/Student/StudentAssignments';
// import StudentGrades from '../screens/Student/StudentGrades';
// import StudentSchedule from '../screens/Student/StudentSchedule';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Placeholder components for now
const StudentDashboard = () => null;
const StudentAssignments = () => null;
const StudentGrades = () => null;
const StudentSchedule = () => null;

const StudentTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Assignments') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Grades') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'Schedule') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.student,
        tabBarInactiveTintColor: colors.gray[500],
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.student,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={StudentDashboard}
        options={{ title: 'Student Dashboard' }}
      />
      <Tab.Screen 
        name="Assignments" 
        component={StudentAssignments}
        options={{ title: 'My Assignments' }}
      />
      <Tab.Screen 
        name="Grades" 
        component={StudentGrades}
        options={{ title: 'My Grades' }}
      />
      <Tab.Screen 
        name="Schedule" 
        component={StudentSchedule}
        options={{ title: 'Schedule' }}
      />
    </Tab.Navigator>
  );
};

const StudentNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.student,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="StudentTabs" 
        component={StudentTabs}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default StudentNavigator;
