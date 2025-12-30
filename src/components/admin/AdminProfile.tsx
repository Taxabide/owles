import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import AdminNavbar from "./AdminNavbar";
import AdminSideBar from "./AdminSideBar";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const AdminProfile = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-screenWidth));
  const toggleMenu = () => {
    if (isMenuOpen) {
      Animated.timing(slideAnim, {
        toValue: -screenWidth,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start(() => setIsMenuOpen(false));
    } else {
      setIsMenuOpen(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }
  };

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/"); // Navigate to the login screen or home page
  };

  // Dummy Admin Data (replace with actual data from Redux/API)
  const admin = {
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Administrator",
    profileImage: "https://via.placeholder.com/200x200/4F46E5/FFFFFF?text=JD", // Enhanced placeholder
    joinedDate: "2023-01-15",
    lastLogin: "2024-03-10 10:30 AM",
    status: "Online",
    totalCourses: 24,
    totalStudents: 156,
    totalTeachers: 12,
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <AdminNavbar adminName={admin.name} onMenuPress={toggleMenu} isMenuOpen={isMenuOpen} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header with Gradient Background */}
        <View style={styles.headerGradient}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImageWrapper}>
              <Image source={{ uri: admin.profileImage }} style={styles.profileImage} />
              <View style={styles.statusIndicator}>
                <View style={styles.statusDot} />
              </View>
            </View>
            <Text style={styles.adminName}>{admin.name}</Text>
            <Text style={styles.adminRole}>{admin.role}</Text>
            <View style={styles.statusContainer}>
              <View style={styles.statusBadge}>
                <View style={styles.statusDotSmall} />
                <Text style={styles.statusText}>{admin.status}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="book-outline" size={24} color="#4F46E5" />
            </View>
            <Text style={styles.statNumber}>{admin.totalCourses}</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="people-outline" size={24} color="#10B981" />
            </View>
            <Text style={styles.statNumber}>{admin.totalStudents}</Text>
            <Text style={styles.statLabel}>Students</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="person-outline" size={24} color="#F59E0B" />
            </View>
            <Text style={styles.statNumber}>{admin.totalTeachers}</Text>
            <Text style={styles.statLabel}>Teachers</Text>
          </View>
        </View>

        {/* Profile Details Card */}
        <View style={styles.profileCard}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Ionicons name="mail-outline" size={20} color="#4F46E5" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Email Address</Text>
              <Text style={styles.detailValue}>{admin.email}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Ionicons name="calendar-outline" size={20} color="#4F46E5" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Joined Date</Text>
              <Text style={styles.detailValue}>{admin.joinedDate}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Ionicons name="time-outline" size={20} color="#4F46E5" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Last Login</Text>
              <Text style={styles.detailValue}>{admin.lastLogin}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.editButton} activeOpacity={0.8}>
            <View style={styles.buttonContent}>
              <Ionicons name="create-outline" size={20} color="#FFFFFF" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8} onPress={handleLogout}>
            <View style={styles.buttonContent}>
              <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Sidebar */}
      {isMenuOpen && (
        <AdminSideBar
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          slideAnim={slideAnim}
          adminName={admin.name}
          adminEmail={admin.email}
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
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  
  // Header Gradient Section
  headerGradient: {
    backgroundColor: "#4F46E5",
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  profileImageContainer: {
    alignItems: "center",
  },
  profileImageWrapper: {
    position: "relative",
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  statusIndicator: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#4F46E5",
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10B981",
  },
  adminName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  adminRole: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 15,
    textAlign: "center",
  },
  statusContainer: {
    marginTop: 10,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  statusDotSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
    marginRight: 8,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  // Stats Section
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: -20,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },

  // Profile Details Card
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "500",
  },

  // Action Buttons
  actionButtonsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  editButton: {
    backgroundColor: "#4F46E5",
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#EF4444",
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1,
  },
});

export default AdminProfile;
