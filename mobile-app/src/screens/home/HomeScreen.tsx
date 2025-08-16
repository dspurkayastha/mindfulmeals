import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Card, Title, Paragraph, Button, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SunsetHeader from '../../components/common/SunsetHeader';

const HomeScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <SunsetHeader title="Namaste! 🙏" subtitle="Welcome to Swasthya Food" />

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: colors.surface }]}
              onPress={() => navigation.navigate('Meal Planning')}
            >
              <Icon name="restaurant-menu" size={32} color="#4CAF50" />
              <Text style={styles.actionText}>Plan Meals</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: colors.surface }]}
              onPress={() => navigation.navigate('Pantry')}
            >
              <Icon name="kitchen" size={32} color="#FF9800" />
              <Text style={styles.actionText}>Check Pantry</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: colors.surface }]}
              onPress={() => navigation.navigate('Recipes')}
            >
              <Icon name="book" size={32} color="#8D6E63" />
              <Text style={styles.actionText}>Recipes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: colors.surface }]}
              onPress={() => navigation.navigate('CalorieScanner')}
            >
              <Icon name="camera-alt" size={32} color="#795548" />
              <Text style={styles.actionText}>Calorie Scan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: colors.surface }]}
              onPress={() => navigation.navigate('Wellness')}
            >
              <Icon name="self-improvement" size={32} color="#9CCC65" />
              <Text style={styles.actionText}>Wellness</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: colors.surface }]}
              onPress={() => navigation.navigate('QuickCommerce')}
            >
              <Icon name="shopping-bag" size={32} color="#FF7043" />
              <Text style={styles.actionText}>Quick Commerce</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Plan */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Today's Meal Plan</Title>
            <Paragraph>You have 3 meals planned for today</Paragraph>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Meal Planning')}
              style={styles.button}
            >
              View Plan
            </Button>
          </Card.Content>
        </Card>

        {/* Health Tips */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Health Tip of the Day</Title>
            <Paragraph>
              Include seasonal vegetables in your meals for better nutrition and cost-effectiveness.
            </Paragraph>
          </Card.Content>
        </Card>
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
  quickActions: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  card: {
    margin: 20,
    marginTop: 0,
    elevation: 2,
  },
  button: {
    marginTop: 12,
    backgroundColor: '#4CAF50',
  },
});

export default HomeScreen;
