import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { APP_ROUTES } from '../../constants/routes';

type TabKey = 'dashboard' | 'teacher' | 'courses' | 'students' | 'attendance' | 'contact';

interface AdminBottomBarProps {
  active: TabKey;
}

const AdminBottomBar: React.FC<AdminBottomBarProps> = ({ active }) => {
  const router = useRouter();

  const TabButton = (
    {
      label,
      icon,
      isActive,
      onPress,
    }: { label: string; icon: keyof typeof Ionicons.glyphMap; isActive: boolean; onPress: () => void }
  ) => (
    <TouchableOpacity style={styles.tabItem} activeOpacity={0.8} onPress={onPress}>
      <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}> 
        <Ionicons name={icon} size={18} color={isActive ? '#FF8F00' : '#616161'} />
      </View>
      <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]} numberOfLines={1}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        {TabButton({
          label: 'Dashboard',
          icon: 'home-outline',
          isActive: active === 'dashboard',
          onPress: () => router.push(APP_ROUTES.ADMIN_DASHBOARD),
        })}
        {TabButton({
          label: 'Teacher',
          icon: 'people-outline',
          isActive: active === 'teacher',
          onPress: () => router.push(APP_ROUTES.ADMIN_TEACHERS),
        })}
        {TabButton({
          label: 'Courses',
          icon: 'library-outline',
          isActive: active === 'courses',
          onPress: () => router.push(APP_ROUTES.ADMIN_CATEGORY_LIST),
        })}
        {TabButton({
          label: 'Students',
          icon: 'school-outline',
          isActive: active === 'students',
          onPress: () => router.push(APP_ROUTES.ADMIN_STUDENTS),
        })}
        {TabButton({
          label: 'Attendance',
          icon: 'calendar-outline',
          isActive: active === 'attendance',
          onPress: () => router.push(APP_ROUTES.ADMIN_ATTENDANCE as any),
        })}
        {TabButton({
          label: 'Contact',
          icon: 'chatbubbles-outline',
          isActive: active === 'contact',
          onPress: () => router.push('/contact' as any),
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: Platform.OS === 'ios' ? 12 : 10,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
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
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: '#FFF3E0',
  },
  tabLabel: {
    fontSize: 11,
    color: '#757575',
    fontWeight: '600',
  },
  tabLabelActive: {
    color: '#FF8F00',
  },
});

export default AdminBottomBar;


