import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageStyle,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  interface Stat {
    number: string;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
  }

  const stats: Stat[] = [
    { number: '16+', label: 'Years of Experience', icon: 'medal-outline' },
    { number: '3.2K', label: 'Happy Students', icon: 'people-outline' },
  ];

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: isVisible ? 1 : 0, transform: [{ translateY: isVisible ? 0 : 20 }] },
      ]}>
      {/* Background Decorations */}
      <View style={styles.backgroundDecorations}>
        <View style={styles.decorationCircle1} />
        <View style={styles.decorationCircle2} />
        <View style={styles.decorationCircle3} />
      </View>

      <View style={styles.contentWrapper}>
        <View style={styles.gridContainer}>

          {/* Left Image Section */}
          <View style={styles.leftImageSection}>
            <View style={styles.mainImageContainer}>
              <Image
                source={require('../../../../assets/images/about-img1.webp')}
                style={styles.mainImage as ImageStyle}
              />
              <View style={styles.mainImageOverlay} />

              {/* Floating Stats Cards */}
              {stats.map((stat, index) => {
                const topPosition = index === 0 ? 20 : 100;
                return (
                  <View
                    key={index}
                    style={[
                      styles.floatingCard,
                      { top: topPosition, right: 20 },
                    ]}>
                    <View style={styles.floatingCardContent}>
                      <LinearGradient
                        colors={['#2196F3', '#673AB7']}
                        style={styles.floatingCardIconBg}>
                        <Ionicons name={stat.icon as any} size={20} color='white' />
                      </LinearGradient>
                      <View>
                        <Text style={styles.floatingCardNumber}>{stat.number}</Text>
                        <Text style={styles.floatingCardLabel}>{stat.label}</Text>
                      </View>
                    </View>
                  </View>
                );
              })}

              {/* Promotional Offer Card */}
              <View style={[styles.floatingCard, styles.promoCard]}>
                <View style={styles.floatingCardContent}>
                  <LinearGradient
                    colors={['#FF9800', '#FF5722']}
                    style={styles.floatingCardIconBg}>
                    <Ionicons name='time-outline' size={20} color='white' />
                  </LinearGradient>
                  <View>
                    <Text style={styles.promoText}>20% OFF</Text>
                    <Text style={styles.floatingCardLabel}>For All Courses</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Secondary Image */}
            <View style={styles.secondaryImageContainer}>
              <Image
                source={require('../../../../assets/images/about-img2.png')}
                style={styles.secondaryImage as ImageStyle}
              />
              <View style={styles.secondaryImageOverlay} />
            </View>

            {/* Decorative Elements for images */}
            <View style={styles.imageDecoration1} />
            <View style={styles.imageDecoration2} />
          </View>

          {/* Right Content Section */}
          <View style={styles.rightContentSection}>
            {/* Header */}
            <View style={styles.contentHeader}>
              <View style={styles.aboutTag}>
                <View style={styles.aboutTagDot} />
                <Text style={styles.aboutTagText}>About EduAll</Text>
              </View>
              <Text style={styles.contentTitle}>
                The Place Where You Can{' '}
                <Text style={styles.contentTitleHighlight}>
                  Achieve
                </Text>
              </Text>
              <Text style={styles.contentDescription}>
                Welcome to EduAll, where learning knows no bounds. Whether you're a student, professional,
                or lifelong learner, we provide the tools and knowledge you need to succeed.
              </Text>
            </View>

            {/* Mission & Vision */}
            <View style={styles.missionVisionContainer}>
              <View style={styles.missionVisionCard}>
                <View style={styles.mvCardContent}>
                  <LinearGradient
                    colors={['#2196F3', '#673AB7']}
                    style={styles.mvCardIconBg}>
                    <Ionicons name='compass-outline' size={24} color='white' />
                  </LinearGradient>
                  <View style={styles.mvCardTextContent}>
                    <Text style={styles.mvCardTitle}>Our Mission</Text>
                    <Text style={styles.mvCardDescription}>
                      Driven by a team of dedicated educators, technologists, and visionaries,
                      we strive to create a supportive learning environment that empowers every learner.
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.missionVisionCard}>
                <View style={styles.mvCardContent}>
                  <LinearGradient
                    colors={['#673AB7', '#E91E63']}
                    style={styles.mvCardIconBg}>
                    <Ionicons name='eye-outline' size={24} color='white' />
                  </LinearGradient>
                  <View style={styles.mvCardTextContent}>
                    <Text style={styles.mvCardTitle}>Our Vision</Text>
                    <Text style={styles.mvCardDescription}>
                      Whether you're a professional seeking to upskill, or a lifelong learner exploring new horizons,
                      we're here to accompany you every step of the way.
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Bottom Section */}
            <View style={styles.bottomContentSection}>
              <TouchableOpacity style={styles.readMoreButton}>
                <LinearGradient
                  colors={['#2196F3', '#673AB7']}
                  style={styles.readMoreButtonGradient}>
                  <Text style={styles.readMoreButtonText}>Read More</Text>
                  <Ionicons name='arrow-forward-outline' size={18} color='white' />
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.ceoCard}>
                <View style={styles.ceoImageWrapper}>
                  <Image
                 source={require('../../../../assets/images/about-img2.png')}
                    style={styles.ceoImage as ImageStyle}
                  />
                </View>
                <View>
                  <Text style={styles.ceoName}>Asfour MLoy</Text>
                  <Text style={styles.ceoTitle}>CEO of Company</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    paddingVertical: 40,
    flex: 1,
  },
  backgroundDecorations: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
  },
  decorationCircle1: {
    position: 'absolute',
    top: -96,
    right: -96,
    width: 384,
    height: 384,
    backgroundColor: 'rgba(159, 184, 250, 0.3)',
    borderRadius: 192,
  },
  decorationCircle2: {
    position: 'absolute',
    bottom: -128,
    left: -128,
    width: 320,
    height: 320,
    backgroundColor: 'rgba(182, 169, 255, 0.3)',
    borderRadius: 160,
  },
  decorationCircle3: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -128 }, { translateY: -128 }],
    width: 256,
    height: 256,
    backgroundColor: 'rgba(135, 206, 235, 0.2)',
    borderRadius: 128,
  },
  contentWrapper: {
    position: 'relative',
    zIndex: 10,
    flex: 1,
  },
  gridContainer: {
    flexDirection: width > 768 ? 'row' : 'column',
    gap: width > 768 ? 40 : 20,
    alignItems: 'center',
    maxWidth: 1200,
    marginHorizontal: 'auto',
    paddingHorizontal: 20,
  },
  leftImageSection: {
    width: width > 768 ? '50%' : '100%',
    position: 'relative',
  },
  mainImageContainer: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    aspectRatio: 4 / 3,
    backgroundColor: 'transparent',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mainImageOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  floatingCard: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  floatingCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  floatingCardIconBg: {
    padding: 8,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingCardNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  floatingCardLabel: {
    fontSize: 12,
    color: '#4A5568',
    fontWeight: '500',
  },
  promoCard: {
    bottom: 20,
    left: 20,
  },
  promoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF8F00',
  },
  secondaryImageContainer: {
    position: 'absolute',
    bottom: -30,
    right: -30,
    width: 192,
    height: 144,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  secondaryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  secondaryImageOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  imageDecoration1: {
    position: 'absolute',
    top: -15,
    left: -15,
    width: 96,
    height: 96,
    backgroundColor: 'rgba(159, 184, 250, 0.3)',
    borderRadius: 48,
    filter: 'blur(1rem)',
  },
  imageDecoration2: {
    position: 'absolute',
    bottom: -15,
    left: -30,
    width: 64,
    height: 64,
    backgroundColor: 'rgba(182, 169, 255, 0.4)',
    borderRadius: 32,
    filter: 'blur(0.8rem)',
  },
  rightContentSection: {
    width: width > 768 ? '50%' : '100%',
    gap: 30,
    paddingVertical: 20,
  },
  contentHeader: {
    gap: 20,
  },
  aboutTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aboutTagDot: {
    width: 8,
    height: 8,
    backgroundColor: '#2196F3',
    borderRadius: 4,
  },
  aboutTagText: {
    color: '#2196F3',
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  contentTitle: {
    fontSize: width > 768 ? 44 : 34,
    fontWeight: 'bold',
    color: '#1A1A1A',
    lineHeight: width > 768 ? 50 : 40,
  },
  contentTitleHighlight: {
    color: '#673AB7',
  },
  contentDescription: {
    fontSize: 16,
    color: '#4A5568',
    lineHeight: 24,
    maxWidth: 500,
  },
  missionVisionContainer: {
    gap: 20,
  },
  missionVisionCard: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  mvCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 15,
    padding: 20,
  },
  mvCardIconBg: {
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mvCardTextContent: {
    flex: 1,
  },
  mvCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 5,
  },
  mvCardDescription: {
    fontSize: 15,
    color: '#4A5568',
    lineHeight: 22,
  },
  bottomContentSection: {
    flexDirection: width > 768 ? 'row' : 'column',
    alignItems: width > 768 ? 'center' : 'flex-start',
    gap: 20,
    paddingTop: 20,
  },
  readMoreButton: {
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  readMoreButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  readMoreButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  ceoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  ceoImageWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#BBDEFB',
  },
  ceoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  ceoName: {
    fontWeight: '600',
    color: '#1A202C',
    fontSize: 16,
  },
  ceoTitle: {
    fontSize: 14,
    color: '#4A5568',
  },
});

export default AboutSection;