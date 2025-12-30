import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const CertificateSection: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Top White Section with Logo */}
      <View style={styles.topSection}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../../assets/images/owles-logo1.webp')}
            style={styles.logo}
          />
          <Text style={styles.logoText}>O.W.L.E.S</Text>
        </View>
      </View>

      {/* Bottom Blue Section */}
      <View style={styles.bottomSection}>
        <View style={styles.contentContainer}>
          {/* Left Content Area */}
          <View style={styles.leftContent}>
            <View style={styles.sectionHeader}>
              <View style={styles.bulletPoint} />
              <Text style={styles.sectionTitle}>Get Certificate</Text>
            </View>
            
            <Text style={styles.mainHeading}>Get Quality Skills Certificate From the EduAll</Text>
            
            <TouchableOpacity style={styles.getStartedButton}>
              <Text style={styles.getStartedButtonText}>Get Started Now</Text>
              <Ionicons name="arrow-up" size={16} color="#2196F3" style={styles.buttonIcon} />
            </TouchableOpacity>
          </View>

          {/* Right Image Area */}
          <View style={styles.rightImageArea}>
            <Image
              source={require('../../../../assets/images/certificate-img.webp')}
              style={styles.mainImage}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    minHeight: 600,
  },
  topSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FF8F00',
  },
  bottomSection: {
    backgroundColor: '#2196F3',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 60,
    paddingHorizontal: 20,
    flex: 1,
  },
  contentContainer: {
    flexDirection: width > 768 ? 'row' : 'column',
    alignItems: 'center',
    gap: 40,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  leftContent: {
    flex: 1,
    width: width > 768 ? '50%' : '100%',
    alignItems: width > 768 ? 'flex-start' : 'center',
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
    backgroundColor: '#FFFFFF',
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  mainHeading: {
    fontSize: width > 768 ? 36 : 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 30,
    lineHeight: width > 768 ? 44 : 36,
    textAlign: width > 768 ? 'left' : 'center',
  },
  getStartedButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  getStartedButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    transform: [{ rotate: '45deg' }],
  },
  rightImageArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: width > 768 ? '50%' : '100%',
  },
  mainImage: {
    width: '100%',
    height: width > 768 ? 400 : 300,
    resizeMode: 'contain',
    maxWidth: 500,
  },
});

export default CertificateSection;
