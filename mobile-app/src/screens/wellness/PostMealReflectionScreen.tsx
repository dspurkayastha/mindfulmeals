import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import PostMealReflection from '../../components/mindfulness/PostMealReflection';
import { useWellnessService } from '../../hooks/useWellnessData';
import { showToast } from '../../utils/toast';

const PostMealReflectionScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { saveMoodEntry, saveGratitudeEntry, incrementMindfulMeals } = useWellnessService();
  
  const { mealId, mealData } = route.params || {};
  const mealName = mealData?.mealName || 'your meal';

  const handleComplete = async (reflection: any) => {
    try {
      // Save mood entry if provided
      if (reflection.mood) {
        const moodNote = reflection.moodNote || `Energy: ${reflection.energyLevel}/5, Satisfaction: ${reflection.satisfaction}/10`;
        await saveMoodEntry(reflection.mood, moodNote, mealId);
      }
      
      // Save gratitude entry if provided
      if (reflection.gratitudeText) {
        await saveGratitudeEntry(reflection.gratitudeText, mealId);
      }
      
      // Increment mindful meals counter
      await incrementMindfulMeals();
      
      // Show success message
      showToast({
        type: 'success',
        text1: 'Reflection Saved',
        text2: 'Thank you for being mindful! 🙏',
      });
      
      // Navigate back or to home
      navigation.goBack();
    } catch (error) {
      console.error('Error saving reflection:', error);
      showToast({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save reflection. Please try again.',
      });
    }
  };

  const handleSkip = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <PostMealReflection
        mealId={mealId || 'default'}
        mealName={mealName}
        onComplete={handleComplete}
        onSkip={handleSkip}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PostMealReflectionScreen;