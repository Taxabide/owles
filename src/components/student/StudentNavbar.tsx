import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { API_BASE_URL, APP_ROUTES } from '../../constants/routes';
import { RootState } from '../../redux/store';

const { width: screenWidth } = Dimensions.get('window');

interface StudentNavbarProps {
  toggleMenu?: () => void;
  isMenuOpen?: boolean;
}

const StudentNavbar: React.FC<StudentNavbarProps> = ({
  toggleMenu,
  isMenuOpen = false,
}) => {
  const router = useRouter();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const handleProfilePress = () => {
    router.push(APP_ROUTES.STUDENT_PROFILE);
  };

  const formattedAuthImage = useMemo(() => {
    if (!authUser?.profileImage) return null;
    if (authUser.profileImage.startsWith('http') || authUser.profileImage.startsWith('file://') || authUser.profileImage.startsWith('data:')) {
      return authUser.profileImage;
    }
    if (authUser.profileImage.startsWith('/')) {
      return `${API_BASE_URL}${authUser.profileImage}`;
    }
    return `${API_BASE_URL}/${authUser.profileImage}`;
  }, [authUser?.profileImage]);

  useEffect(() => {
    if (formattedAuthImage) {
      setProfileImageUri(formattedAuthImage);
      setImageError(false);
    } else {
      setProfileImageUri(null);
    }
  }, [formattedAuthImage]);

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <View style={styles.navbarContainer}>
        <View style={styles.navbar}>
          {/* Left Side - Hamburger Menu */}
          <TouchableOpacity
            style={styles.menuButton}
            activeOpacity={0.7}
            onPress={toggleMenu}
            accessibilityLabel="Menu"
            accessibilityRole="button"
          >
            <View style={styles.hamburgerMenu}>
              <View style={[styles.hamburgerLine, styles.hamburgerLineTop]} />
              <View style={[styles.hamburgerLine, styles.hamburgerLineMiddle]} />
              <View style={[styles.hamburgerLine, styles.hamburgerLineBottom]} />
            </View>
          </TouchableOpacity>

          {/* Right Side - Profile Picture */}
          <TouchableOpacity
            style={styles.profileContainer}
            onPress={handleProfilePress}
            activeOpacity={0.8}
            accessibilityLabel="View Profile"
            accessibilityRole="button"
          >
            {profileImageUri && !imageError ? (
              <Image
                key={profileImageUri}
                source={{ uri: profileImageUri }}
                style={styles.profileImage}
                onError={(error) => {
                  console.log('Image load error for:', profileImageUri, error.nativeEvent.error);
                  setImageError(true);
                }}
                onLoadStart={() => {
                  setImageError(false);
                }}
                onLoad={() => {
                  setImageError(false);
                  console.log('Image loaded successfully:', profileImageUri);
                }}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Ionicons name="person" size={Math.max(20, screenWidth * 0.05)} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  navbarContainer: {
    backgroundColor: '#FFF8E1', // Light warm cream background matching logo
    paddingTop: Platform.OS === 'ios' ? Math.max(8, screenWidth * 0.02) : 10,
  },
  navbar: {
    backgroundColor: '#FF9800', // Vibrant orange matching OWLES logo
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Math.max(20, screenWidth * 0.05),
    paddingVertical: Math.max(14, screenWidth * 0.04),
    minHeight: Math.max(60, screenWidth * 0.16),
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#F57C00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  menuButton: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hamburgerMenu: {
    width: 24,
    height: 18,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    width: '100%',
    height: 2.5,
    backgroundColor: '#FFFFFF',
    borderRadius: 1.5,
  },
  hamburgerLineTop: {
    width: '100%',
  },
  hamburgerLineMiddle: {
    width: '80%',
  },
  hamburgerLineBottom: {
    width: '60%',
  },
  profileContainer: {
    width: Math.max(40, screenWidth * 0.11),
    height: Math.max(40, screenWidth * 0.11),
    borderRadius: Math.max(20, screenWidth * 0.055),
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFB74D', // Fallback background color
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    backgroundColor: 'transparent',
  },
  profilePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFB74D',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StudentNavbar;

