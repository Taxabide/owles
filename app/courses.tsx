import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppLayout } from '../src/components';
import TabBar from '../src/components/common/TabBar';
import { API_BASE_URL } from '../src/constants/routes';

interface CourseItem {
  id: string;
  name: string;
  image?: string;
  lessons?: number;
}

const CoursesScreen = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);

      const base = API_BASE_URL?.startsWith('http') ? API_BASE_URL : '';
      // Re‑use the admin category list as a lightweight "all courses" source.
      // If the API shape changes, we simply show the local fallback list.
      const url = `${base.replace(/\/$/, '')}/api/admin/category-list-api`;
      const res = await fetch(url, { headers: { accept: 'application/json' } });

      if (!res.ok) {
        setCourses(fallbackCourses);
        return;
      }

      const data: any = await res.json();
      const source = Array.isArray(data?.data?.data) ? data?.data?.data : Array.isArray(data) ? data : [];

      const list: CourseItem[] = source.map((item: any, idx: number) => ({
        id: String(item?.c_id ?? item?.id ?? idx),
        name: String(item?.c_name ?? item?.name ?? item?.title ?? 'Course'),
      }));

      setCourses(list.length ? list : fallbackCourses);
    } catch {
      setCourses(fallbackCourses);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCourses().finally(() => setTimeout(() => setRefreshing(false), 300));
  }, [fetchCourses]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const renderCourse = ({ item }: { item: CourseItem }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => router.push(`/category/${encodeURIComponent(item.id)}` as any)}
    >
      <View style={styles.thumbnail}>
        <Image
          source={require('../assets/images/banner-img.webp')}
          style={styles.thumbnailImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.cardMeta}>
          <Ionicons name="play-circle-outline" size={14} color="#6B7280" />
          <Text style={styles.cardMetaText}>View courses</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <AppLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>All courses</Text>
          <Text style={styles.headerSubtitle}>Browse categories and view all available courses.</Text>
        </View>

        {loading ? (
          <View style={styles.loaderWrapper}>
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            contentContainerStyle={styles.scrollContent}
          >
            <FlatList
              data={courses}
              keyExtractor={(item) => item.id}
              renderItem={renderCourse}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              scrollEnabled={false}
            />
          </ScrollView>
        )}
      </View>
      <TabBar active="courses" />
    </AppLayout>
  );
};

const fallbackCourses: CourseItem[] = [
  { id: '1', name: 'Mathematics Basics' },
  { id: '2', name: 'Physics Essentials' },
  { id: '3', name: 'Chemistry Starter' },
  { id: '4', name: 'English Grammar Mastery' },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B7280',
  },
  loaderWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardMetaText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
});

export default CoursesScreen;


