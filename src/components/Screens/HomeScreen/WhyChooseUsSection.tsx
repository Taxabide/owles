import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const WhyChooseUsSection: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Decorative Dotted Patterns */}
      <View style={styles.leftTopDots} />
      <View style={styles.leftBottomDots} />
      <View style={styles.rightTopDots} />
      <View style={styles.rightBottomDots} />
      
      <View style={styles.contentContainer}>
        {/* Left Content Section */}
        <View style={styles.leftContentSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>O.W.L.E.S</Text>
          </View>
          
          <View style={styles.sectionHeader}>
            <View style={styles.bulletPoint} />
            <View style={styles.verticalDots} />
            <Text style={styles.sectionTitle}>Why Choose Us</Text>
          </View>
          
          <Text style={styles.mainHeading}>Our Commitment to Excellence, Learn, Grow & Success.</Text>
          
          <Text style={styles.description}>
            We are passionate about transforming lives through education. Founded with a vision to make learning accessible to all, we believe in the power of knowledge to change the world.
          </Text>
          
          {/* Key Features */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#2196F3" />
              <Text style={styles.featureText}>9/10 Average Satisfaction Rate</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#2196F3" />
              <Text style={styles.featureText}>96% Completion Rate</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#2196F3" />
              <Text style={styles.featureText}>Friendly Environment & Expert Teacher</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.readMoreButton}>
            <Text style={styles.readMoreButtonText}>Read More</Text>
            <Ionicons name="arrow-up" size={16} color="#FFFFFF" style={styles.buttonIcon} />
          </TouchableOpacity>
        </View>

        {/* Right Visual Section */}
        <View style={styles.rightVisualSection}>
          {/* Main Image */}
          <View style={styles.mainImageContainer}>
            <Image
              source={require('../../../../assets/images/choose-us-img1.webp')}
              style={styles.mainImage}
            />
            
            {/* Overlay Icon */}
            <View style={styles.overlayIcon}>
              <Ionicons name="book-outline" size={24} color="#FFFFFF" />
            </View>
            
            {/* Reviews Card */}
            
          </View>
          
          {/* Circular Image/Video */}
          <View style={styles.circularImageContainer}>
            <Image
              source={require('../../../../assets/images/choose-us-img2.webp')}
              style={styles.circularImage}
            />
            
            {/* Play Button */}
            <TouchableOpacity style={styles.playButton}>
              <Ionicons name="play" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          {/* Enrolled Students Card */}
          <View style={styles.enrolledCard}>
            <Text style={styles.enrolledText}>36k+ Enrolled Students</Text>
            <View style={styles.avatarsContainer}>
              {Array.from({ length: 5 }).map((_, index) => (
                <View key={index} style={styles.avatar}>
                  <Image
                    source={require('../../../../assets/images/choose-us-img1.webp')}
                    style={styles.avatarImage}
                  />
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 60,
    paddingHorizontal: 20,
    position: 'relative',
    minHeight: 800,
  },
  contentContainer: {
    flexDirection: width > 768 ? 'row' : 'column',
    alignItems: 'center',
    gap: 40,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  leftContentSection: {
    flex: 1,
    paddingHorizontal: 20,
    width: width > 768 ? '50%' : '100%',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FF8F00',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2196F3',
    marginRight: 10,
  },
  verticalDots: {
    width: 2,
    height: 30,
    backgroundColor: '#FF6B6B',
    marginRight: 15,
    opacity: 0.3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
  },
  mainHeading: {
    fontSize: width > 768 ? 36 : 28,
    fontWeight: '900',
    color: '#1A1A1A',
    marginBottom: 20,
    lineHeight: width > 768 ? 44 : 36,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 30,
  },
  featuresContainer: {
    marginBottom: 30,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  readMoreButton: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
  },
  readMoreButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    transform: [{ rotate: '45deg' }],
  },
  rightVisualSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: width > 768 ? '50%' : '100%',
    position: 'relative',
  },
  mainImageContainer: {
    position: 'relative',
    marginBottom: 20,
    width: '100%',
    maxWidth: 400,
  },
  mainImage: {
    width: '100%',
    height: 250,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  overlayIcon: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#FF8F00',
    borderRadius: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewsCard: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  circularImageContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  circularImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    backgroundColor: '#2196F3',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  enrolledCard: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  enrolledText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  avatarsContainer: {
    flexDirection: 'row',
    gap: -8,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    marginLeft: -8,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  // Decorative Dotted Patterns
  leftTopDots: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 60,
    height: 60,
    backgroundColor: '#FF6B6B',
    opacity: 0.1,
    borderRadius: 30,
  },
  leftBottomDots: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    width: 40,
    height: 40,
    backgroundColor: '#FF6B6B',
    opacity: 0.1,
    borderRadius: 20,
  },
  rightTopDots: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 50,
    height: 50,
    backgroundColor: '#FF6B6B',
    opacity: 0.1,
    borderRadius: 25,
  },
  rightBottomDots: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    width: 35,
    height: 35,
    backgroundColor: '#FF6B6B',
    opacity: 0.1,
    borderRadius: 17.5,
  },
});

export default WhyChooseUsSection;
