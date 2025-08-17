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
import MindfulButton from '../../components/common/MindfulButton';
import AnimatedSurface from '../../components/common/AnimatedSurface';
import { colors as palette, typography } from '../../utils/theme';

const HomeScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <SunsetHeader title="Namaste! 🙏" subtitle="Welcome to MindfulMeals" />

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <AnimatedSurface delay={0}>
              <TouchableOpacity
                style={[styles.actionCard, { backgroundColor: colors.surface }]}
                onPress={() => navigation.navigate('Meal Planning')}
              >
                <Icon name="restaurant-menu" size={32} color={palette.olive} />
                <Text style={styles.actionText}>Plan Meals</Text>
              </TouchableOpacity>
            </AnimatedSurface>

            <AnimatedSurface delay={80}>
              <TouchableOpacity
                style={[styles.actionCard, { backgroundColor: colors.surface }]}
                onPress={() => navigation.navigate('Pantry')}
              >
                <Icon name="kitchen" size={32} color={palette.goldenAmber} />
                <Text style={styles.actionText}>Check Pantry</Text>
              </TouchableOpacity>
            </AnimatedSurface>

            <AnimatedSurface delay={160}>
              <TouchableOpacity
                style={[styles.actionCard, { backgroundColor: colors.surface }]}
                onPress={() => navigation.navigate('Recipes')}
              >
                <Icon name="book" size={32} color={palette.mutedBrown} />
                <Text style={styles.actionText}>Recipes</Text>
              </TouchableOpacity>
            </AnimatedSurface>

            <AnimatedSurface delay={240}>
              <TouchableOpacity
                style={[styles.actionCard, { backgroundColor: colors.surface }]}
                onPress={() => navigation.navigate('CalorieScanner')}
              >
                <Icon name="camera-alt" size={32} color={palette.mutedBrown} />
                <Text style={styles.actionText}>Calorie Scan</Text>
              </TouchableOpacity>
            </AnimatedSurface>

            <AnimatedSurface delay={320}>
              <TouchableOpacity
                style={[styles.actionCard, { backgroundColor: colors.surface }]}
                onPress={() => navigation.navigate('Wellness')}
              >
                <Icon name="self-improvement" size={32} color={palette.sage} />
                <Text style={styles.actionText}>Wellness</Text>
              </TouchableOpacity>
            </AnimatedSurface>

            <AnimatedSurface delay={400}>
              <TouchableOpacity
                style={[styles.actionCard, { backgroundColor: colors.surface }]}
                onPress={() => navigation.navigate('QuickCommerce')}
              >
                <Icon name="shopping-bag" size={32} color={palette.deepCoral} />
                <Text style={styles.actionText}>Quick Commerce</Text>
              </TouchableOpacity>
            </AnimatedSurface>
          </View>
        </View>

        {/* Today's Plan */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Today's Meal Plan</Title>
            <Paragraph>You have 3 meals planned for today</Paragraph>
            <MindfulButton title="View Plan" onPress={() => navigation.navigate('Meal Planning')} />
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
    ...typography.h4,
    marginBottom: 16,
    color: palette.textPrimary,
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
    color: palette.textPrimary,
    textAlign: 'center',
  },
  card: {
    margin: 20,
    marginTop: 0,
    elevation: 2,
  },
});

export default HomeScreen;
