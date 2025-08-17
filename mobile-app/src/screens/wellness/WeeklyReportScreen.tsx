import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Title,
  Card,
  useTheme,
  Chip,
  IconButton,
  Divider,
  ProgressBar,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '../../hooks/useTranslation';
import { LinearGradient } from 'react-native-linear-gradient';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import InsightsEngine from '../../services/InsightsEngine';
import { MindfulLoader } from '../../components/mindfulness';
import ShareableGratitudeCard from '../../components/ShareableGratitudeCard';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

interface WeeklySummary {
  reflectionCount: number;
  gratitudeCount: number;
  breathingSessionCount: number;
  avgEnergyLevel: number;
  moodDistribution: { [key: string]: number };
  totalBreathingMinutes: number;
  topInsights: any[];
}

const WeeklyReportScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState<WeeklySummary | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<number>(0);

  useEffect(() => {
    loadWeeklySummary();
  }, []);

  const loadWeeklySummary = async () => {
    try {
      const data = await InsightsEngine.getWeeklySummary();
      setSummary(data);
    } catch (error) {
      console.error('Error loading weekly summary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <MindfulLoader duration="short" message={t('report.loading')} />;
  }

  if (!summary) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t('report.noData')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const weekDates = `${format(startOfWeek(new Date()), 'MMM d')} - ${format(endOfWeek(new Date()), 'MMM d')}`;

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'energized': return '⚡';
      case 'satisfied': return '😊';
      case 'heavy': return '😴';
      case 'still_hungry': return '🍽️';
      default: return '😐';
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'energized': return '#FFC107';
      case 'satisfied': return '#4CAF50';
      case 'heavy': return '#9E9E9E';
      case 'still_hungry': return '#FF5722';
      default: return '#666';
    }
  };

  const renderHeader = () => (
    <LinearGradient
      colors={['#E8F5E9', '#C8E6C9']}
      style={styles.header}
    >
      <View style={styles.headerContent}>
        <Title style={styles.title}>{t('report.weeklyReport')}</Title>
        <Text style={styles.weekDates}>{weekDates}</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{summary.reflectionCount}</Text>
            <Text style={styles.statLabel}>{t('report.reflections')}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{summary.gratitudeCount}</Text>
            <Text style={styles.statLabel}>{t('report.gratitudes')}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{summary.totalBreathingMinutes}</Text>
            <Text style={styles.statLabel}>{t('report.mindfulMinutes')}</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );

  const renderEnergyChart = () => {
    if (summary.avgEnergyLevel === 0) return null;

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>{t('report.avgEnergy')}</Text>
          <View style={styles.energyContainer}>
            <View style={styles.energyMeter}>
              <ProgressBar
                progress={summary.avgEnergyLevel / 5}
                color={summary.avgEnergyLevel >= 3.5 ? '#4CAF50' : '#FFC107'}
                style={styles.progressBar}
              />
            </View>
            <Text style={styles.energyValue}>
              {summary.avgEnergyLevel.toFixed(1)}/5
            </Text>
          </View>
          <Text style={styles.energyLabel}>
            {summary.avgEnergyLevel >= 3.5 
              ? t('report.highEnergy')
              : t('report.moderateEnergy')}
          </Text>
        </Card.Content>
      </Card>
    );
  };

  const renderMoodDistribution = () => {
    const moods = Object.entries(summary.moodDistribution);
    if (moods.length === 0) return null;

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>{t('report.moodDistribution')}</Text>
          <View style={styles.moodContainer}>
            {moods.map(([mood, count]) => (
              <View key={mood} style={styles.moodItem}>
                <Text style={styles.moodIcon}>{getMoodIcon(mood)}</Text>
                <Text style={styles.moodName}>{t(`reflection.moods.${mood}`)}</Text>
                <View
                  style={[
                    styles.moodBar,
                    {
                      backgroundColor: getMoodColor(mood),
                      width: `${(count / summary.reflectionCount) * 100}%`,
                    },
                  ]}
                />
                <Text style={styles.moodCount}>{count}</Text>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderInsights = () => {
    if (summary.topInsights.length === 0) return null;

    const insight = summary.topInsights[selectedInsight];

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>{t('report.insights')}</Text>
          
          <View style={styles.insightContainer}>
            <View style={styles.insightHeader}>
              <IconButton
                icon="lightbulb"
                size={24}
                iconColor="#FFC107"
              />
              <Text style={styles.insightTitle}>{insight.title}</Text>
            </View>
            
            <Text style={styles.insightMessage}>{insight.message}</Text>
            
            {insight.actionable && (
              <Chip
                mode="outlined"
                icon="arrow-right"
                style={styles.actionChip}
              >
                {insight.actionable}
              </Chip>
            )}
          </View>

          {summary.topInsights.length > 1 && (
            <View style={styles.insightNav}>
              {summary.topInsights.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedInsight(index)}
                  style={[
                    styles.insightDot,
                    index === selectedInsight && styles.insightDotActive,
                  ]}
                />
              ))}
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  const renderWellnessScore = () => {
    // Calculate simple wellness score
    const maxScore = 21; // 7 days * 3 activities per day
    const actualScore = summary.reflectionCount + summary.gratitudeCount + summary.breathingSessionCount;
    const scorePercentage = Math.min((actualScore / maxScore) * 100, 100);

    return (
      <Card style={[styles.card, styles.scoreCard]}>
        <LinearGradient
          colors={['#4CAF50', '#81C784']}
          style={styles.scoreGradient}
        >
          <View style={styles.scoreContent}>
            <Text style={styles.scoreTitle}>{t('report.wellnessScore')}</Text>
            <Text style={styles.scoreValue}>{Math.round(scorePercentage)}%</Text>
            <Text style={styles.scoreMessage}>
              {scorePercentage >= 70 
                ? t('report.excellentWeek')
                : scorePercentage >= 40
                ? t('report.goodWeek')
                : t('report.keepGoing')}
            </Text>
          </View>
          
          <LottieView
            source={require('../../assets/animations/wellness-score.json')}
            autoPlay
            loop
            style={styles.scoreAnimation}
          />
        </LinearGradient>
      </Card>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderHeader()}
        
        <View style={styles.content}>
          {renderWellnessScore()}
          {renderEnergyChart()}
          {renderMoodDistribution()}
          {renderInsights()}
          
          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => {
              // Share weekly report
            }}
          >
            <IconButton icon="share-variant" size={24} />
            <Text style={styles.shareText}>{t('report.share')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  weekDates: {
    fontSize: 16,
    color: '#388E3C',
    marginTop: 4,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  statLabel: {
    fontSize: 14,
    color: '#388E3C',
    marginTop: 4,
  },
  content: {
    padding: 20,
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
  },
  scoreCard: {
    overflow: 'hidden',
  },
  scoreGradient: {
    padding: 24,
    position: 'relative',
  },
  scoreContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  scoreTitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  scoreMessage: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
  },
  scoreAnimation: {
    position: 'absolute',
    width: 200,
    height: 200,
    right: -50,
    bottom: -50,
    opacity: 0.2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  energyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  energyMeter: {
    flex: 1,
    marginRight: 16,
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
  },
  energyValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  energyLabel: {
    fontSize: 14,
    color: '#666',
  },
  moodContainer: {
    gap: 12,
  },
  moodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  moodIcon: {
    fontSize: 24,
    width: 32,
  },
  moodName: {
    fontSize: 14,
    width: 80,
  },
  moodBar: {
    height: 20,
    borderRadius: 10,
    minWidth: 20,
  },
  moodCount: {
    fontSize: 14,
    marginLeft: 8,
  },
  insightContainer: {
    backgroundColor: '#FFF9C4',
    padding: 16,
    borderRadius: 12,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  insightMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  actionChip: {
    alignSelf: 'flex-start',
  },
  insightNav: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  insightDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
  },
  insightDotActive: {
    backgroundColor: '#FFC107',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
  },
  shareText: {
    fontSize: 16,
    marginLeft: -8,
  },
});

export default WeeklyReportScreen;