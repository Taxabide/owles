import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, Image, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { APP_ROUTES } from '../../constants/routes';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface AdminSideBarProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  slideAnim: Animated.Value;
  adminName: string;
  adminEmail: string;
}

const AdminSideBar: React.FC<AdminSideBarProps> = ({ isMenuOpen, toggleMenu, slideAnim, adminName, adminEmail }) => {
  const router = useRouter();

  // Dropdown states for Teacher, Courses, Students
  const [isTeacherDropdownOpen, setIsTeacherDropdownOpen] = useState(false);
  const teacherDropdownHeightAnim = useRef(new Animated.Value(0)).current;
  const teacherDropdownOpacityAnim = useRef(new Animated.Value(0)).current;

  const [isCoursesDropdownOpen, setIsCoursesDropdownOpen] = useState(false);
  const coursesDropdownHeightAnim = useRef(new Animated.Value(0)).current;
  const coursesDropdownOpacityAnim = useRef(new Animated.Value(0)).current;

  const [isStudentsDropdownOpen, setIsStudentsDropdownOpen] = useState(false);
  const studentsDropdownHeightAnim = useRef(new Animated.Value(0)).current;
  const studentsDropdownOpacityAnim = useRef(new Animated.Value(0)).current;

  const [isLectureDropdownOpen, setIsLectureDropdownOpen] = useState(false);
  const lectureDropdownHeightAnim = useRef(new Animated.Value(0)).current;
  const lectureDropdownOpacityAnim = useRef(new Animated.Value(0)).current;

  // General dropdown animation logic (reusable)
  const animateDropdown = (isOpen: boolean, heightAnim: Animated.Value, opacityAnim: Animated.Value) => {
    Animated.timing(heightAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false, // For maxHeight animation
    }).start();

    Animated.timing(opacityAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => { animateDropdown(isTeacherDropdownOpen, teacherDropdownHeightAnim, teacherDropdownOpacityAnim); }, [isTeacherDropdownOpen]);
  useEffect(() => { animateDropdown(isCoursesDropdownOpen, coursesDropdownHeightAnim, coursesDropdownOpacityAnim); }, [isCoursesDropdownOpen]);
  useEffect(() => { animateDropdown(isStudentsDropdownOpen, studentsDropdownHeightAnim, studentsDropdownOpacityAnim); }, [isStudentsDropdownOpen]);
  useEffect(() => { animateDropdown(isLectureDropdownOpen, lectureDropdownHeightAnim, lectureDropdownOpacityAnim); }, [isLectureDropdownOpen]);

  const toggleTeacherDropdown = () => setIsTeacherDropdownOpen(!isTeacherDropdownOpen);
  const toggleCoursesDropdown = () => setIsCoursesDropdownOpen(!isCoursesDropdownOpen);
  const toggleStudentsDropdown = () => setIsStudentsDropdownOpen(!isStudentsDropdownOpen);
  const toggleLectureDropdown = () => setIsLectureDropdownOpen(!isLectureDropdownOpen);

  return (
    <Animated.View 
      style={[
        styles.sidebar,
        { transform: [{ translateX: slideAnim }] }
      ]}
    >
      <ScrollView 
        style={styles.sidebarContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header with Logo, Brand Name, and Close Button */}
        <View style={styles.sidebarHeader}>
          <View style={styles.sidebarBranding}>
            <View style={styles.sidebarLogoContainer}>
              <Image
                  source={require('../../../assets/images/owles-logo1.webp')}
                  style={styles.sidebarLogoImage}
              />
            </View>
            <Text style={styles.sidebarBrandName}>O.W.L.E.S</Text>
          </View>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={toggleMenu}
            activeOpacity={0.7}
            accessibilityLabel="Close menu"
            accessibilityRole="button"
          >
            <Ionicons name="close" size={24} color="#616161" />
          </TouchableOpacity>
        </View>

        {/* Admin Profile Section */}
        <View style={styles.adminProfileSection}>
          <Text style={styles.adminTitle}>Admin</Text>
          <Text style={styles.adminEmail}>{adminEmail}</Text>
        </View>

        {/* Admin Navigation Links */}
        <View style={styles.sidebarNavLinks}>
          {/* Dashboard */}
          <TouchableOpacity style={[styles.sidebarNavLink, styles.activeNavLink]} activeOpacity={0.7} onPress={() => {
            router.push(APP_ROUTES.ADMIN_DASHBOARD);
            toggleMenu(); // Close sidebar
          }}>
            <View style={styles.navIconContainer}>
              <Ionicons name="apps-outline" size={22} color="#FF8F00" />
            </View>
            <Text style={[styles.sidebarNavLinkText, styles.activeNavText]}>Dashboard</Text>
          </TouchableOpacity>

          {/* Profile */}
          <TouchableOpacity style={styles.sidebarNavLink} activeOpacity={0.7} onPress={() => {
            router.push(APP_ROUTES.ADMIN_PROFILE);
            toggleMenu(); // Close sidebar
          }}>
            <View style={styles.navIconContainer}>
              <Ionicons name="albums-outline" size={22} color="#616161" />
            </View>
            <Text style={styles.sidebarNavLinkText}>Profile</Text>
          </TouchableOpacity>

          {/* Teacher Dropdown */}
          <TouchableOpacity style={styles.sidebarNavLink} activeOpacity={0.7} onPress={toggleTeacherDropdown}>
            <View style={styles.navIconContainer}>
              <Ionicons name="person-outline" size={22} color="#616161" />
            </View>
            <Text style={styles.sidebarNavLinkText}>Teacher</Text>
            <Ionicons name={isTeacherDropdownOpen ? "chevron-up" : "chevron-down"} size={16} color="#616161" />
          </TouchableOpacity>
          {isTeacherDropdownOpen && (
            <Animated.View style={[styles.dropdownContainer, { opacity: teacherDropdownOpacityAnim, maxHeight: teacherDropdownHeightAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 150],
            }) }]}>
              <Pressable style={styles.dropdownItem} onPress={() => { router.push(APP_ROUTES.ADMIN_TEACHERS); toggleMenu(); }}><Text style={styles.dropdownItemText}>All Teachers</Text></Pressable>
              <Pressable style={styles.dropdownItem} onPress={() => { router.push(APP_ROUTES.ADMIN_ADD_TEACHER); toggleMenu(); }}><Text style={styles.dropdownItemText}>Add Teacher</Text></Pressable>
              <Pressable style={styles.dropdownItem} onPress={() => { router.push(APP_ROUTES.ADMIN_TEACHERS); toggleMenu(); }}><Text style={styles.dropdownItemText}>Teacher List</Text></Pressable>
            </Animated.View>
          )}

          {/* Lecture Dropdown */}
          <TouchableOpacity style={styles.sidebarNavLink} activeOpacity={0.7} onPress={toggleLectureDropdown}>
            <View style={styles.navIconContainer}>
              <Ionicons name="easel-outline" size={22} color="#616161" />
            </View>
            <Text style={styles.sidebarNavLinkText}>Lecture</Text>
            <Ionicons name={isLectureDropdownOpen ? "chevron-up" : "chevron-down"} size={16} color="#616161" />
          </TouchableOpacity>
          {isLectureDropdownOpen && (
            <Animated.View style={[styles.dropdownContainer, { opacity: lectureDropdownOpacityAnim, maxHeight: lectureDropdownHeightAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 100],
            }) }]}>
              <Pressable style={styles.dropdownItem} onPress={() => { router.push('/admin/lectures/add' as any); toggleMenu(); }}>
                <Text style={styles.dropdownItemText}>Add Lecture</Text>
              </Pressable>
              <Pressable style={styles.dropdownItem} onPress={() => { router.push('/admin/lectures/view' as any); toggleMenu(); }}>
                <Text style={styles.dropdownItemText}>Lecture List</Text>
              </Pressable>
            </Animated.View>
          )}

          {/* Courses Dropdown */}
          <TouchableOpacity style={styles.sidebarNavLink} activeOpacity={0.7} onPress={toggleCoursesDropdown}>
            <View style={styles.navIconContainer}>
              <Ionicons name="school-outline" size={22} color="#616161" />
            </View>
            <Text style={styles.sidebarNavLinkText}>Courses</Text>
            <Ionicons name={isCoursesDropdownOpen ? "chevron-up" : "chevron-down"} size={16} color="#616161" />
          </TouchableOpacity>
          {isCoursesDropdownOpen && (
            <Animated.View style={[styles.dropdownContainer, { opacity: coursesDropdownOpacityAnim, maxHeight: coursesDropdownHeightAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 200],
            }) }]}>
              <Pressable style={styles.dropdownItem} onPress={() => { router.push(APP_ROUTES.ADMIN_ADD_COURSE);toggleMenu(); }}><Text style={styles.dropdownItemText}>Add Courses</Text></Pressable>
              <Pressable style={styles.dropdownItem}><Text style={styles.dropdownItemText}>Courses list</Text></Pressable>
              <Pressable style={styles.dropdownItem}><Text style={styles.dropdownItemText}>Add Category</Text></Pressable>
              <Pressable style={styles.dropdownItem} onPress={() => { router.push(APP_ROUTES.ADMIN_CATEGORY_LIST); toggleMenu(); }}><Text style={styles.dropdownItemText}>Category list</Text></Pressable>
            </Animated.View>
          )}

          {/* Students Dropdown */}
          <TouchableOpacity style={styles.sidebarNavLink} activeOpacity={0.7} onPress={toggleStudentsDropdown}>
            <View style={styles.navIconContainer}>
              <Ionicons name="people-outline" size={22} color="#616161" />
            </View>
            <Text style={styles.sidebarNavLinkText}>Students</Text>
            <Ionicons name={isStudentsDropdownOpen ? "chevron-up" : "chevron-down"} size={16} color="#616161" />
          </TouchableOpacity>
          {isStudentsDropdownOpen && (
            <Animated.View style={[styles.dropdownContainer, { opacity: studentsDropdownOpacityAnim, maxHeight: studentsDropdownHeightAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 150],
            }) }]}>
              <Pressable style={styles.dropdownItem}><Text style={styles.dropdownItemText}>Add Students</Text></Pressable>
              <Pressable style={styles.dropdownItem} onPress={() => { router.push(APP_ROUTES.ADMIN_STUDENTS); toggleMenu(); }}><Text style={styles.dropdownItemText}>Student list</Text></Pressable>
            </Animated.View>
          )}

          {/* Contact */}
          <TouchableOpacity style={styles.sidebarNavLink} activeOpacity={0.7} onPress={() => {
            router.push('/contact' as any);
            toggleMenu();
          }}>
            <View style={styles.navIconContainer}>
              <Ionicons name="chatbubbles-outline" size={22} color="#616161" />
            </View>
            <Text style={styles.sidebarNavLinkText}>Contact</Text>
          </TouchableOpacity>

          {/* Attendance */}
          <TouchableOpacity style={styles.sidebarNavLink} activeOpacity={0.7} onPress={() => {
            router.push(APP_ROUTES.ADMIN_ATTENDANCE as any);
            toggleMenu();
          }}>
            <View style={styles.navIconContainer}>
              <Ionicons name="calendar-outline" size={22} color="#616161" />
            </View>
            <Text style={styles.sidebarNavLinkText}>Attendance</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button (if needed, can be moved to bottom actions) */}
        {/* <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.logoutButton} activeOpacity={0.7}>
            <Ionicons name="log-out-outline" size={20} color="#EF5350" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View> */}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: Math.min(screenWidth * 0.85, 320), // Max width of 320 for sidebar
    height: screenHeight,
    backgroundColor: "#FFFFFF", // Revert to white background
    zIndex: 1001,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  sidebarContent: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Adjust for Android status bar
  },
  sidebarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  sidebarBranding: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sidebarLogoContainer: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  sidebarLogoImage: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  sidebarBrandName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF8F00",
    letterSpacing: 0.5,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  adminProfileSection: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 10,
  },
  adminTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  adminEmail: {
    fontSize: 14,
    color: '#666',
  },
  sidebarNavLinks: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  sidebarNavLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginVertical: 2,
    borderRadius: 10,
    minHeight: 48,
  },
  activeNavLink: {
    backgroundColor: "#FFF8F0",
  },
  navIconContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  sidebarNavLinkText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#666",
  },
  activeNavText: {
    color: "#FF8F00",
    fontWeight: "600",
  },
  dropdownContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 8,
    marginLeft: 32,
    marginRight: 20,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  bottomActions: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    gap: 8,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#FFF5F5",
    minHeight: 44,
  },
  logoutText: {
    fontSize: 14,
    color: "#FF4444",
    fontWeight: "500",
  },
});

export default AdminSideBar;
