// mobile-app/src/screens/meal-planning/WeeklyPlanner.tsx
import React, { useState, useEffect } from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { useTranslation } from '../../hooks/useTranslation';
import { MealCard, NutritionWidget, LoadingSpinner } from '../../components';
import { useGenerateWeeklyPlan, useOptimizeWithInventory } from '../../hooks/api/useMealPlan';
import { usePantryItems } from '../../hooks/api/useInventory';

export const WeeklyPlannerScreen: React.FC<ScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [showNutrition, setShowNutrition] = useState(false);
  
  const { data: mealPlan, isLoading, refetch } = useGenerateWeeklyPlan({
    weekStarting: selectedWeek,
    dietaryGoals: ['balanced_nutrition'], // From user preferences
    festivalConsiderations: [], // Auto-detected based on calendar
  });

  const { data: pantryItems } = usePantryItems();
  const { mutate: optimizeWithInventory } = useOptimizeWithInventory();

  const handleOptimizeWithPantry = () => {
    if (mealPlan && pantryItems) {
      optimizeWithInventory({
        mealPlanId: mealPlan.id,
        availableIngredients: pantryItems,
      });
    }
  };

  const renderDayMeals = ({ item: day }) => (
    <View style={styles.dayContainer}>
      <Text variant="subheading" style={styles.dayHeader}>
        {t(`days.${day.dayOfWeek}`)} - {formatDate(day.date)}
      </Text>
      
      {/* Festival/Special Day Indicator */}
      {day.specialOccasion && (
        <View style={styles.specialOccasionBanner}>
          <Icon name="star" color="#FFD700" size={16} />
          <Text variant="caption" style={styles.specialOccasionText}>
            {t(`festivals.${day.specialOccasion}`)}
          </Text>
        </View>
      )}

      <View style={styles.mealsRow}>
        {['breakfast', 'lunch', 'dinner'].map((mealType) => {
          const meal = day.meals.find(m => m.mealType === mealType);
          return (
            <MealCard
              key={mealType}
              meal={meal}
              mealType={mealType}
              onPress={() => navigation.navigate('RecipeDetails', { recipeId: meal?.recipe.id })}
              onReplace={() => handleReplaceMeal(meal?.id, mealType)}
              style={styles.mealCard}
            />
          );
        })}
      </View>

      {/* Daily Nutrition Summary */}
      <NutritionWidget
        nutrition={day.nutritionalSummary}
        compact={true}
        showProgress={true}
      />
    </View>
  );

  if (isLoading) {
    return <LoadingSpinner message={t('mealPlan.generating')} />;
  }

  return (
    <View style={styles.container}>
      {/* Header with Week Selector */}
      <View style={styles.header}>
        <Button
          variant="ghost"
          icon="chevron-left"
          onPress={() => setSelectedWeek(subWeeks(selectedWeek, 1))}
        />
        <Text variant="heading">{formatWeekRange(selectedWeek)}</Text>
        <Button
          variant="ghost"
          icon="chevron-right"
          onPress={() => setSelectedWeek(addWeeks(selectedWeek, 1))}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionBar}>
        <Button
          title={t('mealPlan.optimizeWithPantry')}
          icon="package"
          variant="secondary"
          onPress={handleOptimizeWithPantry}
          style={styles.actionButton}
        />
        <Button
          title={t('mealPlan.regenerate')}
          icon="refresh"
          variant="outline"
          onPress={() => refetch()}
          style={styles.actionButton}
        />
        <Button
          title={t('mealPlan.share')}
          icon="share"
          variant="outline"
          onPress={() => handleShareToWhatsApp()}
          style={styles.actionButton}
        />
      </View>

      {/* Weekly Overview */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weekOverview}>
        {mealPlan?.weeklyStats && (
          <View style={styles.statsContainer}>
            <StatCard
              title={t('mealPlan.totalCost')}
              value={`₹${mealPlan.estimatedCost}`}
              icon="rupee"
            />
            <StatCard
              title={t('mealPlan.avgCalories')}
              value={`${mealPlan.weeklyStats.avgDailyCalories}`}
              icon="activity"
            />
            <StatCard
              title={t('mealPlan.dishVariety')}
              value={`${mealPlan.weeklyStats.uniqueRecipes}`}
              icon="grid"
            />
          </View>
        )}
      </ScrollView>

      {/* Daily Meal Plan */}
      <FlatList
        data={mealPlan?.dailyPlans || []}
        renderItem={renderDayMeals}
        keyExtractor={(item) => item.date.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mealsList}
      />

      {/* Floating Nutrition Toggle */}
      <Button
        icon={showNutrition ? "eye-off" : "pie-chart"}
        variant="floating"
        onPress={() => setShowNutrition(!showNutrition)}
        style={styles.floatingButton}
      />

      {/* Nutrition Details Modal */}
      {showNutrition && (
        <NutritionDetailsModal
          weeklyNutrition={mealPlan?.nutritionalSummary}
          onClose={() => setShowNutrition(false)}
        />
      )}
    </View>
  );
};