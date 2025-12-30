import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

const StatisticsSection: React.FC = () => {
  const statistics = [
    {
      id: 1,
      icon: 'people-outline',
      number: '0K',
      description: 'Successfully Trained',
      backgroundColor: '#E3F2FD',
      iconColor: '#2196F3',
    },
    {
      id: 2,
      icon: 'play-circle-outline',
      number: '3K',
      description: 'Courses Completed',
      backgroundColor: '#FFF3E0',
      iconColor: '#FF8F00',
    },
    {
      id: 3,
      icon: 'thumbs-up-outline',
      number: '1.0K',
      description: 'Satisfaction Rate',
      backgroundColor: '#E3F2FD',
      iconColor: '#2196F3',
    },
    {
      id: 4,
      icon: 'people-circle-outline',
      number: '1.3K',
      description: 'Students Community',
      backgroundColor: '#FFF3E0',
      iconColor: '#FF8F00',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.statisticsContainer}>
        {statistics.map((stat) => (
          <View key={stat.id} style={[styles.statCard, { backgroundColor: stat.backgroundColor }]}>
            <View style={styles.iconContainer}>
              <Ionicons name={stat.icon as any} size={24} color={stat.iconColor} />
            </View>
            <Text style={styles.statNumber}>{stat.number}</Text>
            <Text style={styles.statDescription}>{stat.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  statisticsContainer: {
    flexDirection: width > 768 ? 'row' : 'column',
    justifyContent: 'space-between',
    gap: 10,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  statCard: {
    flex: 1,
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    minHeight: 150,
    justifyContent: 'center',
  },
  iconContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  statDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default StatisticsSection;
