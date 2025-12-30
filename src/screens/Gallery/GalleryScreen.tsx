import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Footer from '../../components/Screens/HomeScreen/FooterSection';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window"); // Define screen dimensions

// Array of image sources from assets
const galleryImages = [
  { id: 1, source: require('../../../assets/images/dashbord-courses-img6.webp'), title: "Course Image 6" },
  { id: 2, source: require('../../../assets/images/dashbord-courses-img5.webp'), title: "Course Image 5" },
  { id: 3, source: require('../../../assets/images/dashbord-courses-img4.webp'), title: "Course Image 4" },
  { id: 4, source: require('../../../assets/images/dashbord-courses-img3.webp'), title: "Course Image 3" },
  { id: 5, source: require('../../../assets/images/dashbord-courses-img2.webp'), title: "Course Image 2" },
  { id: 6, source: require('../../../assets/images/dashbord-courses-img1.webp'), title: "Course Image 1" },
  { id: 7, source: require('../../../assets/images/certificate-img.webp'), title: "Certificate" },
  { id: 8, source: require('../../../assets/images/choose-us-img2.webp'), title: "Why Choose Us 2" },
  { id: 9, source: require('../../../assets/images/choose-us-img1.webp'), title: "Why Choose Us 1" },
  { id: 10, source: require('../../../assets/images/about-img2.png'), title: "About Us 2" },
  { id: 11, source: require('../../../assets/images/about-img1.webp'), title: "About Us 1" },
  { id: 12, source: require('../../../assets/images/banner-img.webp'), title: "Banner Image" },
  { id: 13, source: require('../../../assets/images/owles-logo1.webp'), title: "Owles Logo" },
];

const GalleryScreen = () => {
  const router = useRouter();
  // const [isMenuOpen, setIsMenuOpen] = useState(false); // Removed
  // const [slideAnim] = useState(new Animated.Value(-screenWidth)); // Removed

  // const toggleMenu = () => { // Removed
  //   if (isMenuOpen) {
  //     Animated.timing(slideAnim, {
  //       toValue: -screenWidth,
  //       duration: 300,
  //       easing: Easing.out(Easing.cubic),
  //       useNativeDriver: false,
  //     }).start(() => setIsMenuOpen(false));
  //   } else {
  //     setIsMenuOpen(true);
  //     Animated.timing(slideAnim, {
  //       toValue: 0,
  //       duration: 300,
  //       easing: Easing.out(Easing.cubic),
  //       useNativeDriver: false,
  //     }).start();
  //   }
  // };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Gallery</Text>
            <View style={styles.breadcrumbs}>
              <TouchableOpacity onPress={() => router.push('/')}>
                <Ionicons name="home" size={16} color="#888" />
              </TouchableOpacity>
              <Text style={styles.breadcrumbSeparator}> &gt; </Text>
              <Text style={styles.breadcrumbActive}>All Courses</Text>
            </View>
          </View>

          {/* Content Section */}
          <View style={styles.contentSection}>
            <View style={styles.contentHeader}>
              <Ionicons name="images-outline" size={24} color="#2196F3" />
              <Text style={styles.contentTitle}>Gallery</Text>
            </View>
            <Text style={styles.exploreTitle}>Explore Our Gallery</Text>
          </View>

          {/* Placeholder for gallery items */}
          <View style={styles.galleryItemsContainer}>
            {galleryImages.map((image) => (
              <TouchableOpacity key={image.id} style={styles.galleryItem} activeOpacity={0.8}>
                <Image 
                  source={image.source} 
                  style={styles.galleryImage}
                />
                <Text style={styles.imageTitle}>{image.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Footer />
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  breadcrumbs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breadcrumbSeparator: {
    marginHorizontal: 5,
    color: '#888',
  },
  breadcrumbActive: {
    color: '#FF8F00',
    fontWeight: '500',
  },
  contentSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  contentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 10,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2196F3',
    marginLeft: 8,
  },
  exploreTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30, // Add marginBottom to push content above footer
  },
  galleryItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 10, // Adjusted padding for grid
    marginBottom: 20,
    width: '100%',
  },
  galleryItem: {
    width: screenWidth * 0.42, // Roughly two items per row with spacing
    aspectRatio: 1, // Maintain square aspect ratio
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageTitle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 5,
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#777',
    fontStyle: 'italic',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
});

export default GalleryScreen;
