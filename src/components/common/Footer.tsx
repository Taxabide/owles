import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Footer: React.FC = () => {
  const handleSocialPress = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.footer}>
      <View style={styles.footerContent}>
        <View style={styles.footerSection}>
          <Text style={styles.footerTitle}>O.W.L.E.S</Text>
          <Text style={styles.footerDescription}>
            Your comprehensive educational management system for students, teachers, and administrators.
          </Text>
          <View style={styles.socialLinks}>
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => handleSocialPress('https://facebook.com')}
            >
              <Ionicons name="logo-facebook" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => handleSocialPress('https://twitter.com')}
            >
              <Ionicons name="logo-twitter" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => handleSocialPress('https://instagram.com')}
            >
              <Ionicons name="logo-instagram" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => handleSocialPress('https://linkedin.com')}
            >
              <Ionicons name="logo-linkedin" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footerSection}>
          <Text style={styles.sectionTitle}>Quick Links</Text>
          <TouchableOpacity style={styles.footerLink}>
            <Text style={styles.footerLinkText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerLink}>
            <Text style={styles.footerLinkText}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerLink}>
            <Text style={styles.footerLinkText}>Courses</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerLink}>
            <Text style={styles.footerLinkText}>Contact</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerSection}>
          <Text style={styles.sectionTitle}>Support</Text>
          <TouchableOpacity style={styles.footerLink}>
            <Text style={styles.footerLinkText}>Help Center</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerLink}>
            <Text style={styles.footerLinkText}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerLink}>
            <Text style={styles.footerLinkText}>Terms of Service</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerLink}>
            <Text style={styles.footerLinkText}>FAQ</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerSection}>
          <Text style={styles.sectionTitle}>Contact Info</Text>
          <View style={styles.contactItem}>
            <Ionicons name="mail-outline" size={16} color="#FFFFFF" />
            <Text style={styles.contactText}>info@owles.com</Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="call-outline" size={16} color="#FFFFFF" />
            <Text style={styles.contactText}>+1 (555) 123-4567</Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="location-outline" size={16} color="#FFFFFF" />
            <Text style={styles.contactText}>123 Education St, Learning City</Text>
          </View>
        </View>
      </View>

      <View style={styles.footerBottom}>
        <Text style={styles.copyrightText}>
          © 2024 O.W.L.E.S. All rights reserved.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#1A1A1A',
    marginTop: 50,
    width: '100%',
  },
  footerContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 40,
    maxWidth: 1200,
    alignSelf: 'center',
  },
  footerSection: {
    flex: 1,
    minWidth: 200,
    marginBottom: 20,
  },
  footerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF8F00',
    marginBottom: 15,
  },
  footerDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
    marginBottom: 20,
  },
  socialLinks: {
    flexDirection: 'row',
    gap: 10,
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  footerLink: {
    marginBottom: 8,
  },
  footerLinkText: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: '#333333',
    paddingVertical: 20,
    alignItems: 'center',
  },
  copyrightText: {
    fontSize: 14,
    color: '#999999',
  },
});

export default Footer;
