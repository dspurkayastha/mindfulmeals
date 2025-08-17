import React, { useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import PostMealReflection from '../../components/mindfulness/PostMealReflection';
import NotificationService from '../../services/NotificationService';

const PostMealReflectionScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  
  const { mealId, mealName } = route.params || {};

  useEffect(() => {
    // Initialize notification service
    NotificationService.configure();
  }, []);

  const handleComplete = (reflection: any) => {
    // Navigate back or to a success screen
    navigation.goBack();
  };

  const handleSkip = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <PostMealReflection
        mealId={mealId || 'default'}
        mealName={mealName || 'your meal'}
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