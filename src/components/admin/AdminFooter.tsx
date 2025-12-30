import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const getSectionWidth = () => {
  if (screenWidth > 768) {
    // On larger screens, each section takes up 1/5 of the available width
    return '20%';
  } else {
    // On mobile, sections stack vertically
    return '100%';
  }
};

interface AdminFooterProps {
  onScrollToTop: () => void;
}

const AdminFooter = ({ onScrollToTop }: AdminFooterProps) => {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const quickLinks = [
    { name: 'About us', path: '/about' },
    { name: 'Courses', path: '/courses' },
    { name: 'Instructor', path: '/instructor' },
    { name: 'FAQs', path: '/faq' },
    { name: 'Blogs', path: '/blogs' },
  ];

  const categories = [
    { name: 'UI/UX Design' },
    { name: 'Web Development' },
    { name: 'Python Development' },
    { name: 'Digital Marketing' },
    { name: 'Graphic Design' },
  ];

  const contactInfo = [
    { icon: 'call-outline', lines: ['(207) 555-0119', '(704) 555-0127'] },
    { icon: 'mail-outline', lines: ['dwallo@gmail.com', 'eduAll@gmail.com'] },
    { icon: 'location-outline', lines: ['5488 srker Rd .', '8745 doer Dr.'] },
  ];

  return (
    <View style={styles.footerContainer}>
      <View style={styles.footerInnerContainer}>
        <View style={styles.footerContent}>
          <View style={styles.section}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../../assets/images/owles-logo1.webp')}
                style={styles.logo}
              />
              <Text style={styles.brandName}>EduAll</Text>
            </View>
            <Text style={styles.description}>
              EduAll exceeded all my expectations! The instructors were not only experts
            </Text>
            <View style={styles.socialIcons}>
              <View style={styles.socialIcon}><Ionicons name="logo-facebook" size={20} color="#FFFFFF" /></View>
              <View style={styles.socialIcon}><Ionicons name="logo-twitter" size={20} color="#FFFFFF" /></View>
              <View style={styles.socialIcon}><Ionicons name="logo-instagram" size={20} color="#FFFFFF" /></View>
              <View style={styles.socialIcon}><Ionicons name="logo-pinterest" size={20} color="#FFFFFF" /></View>
            </View>
          </View>

          {/* Quick Link Section */}
          <View style={[styles.section, { width: getSectionWidth() }]}>
            <Text style={styles.sectionTitle}>Quick Link</Text>
            {quickLinks.map((link, index) => (
              <TouchableOpacity key={index} onPress={() => router.push(link.path as any)}>
                <Text style={styles.linkText}>{link.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category</Text>
            {categories.map((category, index) => (
              <Text key={index} style={styles.linkText}>{category.name}</Text>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Us</Text>
            {contactInfo.map((info, index) => (
              <View key={index} style={styles.contactItem}>
                <Ionicons name={info.icon as any} size={16} color="#B0BEC5" style={styles.contactIcon} />
                <View>
                  {info.lines.map((line, lineIndex) => (
                    <Text key={lineIndex} style={styles.contactText}>{line}</Text>
                  ))}
                </View>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Subscribe Here</Text>
            <Text style={styles.subscribeText}>
              Enter your email address to register to our newsletter subscription
            </Text>
            <View style={styles.subscribeInputContainer}>
              <TextInput
                style={styles.emailInput}
                placeholder="Your Email"
                placeholderTextColor="#90A4AE"
                value={email}
                onChangeText={setEmail}
              />
              <TouchableOpacity style={styles.subscribeButton}>
                <Ionicons name="send" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.copyrightContainer}>
          <Text style={styles.copyrightText}>
            Copyright © 2025 <Text style={styles.eduAllText}>EduAll</Text> All Rights Reserved.
          </Text>
          <View style={styles.privacyTerms}>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.privacyTermsText}>Privacy Policy</Text>
            </TouchableOpacity>
            <Text style={styles.privacyTermsText}> | </Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.privacyTermsText}>Terms & Conditions</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.scrollToTopButton} onPress={onScrollToTop}>
          <Ionicons name="arrow-up" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: '#0F172A',
    paddingTop: 40,
    paddingBottom: 20,
    marginTop: 20,
    position: 'relative',
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  footerInnerContainer: {
    paddingHorizontal: 20,
  },
  footerContent: {
    flexDirection: screenWidth > 768 ? 'row' : 'column',
    justifyContent: 'space-between',
    marginBottom: 30,
    width: '100%',
  },
  section: {
    width: getSectionWidth(),
    marginBottom: 20,
    paddingHorizontal: screenWidth > 768 ? 10 : 0,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 10,
  },
  brandName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  description: {
    fontSize: 13,
    color: '#B0BEC5',
    marginBottom: 15,
    lineHeight: 18,
  },
  socialIcons: {
    flexDirection: 'row',
    gap: 15,
  },
  socialIcon: {
    backgroundColor: '#1C2B47',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  linkText: {
    fontSize: 13,
    color: '#B0BEC5',
    marginBottom: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  contactIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  contactText: {
    fontSize: 13,
    color: '#B0BEC5',
    lineHeight: 18,
  },
  subscribeText: {
    fontSize: 13,
    color: '#B0BEC5',
    marginBottom: 15,
    lineHeight: 18,
  },
  subscribeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C2B47',
    borderRadius: 8,
    overflow: 'hidden',
  },
  emailInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    color: '#FFFFFF',
    fontSize: 13,
  },
  subscribeButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  copyrightContainer: {
    borderTopWidth: 1,
    borderTopColor: '#2C3E50',
    paddingTop: 20,
    flexDirection: screenWidth > 768 ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: screenWidth > 768 ? 'center' : 'flex-start',
    width: '100%',
  },
  copyrightText: {
    fontSize: 13,
    color: '#B0BEC5',
    marginBottom: screenWidth > 768 ? 0 : 10,
  },
  eduAllText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  privacyTerms: {
    flexDirection: 'row',
    gap: 5,
  },
  privacyTermsText: {
    fontSize: 13,
    color: '#B0BEC5',
  },
  scrollToTopButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2196F3',
    width: 45,
    height: 45,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default AdminFooter;