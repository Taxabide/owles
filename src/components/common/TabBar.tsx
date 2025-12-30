import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setShowLogin, toggleMenu } from '../../redux/slices/uiSlice';
import { AppDispatch, RootState } from '../../redux/store';

type TabKey = 'home' | 'gallery' | 'courses' | 'profile';

interface TabBarProps {
  active: TabKey;
}

const TabBar: React.FC<TabBarProps> = ({ active }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);

  const handleProfilePress = () => {
    if (isAuthenticated && user) {
      const role = String(user.role || '').toLowerCase();
      if (role === 'admin') {
        router.push('/admin/profile' as any);
      } else if (role === 'student') {
        router.push('/student/profile' as any);
      } else if (role === 'teacher') {
        router.push('/teacher' as any);
      } else {
        router.push('/profile' as any);
      }
    } else {
      dispatch(setShowLogin(true));
    }
  };

  const Tab = ({
    label,
    icon,
    route,
    isActive,
    onPress,
  }: {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    route?: string;
    isActive?: boolean;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      style={styles.item}
      activeOpacity={0.85}
      onPress={onPress || (route ? () => router.push(route as any) : undefined)}
    >
      <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
        <Ionicons name={icon} size={18} color={isActive ? '#FF8F00' : '#616161'} />
      </View>
      <Text style={[styles.label, isActive && styles.labelActive]} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        {/* Burger menu tab to toggle sidebar */}
        <Tab
          label="Menu"
          icon="menu-outline"
          isActive={false}
          onPress={() => dispatch(toggleMenu())}
        />
        <Tab label="Home" icon="home-outline" route="/" isActive={active === 'home'} />
        <Tab label="Gallery" icon="images-outline" route="/gallery" isActive={active === 'gallery'} />
        <Tab label="Courses" icon="book-outline" route="/courses" isActive={active === 'courses'} />
        <Tab
          label="Profile"
          icon="person-circle-outline"
          route="/profile"
          isActive={active === 'profile'}
          onPress={handleProfilePress}
        />
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
  item: {
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
  label: {
    fontSize: 11,
    color: '#757575',
    fontWeight: '600',
  },
  labelActive: {
    color: '#FF8F00',
  },
});

export default TabBar;

