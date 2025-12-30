import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch
import AdminNavbar from "../../../src/components/admin/AdminNavbar";
import AdminSideBar from "../../../src/components/admin/AdminSideBar";
// import AdminFooter from "../../components/admin/AdminFooter";
import { API_BASE_URL, APP_ROUTES } from "../../constants/routes";
import { fetchDashboardStats } from "../../redux/slices/adminSlice"; // Import fetchDashboardStats
import { fetchCategoryCoursesAsync } from "../../redux/slices/categoryCoursesSlice";
import { Category, fetchCategoriesAsync } from "../../redux/slices/categorySlice";
import { AppDispatch, RootState } from "../../redux/store"; // Import AppDispatch

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const AdminDashboard = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>(); // Initialize useDispatch
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-screenWidth));
  const scrollViewRef = useRef<ScrollView>(null);

  // Get user data from Redux store
  const { user } = useSelector((state: RootState) => state.auth);
  // Get admin stats from Redux store
  const { stats, isLoading: statsLoading } = useSelector((state: RootState) => state.admin);
  const { categories: adminCategories, isLoading: categoriesLoading } = useSelector((state: RootState) => state.categories);
  const { courses: categoryCourses, isLoading: coursesLoading } = useSelector((state: RootState) => state.categoryCourses);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const cardAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Fetch dashboard stats on mount
    dispatch(fetchDashboardStats());
    // Fetch categories for admin view
    dispatch(fetchCategoriesAsync());
    // Optionally prefetch first category courses to populate grid quickly
    // After categories load, handled in separate effect below

    // Initial animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true, // ✅ opacity supported
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true, // ✅ scale supported
      }),
    ]).start();

    // Staggered card animations
    const cardStagger = cardAnimations.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 600,
        delay: index * 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true, // ✅ only translate/opacity
      })
    );

    Animated.stagger(150, cardStagger).start();
  }, [dispatch, fadeAnim, scaleAnim, cardAnimations]); // Add dispatch to dependency array

  const toggleMenu = () => {
    console.log("toggleMenu called, current isMenuOpen:", isMenuOpen);
    if (isMenuOpen) {
      Animated.timing(slideAnim, {
        toValue: -screenWidth,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false, // ❌ cannot be true (animates left/width)
      }).start(() => setIsMenuOpen(false));
    } else {
      setIsMenuOpen(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false, // ❌ cannot be true
      }).start();
    }
  };

  const handleLogout = () => {
    console.log("Admin Logout");
    router.replace("/");
  };

  const handleScrollToTop = () => {
    scrollViewRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);

    // Dispatch to re-fetch dashboard stats
    dispatch(fetchDashboardStats());

    // Reset animations
    cardAnimations.forEach((anim) => anim.setValue(0));

    // Re-trigger animations
    setTimeout(() => {
      const cardStagger = cardAnimations.map((anim, index) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 600,
          delay: index * 150,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true, // ✅ translate/opacity only
        })
      );

      Animated.stagger(100, cardStagger).start();

      setRefreshing(false);
    }, 500);
  };

  const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);

  const createPressAnimation = (scale = 0.95) => {
    const scaleValue = new Animated.Value(1);

    const onPressIn = () => {
      Animated.spring(scaleValue, {
        toValue: scale,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    };

    const onPressOut = () => {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    };

    return { scaleValue, onPressIn, onPressOut };
  };

  const cardData = [
    {
      title: "All Teachers",
      number: stats?.totalTeachers?.toString() || "0",
      icon: "document-text-outline",
      color: "#00C5F7",
      bgColor: "#E6F9FF",
      viewLabel: 'View Teachers',
      addLabel: 'Add Teachers',
      onView: () => router.push(APP_ROUTES.ADMIN_TEACHERS),
      onAdd: () => router.push(APP_ROUTES.ADMIN_ADD_TEACHER as any),
    },
    {
      title: "All Student",
      number: stats?.totalStudents?.toString() || "0",
      icon: "gift-outline",
      color: "#22C55E",
      bgColor: "#ECFDF5",
      viewLabel: 'View Students',
      addLabel: 'Add Students',
      onView: () => router.push(APP_ROUTES.ADMIN_STUDENTS),
      onAdd: () => router.push('/admin/students' as any),
    },
    {
      title: "All Courses",
      number: "11",
      icon: "copy-outline",
      color: "#F59E0B",
      bgColor: "#FFF7ED",
      viewLabel: 'View Courses',
      addLabel: 'Add Courses',
      onView: () => router.push('/admin/courses' as any),
      onAdd: () => router.push('/admin/add-course' as any),
    },
  ];

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [hoveredBoard, setHoveredBoard] = useState<string | null>(null);

  const iconMap: { [key: string]: any } = {
    "Academic Subjects (Core)": "book",
    "Humanities & Social Sciences": "people",
    "Languages": "globe",
    "Commerce & Professional Studies": "briefcase",
    "Arts & Creative Subjects": "color-palette",
    "Applied & Vocational Subjects": "build",
    "CBSE/ICSE/State Boards": "school",
    "IB (International Baccalaureate)": "globe",
    "UK Boards (GCSE/A-Level)": "flag",
    "American Curriculum": "star",
  };

  const colorMap: { [key: string]: { color: string; bgColor: string } } = {
    "Academic Subjects (Core)": { color: '#4F46E5', bgColor: '#EEF2FF' },
    "Humanities & Social Sciences": { color: '#059669', bgColor: '#ECFDF5' },
    "Languages": { color: '#DC2626', bgColor: '#FEF2F2' },
    "Commerce & Professional Studies": { color: '#7C2D12', bgColor: '#FEF7ED' },
    "Arts & Creative Subjects": { color: '#BE185D', bgColor: '#FDF2F8' },
    "Applied & Vocational Subjects": { color: '#1D4ED8', bgColor: '#EFF6FF' },
    "CBSE/ICSE/State Boards": { color: '#9333EA', bgColor: '#FAF5FF' },
    "IB (International Baccalaureate)": { color: '#0891B2', bgColor: '#F0F9FF' },
    "UK Boards (GCSE/A-Level)": { color: '#EA580C', bgColor: '#FFF7ED' },
    "American Curriculum": { color: '#CA8A04', bgColor: '#FFFBEB' },
    default: { color: '#4B5563', bgColor: '#F3F4F6' },
  };

  const renderCategoryBoardCard = (category: Category) => {
    const id = String(category.c_id);
    const title = category.c_name;
    const icon = iconMap[title] || 'help-circle-outline';
    const colors = colorMap[title] || colorMap.default;
    const isHovered = hoveredBoard === id;
    const isSelected = id === selectedCategoryId;

    return (
      <TouchableOpacity
        key={id}
        style={[
          styles.boardCard,
          isHovered ? styles.boardCardHovered : styles.boardCardNormal,
        ]}
        onPress={() => {
          setSelectedCategoryId(id);
          router.push({ pathname: "/category/[id]", params: { id } });
        }}
        onPressIn={() => setHoveredBoard(id)}
        onPressOut={() => setHoveredBoard(null)}
        activeOpacity={1}
      >
        <View style={[styles.boardIconWrap, { backgroundColor: isHovered || isSelected ? colors.bgColor : '#F3F4F6' }]}>
          <Ionicons name={icon as any} size={24} color={isHovered || isSelected ? colors.color : '#4B5563'} />
        </View>
        <Text style={[styles.boardTitle, isHovered || isSelected ? styles.boardTitleHovered : styles.boardTitleNormal]} numberOfLines={2}>
          {title}
        </Text>
        <View style={[styles.boardIndicator, { backgroundColor: isHovered || isSelected ? colors.color : 'transparent' }]} />
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    if (adminCategories && adminCategories.length > 0) {
      // Load courses for the first category by default
      const firstId = String(adminCategories[0].c_id);
      setSelectedCategoryId((prev) => prev ?? firstId);
      dispatch(fetchCategoryCoursesAsync((selectedCategoryId ?? firstId)));
    }
  }, [dispatch, adminCategories]);

  const renderCourseCard = (course: any, index: number) => {
    const imageUri = course?.course_image
      ? (course.course_image.startsWith('http') ? course.course_image : `${API_BASE_URL}/${course.course_image}`)
      : null;
    return (
      <View key={`${course.course_id}-${index}`} style={styles.courseCardAdmin}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.courseThumb} resizeMode="cover" />
        ) : (
          <View style={[styles.courseThumb, styles.courseThumbPlaceholder]} />
        )}
        <Text style={styles.courseTitleText} numberOfLines={2}>{course.course_name}</Text>
        <Text style={styles.courseMetaText} numberOfLines={1}>ID: {course.course_id}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <AdminNavbar adminName={user?.name || "Admin"} onMenuPress={toggleMenu} isMenuOpen={isMenuOpen} onProfilePress={() => router.push(APP_ROUTES.ADMIN_PROFILE)} />

      <Animated.View
        style={[
          styles.mainContent,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {/* Statistics Cards */}
          <View style={styles.cardsContainer}>
            {cardData.map((card, index) => {
              const pressAnim = createPressAnimation();
              return (
                <AnimatedTouchableOpacity
                  key={index}
                  style={[
                    styles.card,
                    {
                      opacity: cardAnimations[index],
                      transform: [
                        {
                          translateY: cardAnimations[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [50, 0],
                          }),
                        },
                        { scale: pressAnim.scaleValue },
                      ],
                    },
                  ]}
                  onPressIn={pressAnim.onPressIn}
                  onPressOut={pressAnim.onPressOut}
                  activeOpacity={1}
                >
                  {/* Gradient Background */}
                  <View
                    style={[
                      styles.cardGradient,
                      { backgroundColor: card.bgColor },
                    ]}
                  />

                  <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                      <View>
                        <Text style={styles.cardTitle}>{card.title}</Text>
                        <Text
                          style={[styles.cardNumber, { color: card.color }]}
                        >
                          {card.number}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.cardIconContainer,
                          { backgroundColor: card.bgColor },
                        ]}
                      >
                        <Ionicons
                          name={card.icon as any}
                          size={24}
                          color={card.color}
                        />
                      </View>
                    </View>

                    <View style={styles.cardButtons}>
                      <TouchableOpacity
                        style={[
                          styles.cardButton,
                          { backgroundColor: card.color },
                        ]}
                        onPress={card.onView as any}
                      >
                        <Text style={styles.viewButtonText}>{(card as any).viewLabel}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.cardButton, styles.addButton]}
                        onPress={card.onAdd as any}
                      >
                        <Text style={[styles.addButtonText, { color: card.color }]}>{(card as any).addLabel}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </AnimatedTouchableOpacity>
              );
            })}
          </View>

          {/* Attendance View Card */}
          <View style={styles.cardsContainer}>
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.cardTitle}>Attendance View</Text>
                  </View>
                  <View style={[styles.cardIconContainer, { backgroundColor: '#FEF7ED' }]}>
                    <Ionicons name="calendar-outline" size={24} color="#EA580C" />
                  </View>
                </View>
                <View style={styles.cardButtons}>
                  <TouchableOpacity style={[styles.cardButton, { backgroundColor: '#06B6D4' }]}
                    onPress={() => router.push('/admin/attendance' as any)}>
                    <Text style={styles.viewButtonText}>View Attendence</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Categories (Home-like boards) */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
          </View>
          <View style={styles.boardsGridAdmin}>
            {(adminCategories || []).map(renderCategoryBoardCard)}
            {(!adminCategories || adminCategories.length === 0) && (
              <Text style={styles.categoriesEmptyText}>
                {categoriesLoading ? 'Loading categories...' : 'No categories found.'}
              </Text>
            )}
          </View>
          {/* Footer */}
          {/* <AdminFooter onScrollToTop={handleScrollToTop} /> */}
        </ScrollView>
      </Animated.View>

      {/* Sidebar */}
      {isMenuOpen && (
        <AdminSideBar
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          slideAnim={slideAnim}
          adminName={user?.name || "Admin"}
          adminEmail={user?.email || "admin@example.com"}
        />
      )}

      {/* Overlay */}
      {isMenuOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleMenu}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  mainContent: { flex: 1 },
  scrollContent: { padding: 20 },
  welcomeSection: { marginBottom: 25, paddingHorizontal: 5 },
  welcomeText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A202C",
    marginBottom: 5,
  },
  welcomeSubText: { fontSize: 16, color: "#718096", fontWeight: "400" },
  cardsContainer: { marginBottom: 30, gap: 15 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    minHeight: 140,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
    }),
  },
  cardGradient: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "40%",
    height: "100%",
    opacity: 0.1,
  },
  cardContent: { padding: 20, flex: 1 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 14,
    color: "#718096",
    fontWeight: "500",
    marginBottom: 8,
  },
  cardNumber: { fontSize: 32, fontWeight: "800", letterSpacing: -1 },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cardButtons: { flexDirection: "row", gap: 12 },
  cardButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
  },
  viewButtonText: { color: "#FFFFFF", fontSize: 13, fontWeight: "600" },
  addButton: {
    backgroundColor: "#F7FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  addButtonText: { fontSize: 13, fontWeight: "600" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#1A202C" },
  seeAllButton: { flexDirection: "row", alignItems: "center", gap: 4 },
  seeAllText: { fontSize: 14, fontWeight: "600", color: "#2196F3" },
  categoriesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 30 },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryChipSelected: { backgroundColor: '#EEF2FF', borderColor: '#6366F1' },
  categoryChipText: { color: '#374151', fontSize: 13, fontWeight: '600' },
  categoryChipTextSelected: { color: '#3730A3' },
  boardsGridAdmin: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginBottom: 24 },
  boardCard: {
    width: (screenWidth - 40 - 36) / 2,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    position: 'relative',
  },
  boardCardNormal: { backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' },
  boardCardHovered: { backgroundColor: '#FFFFFF', borderColor: '#4F46E5' },
  boardIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  boardTitle: { fontSize: 15, fontWeight: '700' },
  boardTitleNormal: { color: '#4A5568' },
  boardTitleHovered: { color: '#1A202C' },
  boardIndicator: { position: 'absolute', right: 12, bottom: 12, width: 24, height: 4, borderRadius: 2 },
  categoriesEmptyText: { color: '#718096' },
  coursesGridAdmin: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12, marginBottom: 30 },
  courseCardAdmin: {
    width: (screenWidth - 40 - 24) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
      android: { elevation: 3 },
    }),
  },
  courseThumb: { height: 110, borderRadius: 10, backgroundColor: '#F3F4F6', marginBottom: 10, width: '100%' },
  courseThumbPlaceholder: { borderWidth: 1, borderColor: '#E5E7EB' },
  courseTitleText: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 6 },
  courseMetaText: { fontSize: 12, color: '#6B7280' },
  coursesGrid: { gap: 16 },
  courseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },
  courseHeaderStrip: { width: '100%', height: 12 },
  courseCardContent: { padding: 16 },
  courseStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  courseStatItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  courseStatText: { fontSize: 12, color: "#757575", fontWeight: "500" },
  courseTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A202C",
    marginBottom: 12,
    lineHeight: 22,
  },
  progressContainer: { marginBottom: 16 },
  progressLabel: {
    fontSize: 12,
    color: "#718096",
    fontWeight: "500",
    marginBottom: 6,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#E2E8F0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 3 },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  continueButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
});

export default AdminDashboard;
