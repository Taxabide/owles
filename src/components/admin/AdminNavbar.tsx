import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

const { width: screenWidth } = Dimensions.get('window');

const isSmallScreen = screenWidth < 375;
const isMediumScreen = screenWidth >= 375 && screenWidth < 414;

interface AdminNavbarProps {
  adminName?: string;
  onProfilePress?: () => void;
  onMenuPress: () => void;
  isMenuOpen: boolean;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ adminName = 'Admin', onProfilePress, onMenuPress, isMenuOpen }) => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} translucent={false} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.navbar}>
          <View style={styles.container}>
            {/* Left - Logo/Brand */}
            <View style={styles.logoSection}>
              <View style={styles.logoContainer}>
                <Image source={require('../../../assets/images/owles-logo1.webp')} style={styles.logoImage} />
              </View>
              <Text style={styles.brandName}>O.W.L.E.S</Text>
            </View>

            {/* Right - Profile + Menu */}
            <View style={styles.actionIcons}>
              <TouchableOpacity
                style={styles.iconButton}
                activeOpacity={0.7}
                accessibilityLabel="Profile"
                accessibilityRole="button"
                onPress={onProfilePress}
              >
                <View style={styles.profileIconContainer}>
                  <Ionicons name="person-outline" size={20} color={colors.textPrimary} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuButton}
                activeOpacity={0.7}
                onPress={onMenuPress}
                accessibilityLabel="Menu"
                accessibilityRole="button"
              >
                <View style={styles.hamburgerMenu}>
                  <Animated.View style={[styles.hamburgerLine, isMenuOpen && styles.hamburgerLineActive]} />
                  <Animated.View style={[styles.hamburgerLine, isMenuOpen && styles.hamburgerLineMiddle]} />
                  <Animated.View style={[styles.hamburgerLine, isMenuOpen && styles.hamburgerLineActive]} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
  },
  navbar: {
    backgroundColor: colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: isSmallScreen ? 16 : isMediumScreen ? 20 : 24,
    paddingVertical: isSmallScreen ? 12 : 15,
    minHeight: 60,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isSmallScreen ? 8 : 12,
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: isSmallScreen ? 28 : 32,
    height: isSmallScreen ? 28 : 32,
    resizeMode: 'contain',
  },
  brandName: {
    fontSize: isSmallScreen ? fonts.lg : fonts.xl,
    fontWeight: fonts.weight.bold,
    color: '#FF8F00',
    letterSpacing: 0.5,
  },
  actionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isSmallScreen ? 8 : 12,
  },
  iconButton: {
    padding: 4,
  },
  profileIconContainer: {
    width: isSmallScreen ? 30 : 32,
    height: isSmallScreen ? 30 : 32,
    borderRadius: isSmallScreen ? 15 : 16,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hamburgerMenu: {
    width: 20,
    height: 14,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    width: '100%',
    height: 2,
    backgroundColor: colors.textPrimary,
    borderRadius: 1,
  },
  hamburgerLineActive: {
    transform: [{ rotate: '45deg' }],
  },
  hamburgerLineMiddle: {
    opacity: 0,
  },
});

export default AdminNavbar;
