import { Slot, usePathname } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StudentBottomBar from '../../src/components/student/StudentBottomBar';
import StudentSideBar from '../../src/components/student/StudentSideBar';

const { width: screenWidth } = Dimensions.get('window');
const SIDE_BAR_WIDTH = Math.min(300, Math.round(screenWidth * 0.72));

type K = 'dashboard' | 'attendance' | 'assignments' | 'grades' | 'profile';

const getActive = (p: string): K => {
  if (p.startsWith('/student/attendance')) return 'attendance';
  if (p.startsWith('/student/assignments')) return 'assignments';
  if (p.startsWith('/student/grades')) return 'grades';
  if (p.startsWith('/student/profile')) return 'profile';
  return 'dashboard';
};

export default function StudentLayout() {
  const pathname = usePathname() || '';
  const active = getActive(pathname);
  const [isStudentMenuOpen, setIsStudentMenuOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-SIDE_BAR_WIDTH)).current;

  const toggleStudentMenu = () => setIsStudentMenuOpen((v) => !v);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isStudentMenuOpen ? 0 : -SIDE_BAR_WIDTH,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, [isStudentMenuOpen, slideAnim]);

  // Close sidebar when route changes
  useEffect(() => {
    setIsStudentMenuOpen(false);
  }, [pathname]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.appContent}>
          {/* Sidebar (absolute; animated via translateX only) */}
          <Animated.View
            style={[
              styles.studentSideBarContainer,
              {
                width: SIDE_BAR_WIDTH,
                transform: [{ translateX: slideAnim }],
              },
            ]}
            pointerEvents={isStudentMenuOpen ? 'auto' : 'none'}
          >
            <StudentSideBar />
          </Animated.View>

          {/* Overlay to close sidebar when clicking outside */}
          {isStudentMenuOpen && (
            <TouchableOpacity
              style={styles.overlay}
              activeOpacity={1}
              onPress={() => setIsStudentMenuOpen(false)}
            />
          )}

          {/* Main content */}
          <View style={styles.content}>
            <Slot />
          </View>
        </View>
      </SafeAreaView>
      <StudentBottomBar active={active} onMenuPress={toggleStudentMenu} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
  },
  appContent: {
    flex: 1,
    position: 'relative',
  },
  studentSideBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 1000,
    elevation: 1000,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
    elevation: 999,
  },
  content: {
    flex: 1,
  },
});


