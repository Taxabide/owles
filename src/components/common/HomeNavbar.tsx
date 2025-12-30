import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Animated,
    Dimensions,
    Image,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { colors } from "../../constants/colors";
import { fonts } from "../../constants/fonts";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Helper function to determine if it's a small screen
const isSmallScreen = screenWidth < 375;
const isMediumScreen = screenWidth >= 375 && screenWidth < 414;
const isLargeScreen = screenWidth >= 414;

interface HomeNavbarProps {
    onSignInPress?: () => void;
    toggleMenu?: () => void; // Changed from onMenuPress
    isMenuOpen?: boolean;
}

const HomeNavbar: React.FC<HomeNavbarProps> = ({
    onSignInPress,
    toggleMenu, // Use the prop directly
    isMenuOpen = false
}) => {
    // Remove the internal toggleMenu function

    return (
        <>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent={true}
            />
            <View style={styles.navbar}>
                <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? Math.max(8, screenWidth * 0.02) : 10 }]}>
                    {/* Left Side - Logo and Brand Name */}
                    <View style={styles.logoSection}>
                        <View style={styles.logoContainer}>
                            <Image
                                source={require('../../../assets/images/owles-logo1.webp')}
                                style={styles.logoImage}
                            />
                        </View>
                        <Text style={styles.brandName} numberOfLines={1} ellipsizeMode="tail">O.W.L.E.S</Text>
                    </View>

                    {/* Right Side - Action Icons */}
                    <View style={styles.actionIcons}>
                        <TouchableOpacity
                            style={styles.iconButton}
                            activeOpacity={0.7}
                            accessibilityLabel="Profile"
                            accessibilityRole="button"
                            onPress={onSignInPress}
                        >
                            <View style={styles.profileIconContainer}>
                                <Ionicons name="person-outline" size={Math.max(18, screenWidth * 0.048)} color="#FF8F00" />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.menuButton}
                            activeOpacity={0.7}
                            onPress={toggleMenu} // Use the prop directly
                            accessibilityLabel="Menu"
                            accessibilityRole="button"
                        >
                            <View style={styles.hamburgerMenu}>
                                <Animated.View style={[
                                    styles.hamburgerLine,
                                    { top: 0 }, // Initial position for the top line
                                    isMenuOpen && styles.hamburgerLineTopActive
                                ]} />
                                <Animated.View style={[
                                    styles.hamburgerLine,
                                    { top: 6 }, // Initial position for the middle line
                                    isMenuOpen && styles.hamburgerLineMiddle
                                ]} />
                                <Animated.View style={[
                                    styles.hamburgerLine,
                                    { top: 12 }, // Initial position for the bottom line
                                    isMenuOpen && styles.hamburgerLineBottomActive
                                ]} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    navbar: {
        backgroundColor: colors.white,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.border,
        width: '100%',
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
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: Math.max(12, screenWidth * 0.04),
        paddingVertical: Math.max(10, screenWidth * 0.03),
        minHeight: Math.max(50, screenWidth * 0.15),
        maxHeight: 70,
        width: '100%',
        maxWidth: screenWidth,
    },
    logoSection: {
        flexDirection: "row",
        alignItems: "center",
        gap: Math.max(6, screenWidth * 0.025),
        flex: 1,
        minWidth: 0, // Allow shrinking
    },
    logoContainer: {
        alignItems: "center",
        justifyContent: "center",
        width: Math.max(28, screenWidth * 0.08),
        height: Math.max(28, screenWidth * 0.08),
    },
    logoImage: {
        width: '100%',
        height: '100%',
        resizeMode: "contain",
    },
    brandName: {
        fontSize: Math.max(14, screenWidth * 0.04),
        fontWeight: fonts.weight.bold,
        color: '#FF8F00',
        letterSpacing: 0.5,
        flexShrink: 1,
    },
    actionIcons: {
        flexDirection: "row",
        alignItems: "center",
        gap: Math.max(8, screenWidth * 0.025),
        flexShrink: 0,
    },
    iconButton: {
        padding: 4,
        minWidth: 40,
        minHeight: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    profileIconContainer: {
        width: Math.max(32, screenWidth * 0.085),
        height: Math.max(32, screenWidth * 0.085),
        borderRadius: Math.max(16, screenWidth * 0.0425),
        borderWidth: 2,
        borderColor: '#FF8F00',
        backgroundColor: 'transparent',
        justifyContent: "center",
        alignItems: "center",
    },
    menuButton: {
        padding: 8,
        minWidth: 44,
        minHeight: 44,
        justifyContent: "center",
        alignItems: "center",
    },
    hamburgerMenu: {
        width: 20,
        height: 14,
        justifyContent: "space-between",
    },
    hamburgerLine: {
        width: "100%",
        height: 2,
        backgroundColor: "#333333",
        borderRadius: 1,
        position: "absolute",
        left: 0,
    },
    hamburgerLineActive: {
        transform: [{ rotate: "45deg" }],
        top: 6,
    },
    hamburgerLineMiddle: {
        opacity: 0,
    },
    // Add styles for transforming the other two lines
    hamburgerLineTopActive: {
        transform: [{ rotate: "45deg" }],
        top: 6,
    },
    hamburgerLineBottomActive: {
        transform: [{ rotate: "-45deg" }],
        top: 6,
    },
    // The mainContent style is no longer needed as HomeNavbar is a standalone header
});

export default HomeNavbar;
