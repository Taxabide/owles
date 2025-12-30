import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Easing,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AdminNavbar from '../../src/components/admin/AdminNavbar';
import AdminSideBar from '../../src/components/admin/AdminSideBar';
import HomeNavbar from '../../src/components/common/HomeNavbar';
import Sidebar from '../../src/components/Navigation/Sidebar';
import Footer from '../../src/components/Screens/HomeScreen/FooterSection';
import { fetchCategoryCoursesAsync } from '../../src/redux/slices/categoryCoursesSlice';
import { AppDispatch, RootState } from '../../src/redux/store';

const { width } = Dimensions.get('window');

const CategoryCoursesScreen = () => {
  const { id } = useLocalSearchParams();
  const categoryId = typeof id === 'string' ? id : '';
  const dispatch = useDispatch<AppDispatch>();
  const { courses, isLoading, error } = useSelector((state: RootState) => state.categoryCourses);
  const auth = useSelector((state: RootState) => state.auth as any);
  const isAdmin = (auth?.user?.role || auth?.role) === 'admin';
  const { categories } = useSelector((state: RootState) => state.categories);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchCategoryCoursesAsync(categoryId));
    }
  }, [dispatch, categoryId]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    Animated.timing(slideAnim, {
      toValue: isMenuOpen ? 0 : 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const sidebarTranslateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, 0], // Slide from left (-width) to 0
  });

  const stripHtmlTags = (htmlString: string) => {
    return htmlString.replace(/<[^>]*>/g, '');
  };

  const categoryName = categories.find((c) => String(c.c_id) === categoryId)?.c_name || '';

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.navbarWrapper}>
        {isAdmin ? (
          <AdminNavbar adminName={auth?.user?.name || 'Admin'} onMenuPress={toggleMenu} isMenuOpen={isMenuOpen} />
        ) : (
          <HomeNavbar toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.contentContainer}>

          {isLoading ? (
            <ActivityIndicator size="large" color="#2196F3" style={styles.loadingIndicator} />
          ) : error ? (
            <Text style={styles.errorText}>Error: {error}</Text>
          ) : (
            <View style={styles.coursesGrid}>
              {courses.length > 0 ? (
                courses.map((course) => (
                  <TouchableOpacity key={course.course_id} style={styles.courseCard}>
                    <Image source={{ uri: `http://owles.tulyarthdigiweb.com/${course.course_image}` }} style={styles.courseImage} />
                    <Text style={styles.courseTitle}>{course.course_name}</Text>
                    {!!categoryName && (
                      <Text style={styles.categoryRow}>
                        <Text style={styles.categoryLabel}>Category: </Text>
                        <Text style={styles.categoryValue}>{categoryName}</Text>
                      </Text>
                    )}
                    <Text style={styles.courseDescription}>{stripHtmlTags(course.course_description)}</Text>
                    <View style={styles.cardDivider} />
                    <View style={styles.actionsRow}>
                      <TouchableOpacity style={styles.linkButton} activeOpacity={0.8} onPress={() => {
                        // Navigate to admin add lecture with course context
                        // Only for admin usage; route is under /admin
                        // Using query params to pass course id/name
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        (require('expo-router').router as any).push({ pathname: '/admin/lectures/add', params: { courseId: String(course.course_id), courseName: course.course_name } });
                      }}>
                        <Text style={styles.linkText}>Add Lecture</Text>
                        <Ionicons name="arrow-forward" size={16} color="#1976D2" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.linkButton} activeOpacity={0.8} onPress={() => {

                        (require('expo-router').router as any).push({ pathname: '/admin/lectures/view', params: { courseId: String(course.course_id), courseName: course.course_name } });
                      }}>
                        <Text style={styles.linkText}>View Lecture</Text>
                        <Ionicons name="arrow-forward" size={16} color="#1976D2" />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noCoursesText}>No courses found for this category.</Text>
              )}
            </View>
          )}
        </View>
        <Footer />
      </ScrollView>

      {isMenuOpen && <TouchableOpacity style={styles.overlay} onPress={toggleMenu} activeOpacity={1} />}
      {isAdmin ? (
        isMenuOpen && (
          <AdminSideBar
            isMenuOpen={isMenuOpen}
            toggleMenu={toggleMenu}
            slideAnim={slideAnim}
            adminName={auth?.user?.name || 'Admin'}
            adminEmail={auth?.user?.email || 'admin@example.com'}
          />
        )
      ) : (
        <Animated.View style={[styles.sidebarContainer, { transform: [{ translateX: sidebarTranslateX }] }]}>
          <Sidebar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} slideAnim={slideAnim} />
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const NAVBAR_HEIGHT = Platform.OS === 'ios' ? 100 : 60; // Approximate height of HomeNavbar

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  navbarWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF', // Add background color to navbar
    zIndex: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingTop: NAVBAR_HEIGHT, // Add padding to the top of the scroll view to account for the fixed navbar
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
    marginTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingIndicator: {
    marginTop: 50,
  },
  errorText: {
    color: '#DC2626',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  noCoursesText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 30,
  },
  coursesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    marginTop: 12,
  },
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    width: (width - 60) / (width > 768 ? 3 : 1) - 5, // Responsive width for 1 or 3 columns
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  courseImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  categoryRow: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 8,
    textAlign: 'center',
  },
  categoryLabel: {
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryValue: {
    fontWeight: '700',
    color: '#1F2937',
  },
  courseDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  cardDivider: {
    height: 1,
    width: '90%',
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginVertical: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
  },
  linkText: {
    color: '#1976D2',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 10,
  },
  sidebarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: width * 0.75,
    backgroundColor: '#FFFFFF',
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 15,
  },
});

export default CategoryCoursesScreen;
