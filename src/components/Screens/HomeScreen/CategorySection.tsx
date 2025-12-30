import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width > 768 ? 380 : 320;
const CARD_MARGIN = 20;

interface Category {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  backgroundColor: string;
  iconBackgroundColor: string;
}

const categories: Category[] = [
  {
    id: '1',
    title: 'Language Learning',
    description: 'Master new languages with interactive courses in English, Spanish, French, Mandarin, and more',
    icon: 'language-outline',
    color: '#2196F3',
    backgroundColor: 'rgba(33, 150, 243, 0.05)',
    iconBackgroundColor: 'rgba(33, 150, 243, 0.1)',
  },
  {
    id: '2',
    title: 'Creative Arts & Design',
    description: 'Unleash your creativity with courses in graphic design, digital art, photography, and video editing',
    icon: 'brush-outline',
    color: '#E91E63',
    backgroundColor: 'rgba(233, 30, 99, 0.05)',
    iconBackgroundColor: 'rgba(233, 30, 99, 0.1)',
  },
  {
    id: '3',
    title: 'Health & Fitness',
    description: 'Transform your wellbeing with nutrition, fitness training, yoga, meditation, and wellness coaching',
    icon: 'heart-outline',
    color: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
    iconBackgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  {
    id: '4',
    title: 'Programming & Development',
    description: 'Build the future with web development, mobile apps, software engineering, and data science courses',
    icon: 'code-slash-outline',
    color: '#9C27B0',
    backgroundColor: 'rgba(156, 39, 176, 0.05)',
    iconBackgroundColor: 'rgba(156, 39, 176, 0.1)',
  },
  {
    id: '5',
    title: 'Business & Finance',
    description: 'Accelerate your career with entrepreneurship, marketing, finance, and project management expertise',
    icon: 'business-outline',
    color: '#FF9800',
    backgroundColor: 'rgba(255, 152, 0, 0.05)',
    iconBackgroundColor: 'rgba(255, 152, 0, 0.1)',
  },
  {
    id: '6',
    title: 'Science & Technology',
    description: 'Discover the world through mathematics, physics, chemistry, engineering, and research methods',
    icon: 'school-outline',
    color: '#00BCD4',
    backgroundColor: 'rgba(0, 188, 212, 0.05)',
    iconBackgroundColor: 'rgba(0, 188, 212, 0.1)',
  },
];

const CategorySection: React.FC = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollX] = useState(new Animated.Value(0));

  const maxIndex = categories.length - (width > 768 ? 2 : 1);

  const scrollToNext = () => {
    if (currentIndex < maxIndex) {
      const nextIndex = currentIndex + 1;
      const scrollPosition = nextIndex * (CARD_WIDTH + CARD_MARGIN);
      scrollViewRef.current?.scrollTo({ x: scrollPosition, animated: true });
      setCurrentIndex(nextIndex);
    }
  };

  const scrollToPrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      const scrollPosition = prevIndex * (CARD_WIDTH + CARD_MARGIN);
      scrollViewRef.current?.scrollTo({ x: scrollPosition, animated: true });
      setCurrentIndex(prevIndex);
    }
  };

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (CARD_WIDTH + CARD_MARGIN));
    setCurrentIndex(index);
  };

  const renderCard = (category: Category, index: number) => (
    <Animated.View key={category.id} style={[styles.card, { backgroundColor: category.backgroundColor }]}>
      <View style={styles.cardContent}>
        <View style={[styles.iconContainer, { backgroundColor: category.iconBackgroundColor }]}>
          <Ionicons name={category.icon} size={36} color={category.color} />
        </View>
        <Text style={styles.cardTitle}>{category.title}</Text>
        <Text style={styles.cardDescription}>{category.description}</Text>
        <TouchableOpacity style={[styles.viewCategoryButton, { borderColor: category.color }]}>
          <Text style={[styles.viewCategoryButtonText, { color: category.color }]}>
            Explore Courses
          </Text>
          <Ionicons name="arrow-forward" size={18} color={category.color} />
        </TouchableOpacity>
      </View>
      <View style={[styles.cardAccent, { backgroundColor: category.color }]} />
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.mainTitle}>
          Explore <Text style={styles.highlight}>4,000+ Free Online</Text> Courses
        </Text>
        <Text style={styles.subtitle}>For Students</Text>
        <Text style={styles.description}>
          Welcome to our diverse and dynamic course catalog. We're dedicated to providing you with access to 
          high-quality education that transforms lives and opens new opportunities.
        </Text>
      </View>

      {/* Cards Container */}
      <View style={styles.cardsWrapper}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.cardsContainer}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsContentContainer}
          decelerationRate="fast"
          snapToInterval={CARD_WIDTH + CARD_MARGIN}
          snapToAlignment="start"
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {categories.map((category, index) => renderCard(category, index))}
        </ScrollView>

        {/* Navigation Arrows */}
        <TouchableOpacity
          style={[styles.navButton, styles.navButtonLeft, currentIndex === 0 && styles.navButtonDisabled]}
          onPress={scrollToPrevious}
          disabled={currentIndex === 0}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={currentIndex === 0 ? '#ccc' : '#333'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, styles.navButtonRight, currentIndex >= maxIndex && styles.navButtonDisabled]}
          onPress={scrollToNext}
          disabled={currentIndex >= maxIndex}
        >
          <Ionicons
            name="chevron-forward"
            size={24}
            color={currentIndex >= maxIndex ? '#ccc' : '#333'}
          />
        </TouchableOpacity>
      </View>

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {categories.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 80,
    backgroundColor: '#FAFBFC',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 60,
  },
  mainTitle: {
    fontSize: width > 768 ? 48 : 34,
    fontWeight: '900',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
    maxWidth: 800,
    lineHeight: width > 768 ? 56 : 40,
  },
  subtitle: {
    fontSize: width > 768 ? 24 : 20,
    fontWeight: '600',
    color: '#4A5568',
    textAlign: 'center',
    marginBottom: 20,
  },
  highlight: {
    color: '#FF6B35',
  },
  description: {
    fontSize: 18,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 28,
    maxWidth: 750,
  },
  cardsWrapper: {
    position: 'relative',
    width: '100%',
    marginBottom: 40,
  },
  cardsContainer: {
    flexGrow: 0,
  },
  cardsContentContainer: {
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  card: {
    borderRadius: 20,
    marginRight: CARD_MARGIN,
    width: CARD_WIDTH,
    height: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  cardContent: {
    padding: 32,
    height: '100%',
    justifyContent: 'space-between',
  },
  cardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 4,
  },
  iconContainer: {
    borderRadius: 16,
    padding: 16,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2D3748',
    marginBottom: 12,
    lineHeight: 28,
  },
  cardDescription: {
    fontSize: 15,
    color: '#4A5568',
    lineHeight: 22,
    marginBottom: 24,
    flex: 1,
  },
  viewCategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  viewCategoryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -25 }],
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    zIndex: 10,
  },
  navButtonLeft: {
    left: 10,
  },
  navButtonRight: {
    right: 10,
  },
  navButtonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0.05,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CBD5E0',
  },
  paginationDotActive: {
    backgroundColor: '#FF6B35',
    width: 24,
    borderRadius: 4,
  },
});

export default CategorySection;