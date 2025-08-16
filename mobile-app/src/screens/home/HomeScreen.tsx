import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Namaste! 🙏</Text>
          <Text style={styles.subtitleText}>Welcome to Swasthya Food</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Meal Planning')}
            >
              <Icon name="restaurant-menu" size={32} color="#4CAF50" />
              <Text style={styles.actionText}>Plan Meals</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Pantry')}
            >
              <Icon name="kitchen" size={32} color="#FF9800" />
              <Text style={styles.actionText}>Check Pantry</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Shopping')}
            >
              <Icon name="shopping-cart" size={32} color="#2196F3" />
              <Text style={styles.actionText}>Shop</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Community')}
            >
              <Icon name="people" size={32} color="#9C27B0" />
              <Text style={styles.actionText}>Community</Text>
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
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
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
    backgroundColor: 'white',
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
