import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useTheme, Title, Paragraph, Chip } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { CookingBreathingTimer, GratitudeOverlay } from '../../components/mindfulness';
import NotificationService from '../../services/NotificationService';
import { showToast } from '../../utils/toast';

const CookingScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const [showGratitude, setShowGratitude] = useState(false);
  const [currentMealId, setCurrentMealId] = useState<string | null>(null);
  
  const { recipe } = route.params || {};
  const cookingTime = recipe?.cookTime || 30; // Default 30 minutes
  const recipeName = recipe?.name || 'Your Meal';

  const handleTimerComplete = async () => {
    const mealId = recipe?.id || `meal_${Date.now()}`;
    const mealData = {
      mealId: mealId,
      mealName: recipeName,
      mealTime: new Date(),
      recipeId: recipe?.id,
    };
    
    try {
      // Save meal data first (this would normally go to a meal service)
      // For now, we'll just set the meal ID
      setCurrentMealId(mealId);
      
      // Show gratitude overlay
      setShowGratitude(true);
    } catch (error) {
      console.error('Error completing cooking:', error);
      showToast({
        message: 'Error saving meal data',
        preset: 'error',
      });
    }
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
      
      <GratitudeOverlay
        visible={showGratitude}
        onClose={async () => {
          setShowGratitude(false);
          
          // Schedule post-meal reflection notification
          if (currentMealId) {
            await NotificationService.getInstance().schedulePostMealReflection(
              currentMealId,
              30 // 30 minutes later
            );
          }
          
          // Navigate to post-meal reflection after closing
          navigation.navigate('PostMealReflection', { 
            mealId: currentMealId!,
            fromScreen: 'Cooking'
          });
        }}
        itemName={recipeName}
        itemId={currentMealId || ''}
        itemType="meal"
      />
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