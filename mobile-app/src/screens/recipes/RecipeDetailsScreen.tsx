import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import SunsetHeader from '../../components/common/SunsetHeader';
import MindfulButton from '../../components/common/MindfulButton';
import { colors as palette } from '../../utils/theme';

const RecipeDetailsScreen: React.FC<ScreenProps> = ({ route }) => {
  const { colors } = useTheme();
  const { id } = route?.params || {};

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <SunsetHeader title="Recipe Details" subtitle={`Recipe #${id}`} />
      <View style={styles.content}>
        <Card style={[styles.card, { backgroundColor: colors.surface }]}>
          <Card.Content>
            <Text variant="titleLarge" style={{ color: palette.textPrimary }}>Palak Paneer</Text>
            <Text style={styles.meta}>North Indian • 320 cal</Text>
            <Text style={styles.section}>Ingredients</Text>
            <Text>- Spinach, Paneer, Onion, Tomato, Spices</Text>
            <Text style={styles.section}>Instructions</Text>
            <Text>1. Blanch spinach. 2. Saute aromatics. 3. Combine with paneer and simmer.</Text>
          </Card.Content>
        </Card>
        <View style={styles.actions}>
          <MindfulButton title="Add to Plan" onPress={() => {}} />
          <MindfulButton title="Share" variant="secondary" onPress={() => {}} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 12 },
  card: { borderRadius: 16 },
  meta: { opacity: 0.7, marginBottom: 12, color: palette.textSecondary },
  section: { marginTop: 12, fontWeight: '600', color: palette.textPrimary },
  actions: { marginTop: 8, gap: 12 },
});

export default RecipeDetailsScreen;