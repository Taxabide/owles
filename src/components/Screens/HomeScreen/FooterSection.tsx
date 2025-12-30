import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const FooterSection = () => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;
  const dotsAnim = useRef([...Array(20)].map(() => new Animated.Value(0))).current;
  
  useEffect(() => {
    // Initial entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Logo pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(logoAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animated dots
    dotsAnim.forEach((anim, index) => {
      Animated.loop(
        Animated.timing(anim, {
          toValue: 1,
          duration: 3000 + (index * 200),
          useNativeDriver: true,
        })
      ).start();
    });
  }, []);

  const scrollToTop = () => {
    console.log('Scrolling to top');
  };

  const renderAnimatedDots = () => {
    return (
      <View style={styles.decorativeDotsContainer}>
        {dotsAnim.map((anim, index) => {
          const opacity = anim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0.1, 0.8, 0.1],
          });
          const scale = anim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0.5, 1.5, 0.5],
          });
          
          return (
            <Animated.View
              key={index}
              style={[
                styles.decorativeDot,
                {
                  opacity,
                  transform: [{ scale }],
                  left: (index % 5) * 8,
                  top: Math.floor(index / 5) * 8,
                }
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          overflow: 'hidden',
        },
      ]}
    >
      <LinearGradient
        colors={['#f8f9fa', '#e9ecef']}
        style={styles.gradient}
      >
        {/* Decorative dots background */}
        {renderAnimatedDots()}
        
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Content */}
          <View style={styles.mainContent}>
            
            {/* Brand Section */}
            <View style={styles.brandSection}>
              <View style={styles.logoContainer}>
                <View style={styles.logoWrapper}>
                  <Animated.View
                    style={[
                      styles.logoBackground,
                      {
                        transform: [{
                          scale: logoAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.05],
                          })
                        }]
                      }
                    ]}
                  >
                    <Image
                      source={require('../../../../assets/images/owles-logo1.webp')}
                      style={styles.logoImage}
                      resizeMode="contain"
                    />
                  </Animated.View>
                  <Text style={styles.brandName}>O.W.L.E.S</Text>
                </View>
              </View>

              <Text style={styles.testimonial}>
                Owles exceeded all my expectations! The instructors were not only experts
              </Text>

              <View style={styles.socialContainer}>
                <TouchableOpacity style={[styles.socialIcon, { borderColor: '#3b82f6' }]}>
                  <Ionicons name="logo-facebook" size={20} color="#3b82f6" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.socialIcon, { borderColor: '#1d9bf0' }]}>
                  <Ionicons name="logo-twitter" size={20} color="#1d9bf0" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.socialIcon, { borderColor: '#e4405f' }]}>
                  <Ionicons name="logo-instagram" size={20} color="#e4405f" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.socialIcon, { borderColor: '#bd081c' }]}>
                  <Ionicons name="logo-pinterest" size={20} color="#bd081c" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Content Sections */}
            <View style={styles.sectionsContainer}>
              
              {/* Navigation Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Navigation</Text>
                {['About us', 'Courses'].map((item, index) => (
                  <TouchableOpacity key={index} style={styles.linkItem}>
                    <Text style={styles.linkText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Contact Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Contact Us</Text>
                
                <View style={styles.contactItem}>
                  <View style={styles.contactIconContainer}>
                    <Ionicons name="call" size={16} color="#3b82f6" />
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactText}>(+91) 555-5555</Text>
                  </View>
                </View>

                <View style={styles.contactItem}>
                  <View style={styles.contactIconContainer}>
                    <Ionicons name="mail" size={16} color="#3b82f6" />
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactText}>owles@gmail.com</Text>
                  </View>
                </View>

                <View style={styles.contactItem}>
                  <View style={styles.contactIconContainer}>
                    <Ionicons name="location" size={16} color="#3b82f6" />
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactText}>Dehradun, Uttarakhand</Text>
                  </View>
                </View>
              </View>

              {/* Right dotted decoration */}
              <View style={styles.rightDecorative}>
                {[...Array(7)].map((_, row) => (
                  <View key={row} style={{ flexDirection: 'row', gap: 6 }}>
                    {[...Array(7)].map((__, col) => (
                      <View key={`${row}-${col}`} style={styles.rightDot} />
                    ))}
                  </View>
                ))}
              </View>
              
            </View>
          </View>

          {/* Footer Bottom */}
          <View style={styles.footerBottom}>
            <View style={styles.bottomContent}>
              <Text style={styles.copyright}>
                © 2025 Owles All Rights Reserved. Powered by Tulyarth DigiWeb
              </Text>

              <View style={styles.policies}>
                <TouchableOpacity>
                  <Text style={styles.policyText}>Privacy Policy</Text>
                </TouchableOpacity>
                <View style={styles.policySeparator} />
                <TouchableOpacity>
                  <Text style={styles.policyText}>Terms & Conditions</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.scrollToTopButton}
                onPress={scrollToTop}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#3b82f6', '#2563eb']}
                  style={styles.scrollButtonGradient}
                >
                  <Ionicons name="arrow-up" size={20} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  gradient: {
    flex: 1,
    position: 'relative',
    minHeight: 600,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  scrollContent: {
    flexGrow: 1,
  },
  decorativeDotsContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 40,
    height: 32,
    zIndex: 1,
  },
  decorativeDot: {
    position: 'absolute',
    width: 2,
    height: 2,
    backgroundColor: '#e2e8f0',
    borderRadius: 1,
  },
  mainContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    position: 'relative',
  },
  brandSection: {
    marginBottom: 50,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBackground: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  logoGradient: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  brandName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FF8F00',
    textShadowColor: 'rgba(255, 215, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  testimonial: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
    marginBottom: 25,
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  socialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sectionsContainer: {
    gap: 40,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  linkItem: {
    paddingVertical: 6,
  },
  linkText: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  contactIconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  contactInfo: {
    flex: 1,
  },
  contactText: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 22,
  },
  
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    borderStyle: 'dashed',
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  bottomContent: {
    alignItems: 'center',
    gap: 20,
  },
  copyright: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  policies: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  policyText: {
    fontSize: 14,
    color: '#64748b',
  },
  policySeparator: {
    width: 1,
    height: 16,
    backgroundColor: '#e2e8f0',
  },
  // Right dotted decoration (grid of small dots)
  rightDecorative: {
    position: 'absolute',
    right: 20,
    top: 120,
    gap: 6,
    backgroundColor: 'transparent',
  },
  rightDot: {
    width: 4,
    height: 4,
    backgroundColor: '#ef4444',
    borderRadius: 2,
    opacity: 0.6,
  },
  scrollToTopButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  scrollButtonGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});

export default FooterSection;