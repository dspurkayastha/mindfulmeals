import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Modal } from 'react-native';
import { Card, Text, useTheme, IconButton, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import SunsetHeader from '../../components/common/SunsetHeader';
import MindfulButton from '../../components/common/MindfulButton';
import MindfulEatingTimer from '../../components/mindfulness/MindfulEatingTimer';
import { colors as palette } from '../../utils/theme';
import WellnessService from '../../services/WellnessService';
import { showToast } from '../../utils/toast';
import { hapticFeedback } from '../../utils/haptic';
import ScreenErrorBoundary from '../../components/ScreenErrorBoundary';

const RecipeDetailsScreen: React.FC<ScreenProps> = ({ route }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { id } = route?.params || {};
  const [showEatingTimer, setShowEatingTimer] = useState(false);
  const [mealStartTime, setMealStartTime] = useState<Date | null>(null);

  // Mock recipe data - in real app, this would come from API/props
  const recipe = {
    id: id || '1',
    name: 'Palak Paneer',
    mindfulEatingDuration: 20, // minutes
    calories: 320,
    difficulty: 'Medium',
  };

  const handleStartEating = () => {
    setMealStartTime(new Date());
    setShowEatingTimer(true);
    hapticFeedback.impact('medium');
  };

  const handleTimerMilestone = (milestone: number) => {
    hapticFeedback.impact('light');
    
    if (milestone === 50) {
      showToast({
        message: "Halfway through! How's the meal tasting?",
        preset: 'done',
      });
    }
  };

  const handleTimerComplete = async (duration: number) => {
    hapticFeedback.success();
    
    try {
      // Track mindful eating session
      await WellnessService.getInstance().trackMindfulEating?.({
        recipeId: recipe.id,
        duration,
        startTime: mealStartTime!,
        endTime: new Date(),
        completed: true
      });
      
      // Navigate to post-meal reflection
      navigation.navigate('PostMealReflection', {
        mealId: recipe.id,
        eatingDuration: duration,
        wasMindful: true
      });
    } catch (error) {
      console.error('Error tracking mindful eating:', error);
    }
  };

  const handleTimerSkip = async () => {
    if (mealStartTime) {
      const duration = Date.now() - mealStartTime.getTime();
      try {
        await WellnessService.getInstance().trackMindfulEating?.({
          recipeId: recipe.id,
          duration: duration / 1000,
          startTime: mealStartTime,
          endTime: new Date(),
          completed: false,
          skipped: true
        });
      } catch (error) {
        console.error('Error tracking partial session:', error);
      }
    }
    
    setShowEatingTimer(false);
  };

  return (
    <ScreenErrorBoundary screenName="Recipe Details">
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <SunsetHeader title="Recipe Details" subtitle={recipe.name} />
      <ScrollView style={styles.content}>
        <Card style={[styles.card, { backgroundColor: colors.surface }]}>
          <Card.Content>
            <Text variant="titleLarge" style={{ color: palette.textPrimary }}>{recipe.name}</Text>
            <View style={styles.chipRow}>
              <Chip icon="clock-outline" style={styles.chip}>
                {recipe.mindfulEatingDuration} min
              </Chip>
              <Chip icon="fire" style={styles.chip}>
                {recipe.calories} cal
              </Chip>
              <Chip icon="chef-hat" style={styles.chip}>
                {recipe.difficulty}
              </Chip>
            </View>
            <Text style={styles.section}>Ingredients</Text>
            <Text>- Spinach, Paneer, Onion, Tomato, Spices</Text>
            <Text style={styles.section}>Instructions</Text>
            <Text>1. Blanch spinach. 2. Saute aromatics. 3. Combine with paneer and simmer.</Text>
          </Card.Content>
        </Card>
        
        <Card style={[styles.mindfulCard, { backgroundColor: colors.primary + '15' }]}>
          <Card.Content>
            <View style={styles.mindfulHeader}>
              <IconButton icon="meditation" size={24} iconColor={colors.primary} />
              <Text variant="titleMedium" style={{ color: colors.primary, flex: 1 }}>
                Mindful Eating
              </Text>
            </View>
            <Text style={styles.mindfulText}>
              Take time to savor each bite and appreciate the nourishment this meal provides.
            </Text>
            <MindfulButton 
              title="Start Mindful Eating" 
              onPress={handleStartEating}
              icon="restaurant"
            />
          </Card.Content>
        </Card>
        
        <View style={styles.actions}>
          <MindfulButton title="Add to Plan" onPress={() => {}} />
          <MindfulButton title="Share" variant="secondary" onPress={() => {}} />
        </View>
      </ScrollView>
      
      <Modal
        visible={showEatingTimer}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleTimerSkip}
      >
        {showEatingTimer && (
          <MindfulEatingTimer
            mealName={recipe.name}
            mealId={recipe.id}
            intention={{
              desiredFeeling: 'satisfied',
              mindfulEating: true,
              portionAwareness: true,
            }}
            onComplete={(data) => {
              setShowEatingTimer(false);
              handleTimerComplete(data.totalDuration || 1200); // Default 20 minutes
            }}
            onCancel={handleTimerSkip}
          />
        )}
      </Modal>
    </SafeAreaView>
    </ScreenErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  card: { borderRadius: 16, marginBottom: 16 },
  chipRow: { flexDirection: 'row', gap: 8, marginTop: 8, marginBottom: 16 },
  chip: { borderRadius: 16 },
  meta: { opacity: 0.7, marginBottom: 12, color: palette.textSecondary },
  section: { marginTop: 12, fontWeight: '600', color: palette.textPrimary },
  actions: { marginTop: 8, gap: 12, marginBottom: 20 },
  mindfulCard: { 
    borderRadius: 16, 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  mindfulHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mindfulText: {
    color: palette.textSecondary,
    marginBottom: 16,
    lineHeight: 22,
  },
});

export default RecipeDetailsScreen;