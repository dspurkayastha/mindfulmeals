import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useTheme, Title, Paragraph, Chip } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { CookingBreathingTimer } from '../../components/mindfulness';
import NotificationService from '../../services/NotificationService';

const CookingScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  
  const { recipe } = route.params || {};
  const cookingTime = recipe?.cookTime || 30; // Default 30 minutes
  const recipeName = recipe?.name || 'Your Meal';

  const handleTimerComplete = () => {
    const mealData = {
      mealId: recipe?.id || 'default',
      mealName: recipeName,
      mealTime: new Date(),
    };
    
    // Schedule post-meal reflection notification for 30 minutes later
    NotificationService.getInstance().schedulePostMealReflection(mealData.mealId, 30);

    // Navigate directly to post-meal reflection
    navigation.navigate('PostMealReflection', {
      mealId: mealData.mealId,
      mealData: mealData,
    });
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {recipe && (
          <View style={styles.recipeInfo}>
            <Title style={styles.title}>{recipe.name}</Title>
            {recipe.description && (
              <Paragraph style={styles.description}>{recipe.description}</Paragraph>
            )}
            <View style={styles.tags}>
              <Chip icon="clock-outline" style={styles.chip}>
                {cookingTime} min
              </Chip>
              {recipe.difficulty && (
                <Chip icon="chef-hat" style={styles.chip}>
                  {recipe.difficulty}
                </Chip>
              )}
            </View>
          </View>
        )}

        <CookingBreathingTimer
          cookingTime={cookingTime}
          recipeName={recipeName}
          onComplete={handleTimerComplete}
          onCancel={handleCancel}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  recipeInfo: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    borderRadius: 16,
  },
});

export default CookingScreen;