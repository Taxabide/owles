import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Category, fetchCategoriesAsync } from '../../../redux/slices/categorySlice';
import { AppDispatch, RootState } from '../../../redux/store';

const { width } = Dimensions.get('window');

interface CourseBoardMapped {
  id: number;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgColor: string;
}

const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
  "Academic Subjects (Core)": "book",
  "Humanities & Social Sciences": "people",
  "Languages": "globe",
  "Commerce & Professional Studies": "briefcase",
  "Arts & Creative Subjects": "color-palette",
  "Applied & Vocational Subjects": "build",
  "CBSE/ICSE/State Boards": "school",
  "IB (International Baccalaureate)": "globe",
  "UK Boards (GCSE/A-Level)": "flag",
  "American Curriculum": "star",
  // Add more mappings as needed
};

const colorMap: { [key: string]: { color: string; bgColor: string } } = {
  "Academic Subjects (Core)": { color: '#4F46E5', bgColor: '#EEF2FF' },
  "Humanities & Social Sciences": { color: '#059669', bgColor: '#ECFDF5' },
  "Languages": { color: '#DC2626', bgColor: '#FEF2F2' },
  "Commerce & Professional Studies": { color: '#7C2D12', bgColor: '#FEF7ED' },
  "Arts & Creative Subjects": { color: '#BE185D', bgColor: '#FDF2F8' },
  "Applied & Vocational Subjects": { color: '#1D4ED8', bgColor: '#EFF6FF' },
  "CBSE/ICSE/State Boards": { color: '#9333EA', bgColor: '#FAF5FF' },
  "IB (International Baccalaureate)": { color: '#0891B2', bgColor: '#F0F9FF' },
  "UK Boards (GCSE/A-Level)": { color: '#EA580C', bgColor: '#FFF7ED' },
  "American Curriculum": { color: '#CA8A04', bgColor: '#FFFBEB' },
  // Default colors
  "default": { color: '#4B5563', bgColor: '#F3F4F6' },
};

const CourseBoardsSection = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, isLoading, error } = useSelector((state: RootState) => state.categories);
  const [hoveredBoard, setHoveredBoard] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchCategoriesAsync());
  }, [dispatch]);

  const handleCategoryPress = (categoryId: number) => {
    router.push({ pathname: "/category/[id]", params: { id: categoryId.toString() } });
  };

  const renderCourseBoardCard = (category: Category) => {
    const mappedBoard: CourseBoardMapped = {
      id: category.c_id,
      title: category.c_name,
      icon: iconMap[category.c_name] || "help-circle-outline", // Default icon if not found
      color: colorMap[category.c_name]?.color || colorMap.default.color,
      bgColor: colorMap[category.c_name]?.bgColor || colorMap.default.bgColor,
    };

    return (
      <TouchableOpacity
        key={mappedBoard.id}
        style={[
          styles.courseBoardCard,
          hoveredBoard === mappedBoard.id ? styles.courseBoardCardHovered : styles.courseBoardCardNormal,
        ]}
        onPress={() => handleCategoryPress(mappedBoard.id)}
        onPressIn={() => setHoveredBoard(mappedBoard.id)}
        onPressOut={() => setHoveredBoard(null)}
        activeOpacity={1}
      >
        <View style={[
          styles.iconWrapper,
          { backgroundColor: hoveredBoard === mappedBoard.id ? mappedBoard.bgColor : '#F3F4F6' },
        ]}>
          <Ionicons
            name={mappedBoard.icon}
            size={28}
            color={hoveredBoard === mappedBoard.id ? mappedBoard.color : '#4B5563'}
          />
        </View>
        <Text style={[
          styles.cardTitle,
          hoveredBoard === mappedBoard.id ? styles.cardTitleHovered : styles.cardTitleNormal,
        ]}>
          {mappedBoard.title}
        </Text>
        {/* <Text style={styles.cardId}>ID: {mappedBoard.id}</Text> */}
        {hoveredBoard === mappedBoard.id && (
          <View style={[styles.hoverIndicator, { backgroundColor: mappedBoard.color }]}>
            <Ionicons name="chevron-forward" size={12} color="white" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.mainTitle}>
          Explore{' '}
          <Text style={styles.highlightText}>
            4000+ Free Online
          </Text>
          {' '}
          Courses For Students
        </Text>
        
        <Text style={styles.description}>
          Welcome to our diverse and dynamic course catalog. We's dedicated to providing you with access to high-quality education that transforms learning into an extraordinary journey.
        </Text>

        <TouchableOpacity style={styles.button}>
          <LinearGradient
            colors={['#2196F3', '#1976D2']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>See All Courses</Text>
            <Ionicons name="chevron-forward" size={20} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.boardsGridContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#2196F3" />
        ) : error ? (
          <Text style={styles.errorText}>Error: {error}</Text>
        ) : (
          <View style={styles.boardsGrid}>
            {categories.map(renderCourseBoardCard)}
          </View>
        )}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    paddingVertical: 40,
  },
  headerSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  mainTitle: {
    fontSize: width > 768 ? 48 : 34,
    fontWeight: '900',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: width > 768 ? 56 : 40,
  },
  highlightText: {
    color: '#FF6B35',
  },
  description: {
    fontSize: 18,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 28,
    maxWidth: 750,
    marginBottom: 30,
  },
  button: {
    borderRadius: 9999,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  boardsGridContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  boardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
  },
  courseBoardCard: {
    width: (width - 40 - 30) / (width > 768 ? 5 : 2), // Adjust for responsiveness
    borderRadius: 20,
    position: 'relative',
    justifyContent: 'flex-start', // Changed to flex-start to allow text to flow from top
    alignItems: 'flex-start',
    padding: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  courseBoardCardNormal: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderWidth: 1,
  },
  courseBoardCardHovered: {
    backgroundColor: '#FFFFFF',
    borderColor: '#4F46E5',
    borderWidth: 1,
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  cardTitleNormal: {
    color: '#4A5568',
  },
  cardTitleHovered: {
    color: '#1A202C',
  },
  cardId: {
    fontSize: 12,
    color: '#718096',
    marginTop: 5,
  },
  hoverIndicator: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollToTopButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 9999,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  scrollToTopButtonGradient: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#DC2626',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default CourseBoardsSection;