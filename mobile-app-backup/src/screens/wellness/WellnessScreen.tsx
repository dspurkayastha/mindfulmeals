import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, RefreshControl } from 'react-native';
import { Card, Text, useTheme, IconButton, ProgressBar, Chip, Button } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import SunsetHeader from '../../components/common/SunsetHeader';
import { useWellnessData } from '../../hooks/useWellnessData';
import { MindfulLoader } from '../../components/mindfulness';
import ScreenErrorBoundary from '../../components/ScreenErrorBoundary';

const WellnessScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { 
    wellnessData, 
    weeklyStats, 
    todayGratitude, 
    isLoading, 
    refreshData 
  } = useWellnessData();

  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  }, [refreshData]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refreshData();
    }, [refreshData])
  );

  const getMoodEmoji = (mood: string) => {
    const moodMap = {
      stressed: '😰',
      grateful: '🙏',
      energized: '⚡',
      calm: '😌',
      neutral: '😐',
    };
    return moodMap[mood as keyof typeof moodMap] || '😊';
  };

  if (isLoading && !wellnessData.mindfulMealsCount) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <MindfulLoader duration="short" message={t('wellness.loading')} />
      </SafeAreaView>
    );
  }

  return (
    <ScreenErrorBoundary screenName="Wellness" onRetry={refreshData}>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <SunsetHeader 
          title={t('wellness.title', 'Wellness')} 
          subtitle={t('wellness.subtitle', 'Your mindful journey')} 
        />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
          />
        }
      >
        {/* Weekly Stats Card */}
        <Card style={[styles.card, { backgroundColor: colors.primaryContainer }]}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Text variant="titleMedium">{t('wellness.weeklyProgress', 'Weekly Progress')}</Text>
              <IconButton 
                icon="calendar-week" 
                size={20}
                onPress={() => navigation.navigate('WeeklyReport')}
              />
            </View>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text variant="headlineMedium" style={{ color: colors.primary }}>
                  {weeklyStats.breathingMinutes}
                </Text>
                <Text variant="bodySmall">{t('wellness.mindfulMinutes', 'Mindful Minutes')}</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text variant="headlineMedium" style={{ color: colors.primary }}>
                  {weeklyStats.gratitudeCount}
                </Text>
                <Text variant="bodySmall">{t('wellness.gratitudeEntries', 'Gratitude Entries')}</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text variant="headlineMedium" style={{ color: colors.primary }}>
                  {wellnessData.currentStreak}
                </Text>
                <Text variant="bodySmall">{t('wellness.dayStreak', 'Day Streak')}</Text>
              </View>
            </View>

            <View style={styles.progressSection}>
              <Text variant="bodyMedium">{t('wellness.mindfulMeals', 'Mindful Meals')}</Text>
              <ProgressBar 
                progress={Math.min(wellnessData.mindfulMealsCount / 21, 1)} 
                color={colors.primary}
                style={styles.progressBar}
              />
              <Text variant="bodySmall" style={{ opacity: 0.7 }}>
                {wellnessData.mindfulMealsCount} / 21 {t('wellness.thisWeek', 'this week')}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Current Mood Card */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Text variant="titleMedium">{t('wellness.currentMood', 'Current Mood')}</Text>
              {weeklyStats.mostFrequentMood && (
                <Chip icon={() => <Text style={{ fontSize: 20 }}>{getMoodEmoji(weeklyStats.mostFrequentMood)}</Text>}>
                  {t(`wellness.mood.${weeklyStats.mostFrequentMood}`, weeklyStats.mostFrequentMood)}
                </Chip>
              )}
            </View>
            
            <Text variant="bodyMedium" style={{ marginTop: 8, opacity: 0.7 }}>
              {weeklyStats.moodCount > 0 
                ? t('wellness.moodTracked', `You've tracked your mood ${weeklyStats.moodCount} times this week`)
                : t('wellness.noMoodTracked', 'Start tracking your mood to see patterns')}
            </Text>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={{ marginBottom: 16 }}>
              {t('wellness.quickActions', 'Quick Actions')}
            </Text>
            
            <View style={styles.actionButtons}>
              <Button
                mode="contained"
                icon="meditation"
                onPress={() => navigation.navigate('BreathingExercise', { context: 'manual' })}
                style={styles.actionButton}
              >
                {t('wellness.breathingExercise', 'Breathing Exercise')}
              </Button>
              
              <Button
                mode="outlined"
                icon="notebook"
                onPress={() => navigation.navigate('GratitudeJournal')}
                style={styles.actionButton}
              >
                {t('wellness.gratitudeJournal', 'Gratitude Journal')}
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Today's Gratitude */}
        {todayGratitude.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text variant="titleMedium">{t('wellness.todayGratitude', "Today's Gratitude")}</Text>
                <IconButton 
                  icon="plus" 
                  size={20}
                  onPress={() => navigation.navigate('GratitudeJournal')}
                />
              </View>
              
              {todayGratitude.map((entry, index) => (
                <View key={entry.id} style={styles.gratitudeItem}>
                  <Text>• {entry.content}</Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
    </ScreenErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: { 
    padding: 16, 
    gap: 12,
    paddingBottom: 32,
  },
  card: { 
    borderRadius: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  progressSection: {
    marginTop: 16,
    gap: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    borderRadius: 24,
  },
  gratitudeItem: {
    paddingVertical: 4,
  },
});

export default WellnessScreen;