import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Import useRouter
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, Image, Platform, Pressable, PressableStateCallbackType, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface SidebarProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  slideAnim: Animated.Value;
}

const Sidebar: React.FC<SidebarProps> = ({ isMenuOpen, toggleMenu, slideAnim }) => {
  const router = useRouter(); // Initialize router
  const [isCoursesDropdownOpen, setIsCoursesDropdownOpen] = useState(false);
  const dropdownHeightAnim = useRef(new Animated.Value(0)).current;
  const dropdownOpacityAnim = useRef(new Animated.Value(0)).current;

  const [isPagesDropdownOpen, setIsPagesDropdownOpen] = useState(false); // New state for Pages dropdown
  const pagesDropdownHeightAnim = useRef(new Animated.Value(0)).current;
  const pagesDropdownOpacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(dropdownHeightAnim, {
      toValue: isCoursesDropdownOpen ? 1 : 0,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false, // Height animation needs useNativeDriver: false
    }).start();

    Animated.timing(dropdownOpacityAnim, {
      toValue: isCoursesDropdownOpen ? 1 : 0,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [isCoursesDropdownOpen]);

  useEffect(() => {
    Animated.timing(pagesDropdownHeightAnim, {
      toValue: isPagesDropdownOpen ? 1 : 0,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();

    Animated.timing(pagesDropdownOpacityAnim, {
      toValue: isPagesDropdownOpen ? 1 : 0,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [isPagesDropdownOpen]);

  const toggleCoursesDropdown = () => {
    setIsCoursesDropdownOpen(!isCoursesDropdownOpen);
  };

  const togglePagesDropdown = () => {
    setIsPagesDropdownOpen(!isPagesDropdownOpen);
  };

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
        {/* Header with Close Button */}
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

        {/* User Profile Section */}
        <View style={styles.userSection}>
          <View style={styles.userAvatar}>
            <Ionicons name="person" size={22} color="#616161" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Welcome Back!</Text>
            <Text style={styles.userSubtitle}>Student Dashboard</Text>
          </View>
          <TouchableOpacity style={styles.editProfileButton}>
            <Ionicons name="chevron-forward" size={18} color="#616161" />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>85%</Text>
            <Text style={styles.statLabel}>Progress</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.sidebarSearchSection}>
          <View style={styles.sidebarSearchContainer}>
            <Ionicons name="search" size={18} color="#616161" style={styles.searchIcon} />
            <TextInput
              style={styles.sidebarSearchInput}
              placeholder="Search courses..."
              placeholderTextColor="#757575"
              returnKeyType="search"
            />
          </View>
        </View>

        {/* Navigation Links */}
        <View style={styles.sidebarNavLinks}>
          <Text style={styles.sectionTitle}>MAIN MENU</Text>
          
          <TouchableOpacity 
            style={[styles.sidebarNavLink, styles.activeNavLink]} 
            activeOpacity={0.7}
            onPress={() => {
              router.push('/'); // Navigate to home screen
              toggleMenu(); // Close sidebar after navigation
            }}
          >
            <View style={styles.navIconContainer}>
              <Ionicons name="home" size={22} color="#616161" />
            </View>
            <Text style={[styles.sidebarNavLinkText, styles.activeNavText]}>Home</Text>
            {/* <View style={styles.activeIndicator} /> */}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.sidebarNavLink} activeOpacity={0.7} onPress={toggleCoursesDropdown}>
            <View style={styles.navIconContainer}>
              <Ionicons name="school-outline" size={22} color="#616161" />
            </View>
            <Text style={styles.sidebarNavLinkText}>Courses</Text>
            <Ionicons name={isCoursesDropdownOpen ? "chevron-up" : "chevron-down"} size={16} color="#616161" />
          </TouchableOpacity>

          {isCoursesDropdownOpen && (
            <Animated.View style={[styles.dropdownContainer, { opacity: dropdownOpacityAnim, maxHeight: dropdownHeightAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 200], // Max height for dropdown
            }) }]}>
              <Pressable 
                // @ts-ignore
                style={({ pressed }: PressableStateCallbackType) => StyleSheet.flatten([
                  styles.dropdownItem,
                  ...(pressed ? [styles.dropdownItemActive] : []),
                ])}
              >
                <Text 
                  // @ts-ignore
                  style={({ pressed }: PressableStateCallbackType) => StyleSheet.flatten([
                    styles.dropdownItemText,
                    ...(pressed ? [styles.dropdownItemTextActive] : []),
                  ])}
                >Course Grid View</Text>
              </Pressable>
              <Pressable 
                // @ts-ignore
                style={({ pressed }: PressableStateCallbackType) => StyleSheet.flatten([
                  styles.dropdownItem,
                  ...(pressed ? [styles.dropdownItemActive] : []),
                ])}
              >
                <Text 
                  // @ts-ignore
                  style={({ pressed }: PressableStateCallbackType) => StyleSheet.flatten([
                    styles.dropdownItemText,
                    ...(pressed ? [styles.dropdownItemTextActive] : []),
                  ])}
                >Course List View</Text>
              </Pressable>
              <Pressable 
                // @ts-ignore
                style={({ pressed }: PressableStateCallbackType) => StyleSheet.flatten([
                  styles.dropdownItem,
                  ...(pressed ? [styles.dropdownItemActive] : []),
                ])}
              >
                <Text 
                  // @ts-ignore
                  style={({ pressed }: PressableStateCallbackType) => StyleSheet.flatten([
                    styles.dropdownItemText,
                    ...(pressed ? [styles.dropdownItemTextActive] : []),
                  ])}
                >Course Details</Text>
              </Pressable>
              <Pressable 
                // @ts-ignore
                style={({ pressed }: PressableStateCallbackType) => StyleSheet.flatten([
                  styles.dropdownItem,
                  ...(pressed ? [styles.dropdownItemActive] : []),
                ])}
              >
                <Text 
                  // @ts-ignore
                  style={({ pressed }: PressableStateCallbackType) => StyleSheet.flatten([
                    styles.dropdownItemText,
                    ...(pressed ? [styles.dropdownItemTextActive] : []),
                  ])}
                >Lesson Details</Text>
              </Pressable>
            </Animated.View>
          )}
          
          <TouchableOpacity style={styles.sidebarNavLink} activeOpacity={0.7} onPress={togglePagesDropdown}>
            <View style={styles.navIconContainer}>
              <Ionicons name="document-text-outline" size={22} color="#616161" />
            </View>
            <Text style={styles.sidebarNavLinkText}>Pages</Text>
            <Ionicons name={isPagesDropdownOpen ? "chevron-up" : "chevron-down"} size={16} color="#616161" />
          </TouchableOpacity>
          
          {isPagesDropdownOpen && (
            <Animated.View style={[styles.dropdownContainer, { opacity: pagesDropdownOpacityAnim, maxHeight: pagesDropdownHeightAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 200], // Max height for dropdown
            }) }]}>
              <Pressable 
                // @ts-ignore
                style={({ pressed }: PressableStateCallbackType) => StyleSheet.flatten([
                  styles.dropdownItem,
                  ...(pressed ? [styles.dropdownItemActive] : []),
                ])}
              >
                <Text 
                  // @ts-ignore
                  style={({ pressed }: PressableStateCallbackType) => StyleSheet.flatten([
                    styles.dropdownItemText,
                    ...(pressed ? [styles.dropdownItemTextActive] : []),
                  ])}
                >About</Text>
              </Pressable>
              
              <Pressable 
                // @ts-ignore
                style={({ pressed }: PressableStateCallbackType) => StyleSheet.flatten([
                  styles.dropdownItem,
                  ...(pressed ? [styles.dropdownItemActive] : []),
                ])}
                onPress={() => {
                  router.push('/gallery'); // Navigate to Gallery screen
                  toggleMenu(); // Close sidebar after navigation
                }}
              >
                <Text 
                  // @ts-ignore
                  style={({ pressed }: PressableStateCallbackType) => StyleSheet.flatten([
                    styles.dropdownItemText,
                    ...(pressed ? [styles.dropdownItemTextActive] : []),
                  ])}
                >Gallery</Text>
              </Pressable>
            </Animated.View>
          )}

          <TouchableOpacity style={styles.sidebarNavLink} activeOpacity={0.7}>
            <View style={styles.navIconContainer}>
              <Ionicons name="book-outline" size={22} color="#616161" />
            </View>
            <Text style={styles.sidebarNavLinkText}>Blog</Text>
            {/* <Ionicons name="chevron-forward" size={18} color="#757575" /> */}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.sidebarNavLink} 
            activeOpacity={0.7}
            onPress={() => {
              router.push('/contact'); // Navigate to contact screen
              toggleMenu(); // Close sidebar after navigation
            }}
          >
            <View style={styles.navIconContainer}>
              <Ionicons name="mail-outline" size={22} color="#616161" />
            </View>
            <Text style={styles.sidebarNavLinkText}>Contact</Text>
            {/* <Ionicons name="chevron-forward" size={18} color="#757575" /> */}
          </TouchableOpacity>

          <Text style={[styles.sectionTitle, { marginTop: 30 }]}>SUPPORT</Text>
          
          <TouchableOpacity style={styles.sidebarNavLink} activeOpacity={0.7}>
            <View style={styles.navIconContainer}>
              <Ionicons name="chatbubble-outline" size={22} color="#616161" />
            </View>
            <Text style={styles.sidebarNavLinkText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={18} color="#616161" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.sidebarNavLink} activeOpacity={0.7}>
            <View style={styles.navIconContainer}>
              <Ionicons name="star-outline" size={22} color="#616161" />
            </View>
            <Text style={styles.sidebarNavLinkText}>Rate App</Text>
            <Ionicons name="chevron-forward" size={18} color="#616161" />
          </TouchableOpacity>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.settingsButton} activeOpacity={0.7}>
            <Ionicons name="settings-outline" size={20} color="#616161" />
            <Text style={styles.settingsText}>Settings</Text>
            <Ionicons name="chevron-forward" size={18} color="#616161" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.logoutButton} activeOpacity={0.7}>
            <Ionicons name="log-out-outline" size={20} color="#EF5350" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: Math.min(screenWidth * 0.85, 320),
    height: screenHeight,
    backgroundColor: "#FFFFFF",
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
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
    padding: 16,
    backgroundColor: "#FFF8F0",
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#FF8F00",
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFE0B2",
    justifyContent: "center",
    alignItems: "center",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  userSubtitle: {
    fontSize: 12,
    color: "#666",
  },
  editProfileButton: {
    padding: 4,
  },
  quickStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF8F00",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: "#666",
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 8,
  },
  sidebarSearchSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sidebarSearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E9ECEF",
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  sidebarSearchInput: {
    flex: 1,
    fontSize: 14,
    color: "#424242",
  },
  sidebarNavLinks: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "#999",
    letterSpacing: 0.5,
    marginBottom: 12,
    marginTop: 5,
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
  activeIndicator: {
    width: 3,
    height: 16,
    backgroundColor: "#FF8F00",
    borderRadius: 2,
  },
  notificationBadge: {
    backgroundColor: "#FF4444",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  dropdownContainer: {
    backgroundColor: "#FFFFFF", // Changed background to white for dropdown
    borderRadius: 8,
    marginTop: 4, // Adjusted margin to be closer to the button
    marginBottom: 8,
    marginLeft: 32, // Indent the dropdown slightly
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
    paddingHorizontal: 16, // Adjusted padding for dropdown items
    borderRadius: 6,
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  // New styles for attractive dropdown
  dropdownItemActive: {
    backgroundColor: "#F0F4F8",
  },
  dropdownItemTextActive: {
    color: "#FF8F00",
    fontWeight: "600",
  },
  bottomActions: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    gap: 8,
  },
  settingsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    minHeight: 44,
  },
  settingsText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
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

export default Sidebar;
