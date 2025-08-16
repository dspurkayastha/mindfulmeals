import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Card, Title, Paragraph, Button, Chip, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SunsetHeader from '../../components/common/SunsetHeader';

const MealPlanningScreen = () => {
  const { colors } = useTheme();
  const mockMeals = [
    {
      id: 1,
      name: 'Masala Dosa',
      type: 'Breakfast',
      time: '8:00 AM',
      calories: 280,
      cuisine: 'South Indian',
    },
    {
      id: 2,
      name: 'Rajma Chawal',
      type: 'Lunch',
      time: '1:00 PM',
      calories: 450,
      cuisine: 'North Indian',
    },
    {
      id: 3,
      name: 'Mixed Vegetable Curry',
      type: 'Dinner',
      time: '8:00 PM',
      calories: 320,
      cuisine: 'Gujarati',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <SunsetHeader title="Meal Planning" subtitle="Plan your healthy meals" />

        {/* Generate Plan Button */}
        <View style={styles.generateSection}>
          <Button
            mode="contained"
            icon="plus"
            style={styles.generateButton}
            onPress={() => {}}
          >
            Generate Weekly Plan
          </Button>
        </View>

        {/* Today's Meals */}
        <View style={styles.mealsSection}>
          <Text style={styles.sectionTitle}>Today's Meals</Text>
          {mockMeals.map((meal) => (
            <Card key={meal.id} style={styles.mealCard}>
              <Card.Content>
                <View style={styles.mealHeader}>
                  <View>
                    <Title style={styles.mealName}>{meal.name}</Title>
                    <Text style={styles.mealType}>{meal.type}</Text>
                  </View>
                  <Text style={styles.mealTime}>{meal.time}</Text>
                </View>
                
                <View style={styles.mealDetails}>
                  <Chip icon="restaurant" style={styles.cuisineChip}>
                    {meal.cuisine}
                  </Chip>
                  <Chip icon="local-fire-department" style={styles.calorieChip}>
                    {meal.calories} cal
                  </Chip>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surface }]}>
              <Icon name="shopping-basket" size={24} color="#4CAF50" />
              <Text style={styles.actionText}>Shopping List</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surface }]}>
              <Icon name="kitchen" size={24} color="#FF9800" />
              <Text style={styles.actionText}>Check Pantry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  generateSection: {
    padding: 20,
  },
  generateButton: {
    paddingVertical: 8,
  },
  mealsSection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  mealCard: {
    marginBottom: 16,
    elevation: 2,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  mealName: {
    fontSize: 18,
    marginBottom: 4,
  },
  mealType: {
    fontSize: 14,
    color: '#666',
  },
  mealTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  mealDetails: {
    flexDirection: 'row',
    gap: 8,
  },
  cuisineChip: {
    backgroundColor: '#E8F5E8',
  },
  calorieChip: {
    backgroundColor: '#FFF3E0',
  },
  quickActions: {
    padding: 20,
    paddingTop: 0,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    minWidth: 120,
    elevation: 2,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});

export default MealPlanningScreen;
