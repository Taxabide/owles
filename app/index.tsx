import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, Platform, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { AppLayout } from '../src/components';
import TabBar from '../src/components/common/TabBar';
import { API_BASE_URL, APP_ROUTES } from '../src/constants/routes';
import { RootState } from '../src/redux/store';

export default function Index() {
  const [refreshing, setRefreshing] = useState(false);
  const [categoriesApi, setCategoriesApi] = useState<Array<{ id: string; name: string }>>([]);
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'student') {
        router.replace(APP_ROUTES.STUDENT_DASHBOARD);
      } else if (user.role === 'admin') {
        router.replace(APP_ROUTES.ADMIN_DASHBOARD);
      } else if (user.role === 'teacher') {
        router.replace(APP_ROUTES.TEACHER_DASHBOARD);
      }
    }
  }, [isAuthenticated, user, router]);

  const fetchCategories = React.useCallback(async () => {
    try {
      const base = API_BASE_URL?.startsWith('http') ? API_BASE_URL : '';
      // Use the same source as Admin dashboard category list
      const url = `${base.replace(/\/$/, '')}/api/admin/category-list-api`;
      const res = await fetch(url, { headers: { 'accept': 'application/json' } });
      if (!res.ok) {
        // Silently ignore non-2xx and use fallback
        setCategoriesApi([]);
        return;
      }
      const data: any = await res.json();
      const source = Array.isArray(data?.data?.data) ? data?.data?.data : Array.isArray(data) ? data : [];
      const list: Array<{ id: string; name: string }> = source.map((it: any, idx: number) => ({
        id: String(it?.c_id ?? it?.id ?? it?.slug ?? idx),
        name: String(it?.c_name ?? it?.name ?? it?.title ?? ''),
      }));
      setCategoriesApi(list.filter(x => x?.name));
    } catch {
      setCategoriesApi([]);
    }
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchCategories().finally(() => setTimeout(() => setRefreshing(false), 300));
  }, [fetchCategories]);

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const featuredCourses = [
    { id: '1', title: 'Mathematics Basics', lessons: 24, color: '#E3F2FD', image: require('../assets/images/banner-img.webp') },
    { id: '2', title: 'Physics Essentials', lessons: 18, color: '#FFF3E0', image: require('../assets/images/certificate-img.webp') },
    { id: '3', title: 'Chemistry Starter', lessons: 20, color: '#F3E5F5', image: require('../assets/images/about-img1.webp') },
  ];

  const quickActions = [
    { id: 'qa1', label: 'Courses', icon: 'library-outline', color: '#FFF3E0' },
    { id: 'qa2', label: 'Teachers', icon: 'people-outline', color: '#E3F2FD' },
    { id: 'qa3', label: 'Students', icon: 'school-outline', color: '#F3E5F5' },
    { id: 'qa4', label: 'Attendance', icon: 'calendar-outline', color: '#E8F5E9' },
  ];

  const defaultCategories = [
    { id: 'c1', name: 'Science', icon: 'flask-outline', color: '#E8F5E9' },
    { id: 'c2', name: 'Maths', icon: 'calculator-outline', color: '#E3F2FD' },
    { id: 'c3', name: 'English', icon: 'book-outline', color: '#FFF3E0' },
    { id: 'c4', name: 'Coding', icon: 'code-slash-outline', color: '#F3E5F5' },
  ];
  const categories = (categoriesApi.length ? categoriesApi : defaultCategories).map((c, i) => ({
    id: c.id ?? String(i),
    name: (c as any).name,
    icon: defaultCategories[i % defaultCategories.length].icon,
    color: defaultCategories[i % defaultCategories.length].color,
  }));

  return (
    <AppLayout>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image source={require('../assets/images/owles-logo1.webp')} style={styles.logo} />
            <View>
              <Text style={styles.greetingText}>Welcome back,</Text>
              <Text style={styles.greetingName}>Learner</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.8}>
            <Ionicons name="notifications-outline" size={20} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchRow}>
          <Ionicons name="search" size={18} color="#9CA3AF" />
          <TextInput placeholder="Search courses, topics..." placeholderTextColor="#9CA3AF" style={styles.searchInput} />
          <TouchableOpacity activeOpacity={0.8}>
            <Ionicons name="filter-outline" size={18} color="#FF8F00" />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick actions</Text>
        </View>
        <View style={styles.quickGrid}>
          {quickActions.map(a => (
            <TouchableOpacity key={a.id} style={[styles.quickItem, { backgroundColor: a.color }]} activeOpacity={0.85}>
              <View style={styles.quickIconWrap}>
                <Ionicons name={a.icon as any} size={18} color="#FF8F00" />
              </View>
              <Text style={styles.quickLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Featured */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured courses</Text>
          <TouchableOpacity><Text style={styles.link}>See all</Text></TouchableOpacity>
        </View>
        <FlatList
          data={featuredCourses}
          keyExtractor={(i) => i.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.9} style={[styles.courseCard, { backgroundColor: item.color }]}>
              <Image source={item.image} style={styles.courseImage} resizeMode="contain" />
              <Text style={styles.courseTitle}>{item.title}</Text>
              <View style={styles.courseMeta}>
                <Ionicons name="play-circle-outline" size={14} color="#6B7280" />
                <Text style={styles.courseMetaText}>{item.lessons} lessons</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Course categories</Text>
        </View>
        <View style={styles.catGrid}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.catTile]}
              activeOpacity={0.88}
              onPress={() => router.push(`/category/${encodeURIComponent(String(cat.id))}` as any)}
            >
              <View style={[styles.tileIconWrap, { backgroundColor: cat.color }]}>
                <Ionicons name={cat.icon as any} size={18} color="#374151" />
              </View>
              <Text style={styles.catLabel} numberOfLines={2}>{cat.name}</Text>
              <View style={styles.tileArrow}>
                <Ionicons name="arrow-forward" size={14} color="#6B7280" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Announcement banner */}
        <View style={styles.announcement}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Ionicons name="megaphone-outline" size={18} color="#2563EB" />
            <Text style={styles.announcementTitle}>New courses launching weekly!</Text>
          </View>
          <TouchableOpacity style={styles.ctaButton} activeOpacity={0.9}>
            <Text style={styles.ctaButtonText}>Explore</Text>
            <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <TabBar active="home" />
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  greetingText: {
    fontSize: 12,
    color: '#6B7280',
  },
  greetingName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  searchRow: {
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F3F4F6',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  link: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
  },
  quickGrid: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 8,
  },
  quickItem: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  quickIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  courseCard: {
    width: 220,
    borderRadius: 16,
    padding: 12,
  },
  courseImage: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    marginBottom: 10,
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  courseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  courseMetaText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  catGrid: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingBottom: 8,
  },
  catChips: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingBottom: 8,
  },
  catTile: {
    width: (Dimensions.get('window').width - 16 * 2 - 12) / 2,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 86,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  tileIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '600',
  },
  catLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    paddingHorizontal: 8,
  },
  tileArrow: {
    width: 24,
    alignItems: 'flex-end',
  },
  announcement: {
    marginTop: 16,
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  announcementTitle: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '700',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
