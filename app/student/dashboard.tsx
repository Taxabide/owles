import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import FooterSection from "../../src/components/Screens/HomeScreen/FooterSection";
import { APP_ROUTES } from "../../src/constants/routes";
import {
  Category,
  fetchCategoriesAsync,
} from "../../src/redux/slices/categorySlice";
import { AppDispatch, RootState } from "../../src/redux/store";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const StudentDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useSelector((state: RootState) => state.categories);
  const router = useRouter();

  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnims] = useState([
    new Animated.Value(0.8),
    new Animated.Value(0.8),
    new Animated.Value(0.8),
  ]);

  useEffect(() => {
    dispatch(fetchCategoriesAsync());
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.stagger(150, scaleAnims.map(anim => 
        Animated.spring(anim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        })
      )),
    ]).start();
  }, [dispatch]);

  const handleCategoryPress = (categoryId: number) => {
    router.push({
      pathname: APP_ROUTES.CATEGORY_COURSES,
      params: { id: categoryId.toString() },
    });
  };

  type CategoryGradientConfig = {
    colors: [string, string];
    icon: keyof typeof Ionicons.glyphMap;
    emoji: string;
  };

  const categoryData: CategoryGradientConfig[] = [
    { colors: ['#1E3A8A', '#3B82F6'], icon: 'book', emoji: '📚' },
    { colors: ['#7C3AED', '#A78BFA'], icon: 'school', emoji: '🎓' },
    { colors: ['#0891B2', '#06B6D4'], icon: 'language', emoji: '🌍' },
    { colors: ['#059669', '#10B981'], icon: 'business', emoji: '💼' },
    { colors: ['#DC2626', '#EF4444'], icon: 'brush', emoji: '🎨' },
    { colors: ['#EA580C', '#F97316'], icon: 'construct', emoji: '🔧' },
    { colors: ['#4F46E5', '#6366F1'], icon: 'ribbon', emoji: '🏆' },
    { colors: ['#0D9488', '#14B8A6'], icon: 'globe', emoji: '🌐' },
    { colors: ['#7C2D12', '#9A3412'], icon: 'library', emoji: '📖' },
    { colors: ['#1E40AF', '#2563EB'], icon: 'airplane', emoji: '✈️' },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Subtle Background Pattern */}
      <View style={styles.backgroundPattern}>
        <View style={styles.patternCircle1} />
        <View style={styles.patternCircle2} />
        <View style={styles.patternCircle3} />
      </View>

      {/* Professional Header */}
      <LinearGradient
        colors={['#1E40AF', '#3B82F6', '#60A5FA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
    <LinearGradient
                colors={['#3B82F6', '#60A5FA']}
                style={styles.avatarGradient}
              >
                <Ionicons name="person" size={24} color="#FFF" />
              </LinearGradient>
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.welcomeText}>Welcome back</Text>
              <Text style={styles.studentName}>Student Portal</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.notificationButton}>
            <View style={styles.notificationIconBg}>
              <Ionicons name="notifications-outline" size={22} color="#1E40AF" />
              <View style={styles.notificationBadge} />
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.motivationText}>Continue your learning journey</Text>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
          <Animated.View
            style={[
            styles.mainContent,
              {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              },
            ]}
        >
          {/* Professional Stats Cards */}
          <View style={styles.statsRow}>
            <Animated.View style={{ transform: [{ scale: scaleAnims[0] }], flex: 1 }}>
              <TouchableOpacity activeOpacity={0.9}>
                <LinearGradient
                  colors={['#1E40AF', '#3B82F6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.statCard}
                >
                  <View style={styles.statIconBox}>
                    <Ionicons name="book-outline" size={24} color="#FFF" />
                  </View>
                  <Text style={styles.statValue}>24</Text>
                  <Text style={styles.statLabel}>Active Courses</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={{ transform: [{ scale: scaleAnims[1] }], flex: 1 }}>
              <TouchableOpacity activeOpacity={0.9}>
                <LinearGradient
                  colors={['#059669', '#10B981']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.statCard}
                >
                  <View style={styles.statIconBox}>
                    <Ionicons name="checkmark-circle-outline" size={24} color="#FFF" />
                  </View>
                  <Text style={styles.statValue}>89%</Text>
                  <Text style={styles.statLabel}>Completion</Text>
                </LinearGradient>
              </TouchableOpacity>
          </Animated.View>

            <Animated.View style={{ transform: [{ scale: scaleAnims[2] }], flex: 1 }}>
              <TouchableOpacity activeOpacity={0.9}>
                <LinearGradient
                  colors={['#7C3AED', '#A78BFA']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.statCard}
                >
                  <View style={styles.statIconBox}>
                    <Ionicons name="time-outline" size={24} color="#FFF" />
                  </View>
                  <Text style={styles.statValue}>48h</Text>
                  <Text style={styles.statLabel}>Study Time</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Professional Attendance Card */}
          <TouchableOpacity activeOpacity={0.95} style={styles.attendanceWrapper}>
            <View style={styles.attendanceCard}>
              <View style={styles.attendanceHeader}>
                <View style={styles.attendanceLeft}>
                  <LinearGradient
                    colors={['#1E40AF', '#3B82F6']}
                    style={styles.attendanceIconWrapper}
                  >
                    <Ionicons name="calendar" size={28} color="#FFF" />
                  </LinearGradient>
                  <View style={styles.attendanceTexts}>
                    <Text style={styles.attendanceTitle}>Attendance Tracking</Text>
                    <Text style={styles.attendanceSubtitle}>Monitor your presence</Text>
                  </View>
                </View>

                <View style={styles.attendancePercentageBox}>
                  <Text style={styles.attendancePercent}>92</Text>
                  <Text style={styles.attendancePercentSign}>%</Text>
                </View>
              </View>

              <View style={styles.attendanceActions}>
                <TouchableOpacity 
                  style={styles.attendanceBtnPrimary}
                  onPress={() => router.push(APP_ROUTES.STUDENT_ATTENDANCE)}
                >
                  <Ionicons name="add-circle-outline" size={20} color="#FFF" />
                  <Text style={styles.attendanceBtnText}>Mark Attendance</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.attendanceBtnSecondary}
                  onPress={() => router.push('/student/attendance/list')}
                >
                  <Ionicons name="document-text-outline" size={20} color="#1E40AF" />
                  <Text style={styles.attendanceBtnSecondaryText}>View Records</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>

          {/* Course Categories Section */}
          <View style={styles.coursesContainer}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Course Categories</Text>
                <Text style={styles.sectionSubtitle}>Browse by subject area</Text>
              </View>
              <TouchableOpacity style={styles.viewAllBtn}>
                <Text style={styles.viewAllText}>View All</Text>
                <Ionicons name="arrow-forward" size={18} color="#1E40AF" />
              </TouchableOpacity>
            </View>

            <View style={styles.courseGrid}>
              {categoriesLoading ? (
                <View style={styles.loadingState}>
                  <ActivityIndicator size="large" color="#1E40AF" />
                  <Text style={styles.loadingText}>Loading courses...</Text>
                </View>
              ) : categoriesError ? (
                <View style={styles.errorState}>
                  <View style={styles.errorIconBg}>
                    <Ionicons name="alert-circle-outline" size={48} color="#DC2626" />
                  </View>
                  <Text style={styles.errorTitle}>Unable to Load</Text>
                  <Text style={styles.errorMessage}>{categoriesError}</Text>
                  <TouchableOpacity style={styles.retryBtn}>
                    <Text style={styles.retryText}>Retry</Text>
                  </TouchableOpacity>
            </View>
              ) : (categories.length > 0 ? categories : [
                { c_id: 1, c_name: "Academic Subjects" },
                { c_id: 2, c_name: "Humanities & Social Sciences" },
                { c_id: 3, c_name: "Languages" },
                { c_id: 4, c_name: "Commerce & Business" },
                { c_id: 5, c_name: "Arts & Creative" },
                { c_id: 6, c_name: "Applied Sciences" },
                { c_id: 7, c_name: "CBSE/ICSE Boards" },
                { c_id: 8, c_name: "IB Program" },
                { c_id: 9, c_name: "UK A-Levels" },
                { c_id: 10, c_name: "American Curriculum" },
              ]).map((item: Category | { c_id: number; c_name: string }, index: number) => (
            <TouchableOpacity
                  key={item.c_id}
                  style={styles.courseCard}
                  onPress={() => handleCategoryPress(item.c_id)}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={categoryData[index % categoryData.length].colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.courseGradient}
                  >
                    <View style={styles.courseHeader}>
                      <View style={styles.courseIconBox}>
                        <Text style={styles.courseEmoji}>
                          {categoryData[index % categoryData.length].emoji}
                        </Text>
        </View>
                      <View style={styles.courseStatusBadge}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>Active</Text>
        </View>
      </View>

                    <View style={styles.courseContent}>
                      <Text style={styles.courseName} numberOfLines={2}>
                        {item.c_name}
                      </Text>

                      <View style={styles.courseFooter}>
                        <View style={styles.courseInfo}>
                          <Ionicons name="people-outline" size={14} color="rgba(255,255,255,0.9)" />
                          <Text style={styles.courseInfoText}>1.2k students</Text>
                        </View>
                        <View style={styles.arrowCircle}>
                          <Ionicons name="arrow-forward" size={16} color="#FFF" />
                        </View>
                      </View>
      </View>
    </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>
      </ScrollView>
      
      <FooterSection />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  backgroundPattern: {
    position: 'absolute',
    width: '100%',
    height: screenHeight * 0.5,
    overflow: 'hidden',
  },
  patternCircle1: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    top: -80,
    right: -80,
  },
  patternCircle2: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(124, 58, 237, 0.05)',
    top: 120,
    left: -60,
  },
  patternCircle3: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(5, 150, 105, 0.05)',
    top: 220,
    right: 40,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 32,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 28,
  },
  avatarGradient: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    gap: 2,
  },
  welcomeText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  studentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#DC2626',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  motivationText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  mainContent: {
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    minHeight: 130,
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  statIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '600',
    textAlign: 'center',
  },
  attendanceWrapper: {
    marginBottom: 24,
  },
  attendanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  attendanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  attendanceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  attendanceIconWrapper: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  attendanceTexts: {
    flex: 1,
  },
  attendanceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 3,
  },
  attendanceSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  attendancePercentageBox: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#DBEAFE',
    flexDirection: 'row',
  },
  attendancePercent: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  attendancePercentSign: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginTop: 4,
  },
  attendanceActions: {
    flexDirection: 'row',
    gap: 12,
  },
  attendanceBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E40AF',
    paddingVertical: 13,
    borderRadius: 14,
    gap: 8,
    elevation: 2,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  attendanceBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  attendanceBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 13,
    borderRadius: 14,
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  attendanceBtnSecondaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E40AF',
  },
  coursesContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 3,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E40AF',
  },
  courseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  courseCard: {
    width: (screenWidth - 54) / 2,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  courseGradient: {
    padding: 16,
    minHeight: 190,
    justifyContent: 'space-between',
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  courseIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  courseEmoji: {
    fontSize: 26,
  },
  courseStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFF',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFF',
  },
  courseContent: {
    gap: 10,
  },
  courseName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFF',
    lineHeight: 20,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  courseInfoText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingState: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  errorState: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorIconBg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryBtn: {
    backgroundColor: '#1E40AF',
    paddingHorizontal: 28,
    paddingVertical: 11,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
});

export default StudentDashboard;