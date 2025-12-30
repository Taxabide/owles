import { Slot, usePathname } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import AdminBottomBar from '../../src/components/admin/AdminBottomBar';
import type { RootState } from '../../src/redux/store';

const getActiveTab = (pathname: string): 'dashboard' | 'teacher' | 'courses' | 'students' | 'attendance' | 'contact' => {
  if (pathname.startsWith('/admin/teachers')) return 'teacher';
  if (pathname.startsWith('/admin/categories') || pathname.startsWith('/admin/add-course')) return 'courses';
  if (pathname.startsWith('/admin/students') || pathname.startsWith('/student')) return 'students';
  if (pathname.startsWith('/admin/attendance')) return 'attendance';
  if (pathname.startsWith('/contact')) return 'contact';
  return 'dashboard';
};

export default function AdminLayout() {
  const pathname = usePathname();
  const role = useSelector((s: RootState) => (s as any)?.auth?.user?.role || (s as any)?.auth?.role);
  const showBottom = role === 'admin';
  const active = getActiveTab(pathname || '');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Slot />
      </View>
      {showBottom && <AdminBottomBar active={active} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1 },
});


