import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const HeroSection: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Right Image Section */}
      <View style={styles.rightImageSection}>
        <Image
          source={require('../../../../assets/images/banner-img.webp')}
          style={styles.heroImage}
        />
        {/* Overlays */}
        <View style={styles.overlayCard1}>
          <View style={styles.overlayAvatarGroup}>
            <Text style={styles.overlayCardText}>36k+ Enrolled Students</Text>
            <View style={styles.avatars}>
              {/* TODO: Replace with actual avatar images */}
              <Image source={require('../../../../assets/images/banner-img.webp')} style={styles.avatar} />
              <Image source={require('../../../../assets/images/banner-img.webp')} style={styles.avatar} />
              <Image source={require('../../../../assets/images/banner-img.webp')} style={styles.avatar} />
              <Image source={require('../../../../assets/images/banner-img.webp')} style={styles.avatar} />
              <Image source={require('../../../../assets/images/banner-img.webp')} style={styles.avatar} />
            </View>
          </View>
        </View>


        {/* Decorative elements */}
        <View style={styles.decorativeArrow} />
        <View style={styles.decorativeTriangle} />
        <View style={styles.decorativeCircle} />
      </View>

      {/* Left Content Section */}
      <View style={styles.leftContent}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../../assets/images/banner-img.webp')}
            style={styles.logo}
          />
          <Text style={styles.logoText}>Your Future, Achieve Success</Text>
        </View>
        <Text style={styles.mainTitle}>
          Find Your <Text style={styles.idealText}>Ideal</Text> Course,
          <Text> </Text>
          Build <Text style={styles.skillsText}>Skills</Text>
        </Text>
        <Text style={styles.description}>
          Welcome to O.W.L.E.S, where learning knows no bounds. Whether you're a
          student, professional, or lifelong learner...
        </Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.browseButton} activeOpacity={0.9}>
            <LinearGradient
              colors={["#3b82f6", "#2563eb"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.browseButtonGradient}
            >
              <Text style={styles.browseButtonText}>Browse Courses</Text>
              <Ionicons
                name="arrow-forward"
                size={16}
                color="#FFFFFF"
                style={styles.buttonIcon}
              />
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.aboutButton}>
            <Text style={styles.aboutButtonText}>About Us</Text>
            <Ionicons
              name="arrow-forward"
              size={16}
              color="#2196F3"
              style={styles.buttonIcon}
            />
          </TouchableOpacity>
        </View>
        {/* Trust badge */}
        <View style={styles.trustRow}>
          <Ionicons name="shield-checkmark" size={16} color="#10b981" />
          <Text style={styles.trustText}>Trusted by 36k+ learners</Text>
        </View>

        {/* Decorative Dots */}
        <View style={styles.dotsContainer}>
          {Array.from({ length: 40 }).map((_, i) => (
            <View key={i} style={styles.dot} />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: width > 768 ? "row" : "column",
    minHeight: height,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  leftContent: {
    flex: 1,
    paddingHorizontal: 20,
    maxWidth: 600,
    alignItems: width > 768 ? "flex-start" : "center",
    justifyContent: "center",
    position: "relative",
    zIndex: 2,
    marginBottom: width > 768 ? 0 : 40,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 8,
  },
  logo: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  logoText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2196F3",
  },
  mainTitle: {
    fontSize: width > 768 ? 60 : 40,
    fontWeight: "900",
    color: "#1A1A1A",
    lineHeight: width > 768 ? 70 : 48,
    marginBottom: 20,
  },
  idealText: {
    color: "#FF8F00",
  },
  skillsText: {
    color: "#2196F3",
  },
  description: {
    fontSize: 18,
    color: "#666",
    lineHeight: 28,
    marginBottom: 30,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 15,
  },
  browseButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  browseButtonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  browseButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonIcon: {
    marginLeft: 5,
  },
  aboutButton: {
    backgroundColor: "#E3F2FD",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#2196F3",
  },
  aboutButtonText: {
    color: "#2196F3",
    fontSize: 16,
    fontWeight: "600",
  },
  trustRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },
  trustText: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "600",
  },
  dotsContainer: {
    position: "absolute",
    bottom: -40,
    left: -40,
    flexDirection: "row",
    flexWrap: "wrap",
    width: 120,
    height: 120,
    opacity: 0.3,
    zIndex: 0,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF8F00",
    margin: 5,
  },
  rightImageSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    height: width > 768 ? 520 : Math.round(width * 0.95),
    width: width > 768 ? undefined : "100%",
    marginBottom: width > 768 ? 0 : 20,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlayCard1: {
    position: "absolute",
    top: width > 768 ? 50 : 20,
    left: width > 768 ? 50 : 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    display: width > 768 ? "flex" : "none", // Hide on mobile for simplicity
  },
  overlayAvatarGroup: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  overlayCardText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  overlayCardSubText: {
    fontSize: 12,
    color: "#666",
  },
  avatars: {
    flexDirection: "row",
    marginTop: 5,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    marginLeft: -8,
  },
  overlayCard2: {
    position: "absolute",
    bottom: width > 768 ? 80 : 20,
    left: width > 768 ? 100 : 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  overlayCard3: {
    position: "absolute",
    top: width > 768 ? 150 : 80,
    right: width > 768 ? 80 : 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  overlayIcon: {
    backgroundColor: "#E3F2FD",
    padding: 8,
    borderRadius: 10,
  },
  decorativeArrow: {
    position: "absolute",
    top: 100,
    left: width > 768 ? 250 : 50,
    width: 0,
    height: 0,
    borderLeftWidth: 50,
    borderLeftColor: 'transparent',
    borderRightWidth: 50,
    borderRightColor: 'transparent',
    borderBottomWidth: 100,
    borderBottomColor: '#FFD700',
    opacity: 0.7,
    display: width > 768 ? "flex" : "none", // Hide on mobile
  },
  decorativeTriangle: {
    position: "absolute",
    bottom: 50,
    right: width > 768 ? 200 : 30,
    width: 0,
    height: 0,
    borderLeftWidth: 40,
    borderLeftColor: 'transparent',
    borderRightWidth: 40,
    borderRightColor: 'transparent',
    borderBottomWidth: 80,
    borderBottomColor: '#2196F3',
    opacity: 0.7,
    display: width > 768 ? "flex" : "none", // Hide on mobile
  },
  decorativeCircle: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFEBEE",
    opacity: 0.7,
    display: width > 768 ? "flex" : "none", // Hide on mobile
  },
});

export default HeroSection;
