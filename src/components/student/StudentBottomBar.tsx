import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { APP_ROUTES } from '../../constants/routes';

type StudentTabKey = 'dashboard' | 'attendance' | 'assignments' | 'grades' | 'profile';

interface Props {
  active: StudentTabKey;
  onMenuPress?: () => void;
}

const StudentBottomBar: React.FC<Props> = ({ active, onMenuPress }) => {
  const router = useRouter();

  const Tab = (
    { label, icon, isActive, onPress }: { label: string; icon: keyof typeof Ionicons.glyphMap; isActive: boolean; onPress: () => void }
  ) => (
    <TouchableOpacity style={styles.tabItem} activeOpacity={0.85} onPress={onPress}>
      <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}> 
        <Ionicons name={icon} size={18} color={isActive ? '#2563EB' : '#64748B'} />
      </View>
      <Text style={[styles.label, isActive && styles.labelActive]} numberOfLines={1}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <TouchableOpacity
          style={[styles.tabItem, styles.menuTab]}
          activeOpacity={0.85}
          onPress={onMenuPress}
        >
          <View style={styles.burgerButton}>
            <Ionicons name="menu-outline" size={22} color="#1F2937" />
          </View>
          <Text style={styles.label}>Menu</Text>
        </TouchableOpacity>
        {Tab({ label: 'Home', icon: 'home-outline', isActive: active === 'dashboard', onPress: () => router.push(APP_ROUTES.STUDENT_DASHBOARD) })}
        {Tab({ label: 'Attendance', icon: 'calendar-outline', isActive: active === 'attendance', onPress: () => router.push(APP_ROUTES.STUDENT_ATTENDANCE) })}
        {Tab({ label: 'Assignments', icon: 'document-text-outline', isActive: active === 'assignments', onPress: () => router.push(APP_ROUTES.STUDENT_ASSIGNMENTS) })}
        {Tab({ label: 'Profile', icon: 'person-circle-outline', isActive: active === 'profile', onPress: () => router.push(APP_ROUTES.STUDENT_PROFILE) })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 14 : 10,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  tabItem: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  menuTab: {
    flex: 0.9,
  },
  burgerButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFF5E6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 1,
    elevation: 1,
  },
  iconWrapActive: {
    backgroundColor: '#DBEAFE',
  },
  label: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
  },
  labelActive: {
    color: '#2563EB',
  },
});

export default StudentBottomBar;


