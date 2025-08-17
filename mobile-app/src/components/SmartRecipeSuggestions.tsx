import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Chip,
  IconButton,
  Text,
  useTheme,
  Button,
  ProgressBar,
} from 'react-native-paper';
import { LinearGradient } from 'react-native-linear-gradient';
import { useTranslation } from '../hooks/useTranslation';
import SmartRecipeService from '../services/SmartRecipeService';
import { MindfulLoader } from './mindfulness';
import { MoodWidget, EnergyMeter } from './wellness/WellnessWidgets';

interface SmartRecipeSuggestionsProps {
  userPreferences?: {
    desiredMood?: string;
    desiredEnergy?: number;
  };
  onRecipeSelect?: (recipe: any) => void;
  compact?: boolean;
}

interface RecipeSuggestion {
  recipe: any;
  matchScore: number;
  matchReasons: string[];
  missingIngredients: string[];
  availableIngredients: string[];
}

const SmartRecipeSuggestions: React.FC<SmartRecipeSuggestionsProps> = ({
  userPreferences,
  onRecipeSelect,
  compact = false,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  
  const [suggestions, setSuggestions] = useState<RecipeSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMood, setSelectedMood] = useState(userPreferences?.desiredMood || '');
  const [selectedEnergy, setSelectedEnergy] = useState(userPreferences?.desiredEnergy || 3);

  useEffect(() => {
    loadSuggestions();
  }, [selectedMood, selectedEnergy]);

  const loadSuggestions = async () => {
    try {
      const results = await SmartRecipeService.getSuggestions({
        desiredMood: selectedMood,
        desiredEnergy: selectedEnergy,
      });
      setSuggestions(results);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadSuggestions();
  };

  const getMoodIcon = (mood: string) => {
    const moodIcons: { [key: string]: string } = {
      energized: '⚡',
      satisfied: '😊',
      light: '🌿',
      nourished: '💪',
      comforted: '🤗',
      focused: '🎯',
    };
    return moodIcons[mood] || '🍽️';
  };

  const renderMoodSelector = () => {
    const moods = ['energized', 'satisfied', 'light', 'nourished', 'comforted', 'focused'];
    
    return (
      <View style={styles.selectorContainer}>
        <Text style={styles.selectorTitle}>{t('recipes.howToFeel')}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.moodScroll}
        >
          {moods.map((mood) => (
            <TouchableOpacity
              key={mood}
              onPress={() => setSelectedMood(mood === selectedMood ? '' : mood)}
              style={[
                styles.moodChip,
                selectedMood === mood && styles.moodChipSelected,
              ]}
            >
              <Text style={styles.moodIcon}>{getMoodIcon(mood)}</Text>
              <Text
                style={[
                  styles.moodText,
                  selectedMood === mood && styles.moodTextSelected,
                ]}
              >
                {t(`intention.feelings.${mood}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderRecipeCard = (suggestion: RecipeSuggestion, index: number) => {
    const { recipe, matchScore, matchReasons, missingIngredients } = suggestion;
    const matchPercentage = Math.round(matchScore * 100);

    return (
      <TouchableOpacity
        key={recipe.id}
        onPress={() => onRecipeSelect?.(recipe)}
        activeOpacity={0.9}
      >
        <Card style={styles.recipeCard}>
          <LinearGradient
            colors={['#ffffff', matchScore > 0.7 ? '#E8F5E9' : '#F5F5F5']}
            style={styles.cardGradient}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <Title style={styles.recipeTitle}>{recipe.name}</Title>
                <View style={styles.matchContainer}>
                  <ProgressBar
                    progress={matchScore}
                    color={matchScore > 0.7 ? '#4CAF50' : '#FFC107'}
                    style={styles.matchBar}
                  />
                  <Text style={styles.matchText}>{matchPercentage}% match</Text>
                </View>
              </View>
              
              <View style={styles.moodBenefits}>
                {recipe.moodBenefits.map((mood: string) => (
                  <Text key={mood} style={styles.moodBenefit}>
                    {getMoodIcon(mood)}
                  </Text>
                ))}
              </View>
            </View>

            <Paragraph style={styles.description}>{recipe.description}</Paragraph>

            <View style={styles.matchReasons}>
              {matchReasons.map((reason, idx) => (
                <View key={idx} style={styles.reasonChip}>
                  <IconButton
                    icon="check-circle"
                    size={16}
                    iconColor="#4CAF50"
                    style={styles.reasonIcon}
                  />
                  <Text style={styles.reasonText}>{reason}</Text>
                </View>
              ))}
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.timeInfo}>
                <IconButton
                  icon="clock-outline"
                  size={16}
                  iconColor="#666"
                  style={styles.footerIcon}
                />
                <Text style={styles.footerText}>
                  {recipe.prepTime + recipe.cookTime} min
                </Text>
              </View>
              
              <View style={styles.energyInfo}>
                <IconButton
                  icon="lightning-bolt"
                  size={16}
                  iconColor="#FFC107"
                  style={styles.footerIcon}
                />
                <Text style={styles.footerText}>
                  Energy: {recipe.energyLevel}/5
                </Text>
              </View>

              {missingIngredients.length > 0 && (
                <Chip
                  mode="outlined"
                  style={styles.missingChip}
                  textStyle={styles.missingChipText}
                >
                  {missingIngredients.length} missing
                </Chip>
              )}
            </View>

            <View style={styles.nutritionFocus}>
              {recipe.nutritionFocus.map((focus: string) => (
                <Chip
                  key={focus}
                  mode="flat"
                  style={styles.nutritionChip}
                  textStyle={styles.nutritionChipText}
                >
                  {focus}
                </Chip>
              ))}
            </View>
          </LinearGradient>
        </Card>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return <MindfulLoader duration="short" message={t('recipes.finding')} />;
  }

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={styles.compactHeader}>
          <Title style={styles.compactTitle}>{t('recipes.forYouNow')}</Title>
          <IconButton
            icon="refresh"
            size={20}
            onPress={handleRefresh}
          />
        </View>
        
        {suggestions.slice(0, 2).map((suggestion, index) => (
          <TouchableOpacity
            key={suggestion.recipe.id}
            onPress={() => onRecipeSelect?.(suggestion.recipe)}
            style={styles.compactCard}
          >
            <View style={styles.compactContent}>
              <Text style={styles.compactRecipeName}>{suggestion.recipe.name}</Text>
              <View style={styles.compactMoods}>
                {suggestion.recipe.moodBenefits.map((mood: string) => (
                  <Text key={mood} style={styles.compactMood}>
                    {getMoodIcon(mood)}
                  </Text>
                ))}
              </View>
            </View>
            <Text style={styles.compactMatch}>
              {Math.round(suggestion.matchScore * 100)}%
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[colors.primary]}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Title style={styles.title}>{t('recipes.smartSuggestions')}</Title>
        <Paragraph style={styles.subtitle}>
          {t('recipes.basedOnPantryMood')}
        </Paragraph>
      </View>

      {renderMoodSelector()}

      <View style={styles.energySelector}>
        <Text style={styles.selectorTitle}>{t('recipes.energyGoal')}</Text>
        <View style={styles.energySlider}>
          {[1, 2, 3, 4, 5].map((level) => (
            <TouchableOpacity
              key={level}
              onPress={() => setSelectedEnergy(level)}
              style={[
                styles.energyOption,
                selectedEnergy === level && styles.energyOptionSelected,
              ]}
            >
              <Text style={styles.energyNumber}>{level}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.suggestionsContainer}>
        {suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => renderRecipeCard(suggestion, index))
        ) : (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>{t('recipes.noSuggestions')}</Text>
              <Button
                mode="text"
                onPress={handleRefresh}
                style={styles.refreshButton}
              >
                {t('recipes.tryDifferentMood')}
              </Button>
            </Card.Content>
          </Card>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  selectorContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  selectorTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  moodScroll: {
    flexGrow: 0,
  },
  moodChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 12,
  },
  moodChipSelected: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  moodIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  moodText: {
    fontSize: 14,
    color: '#666',
  },
  moodTextSelected: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  energySelector: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  energySlider: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  energyOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  energyOptionSelected: {
    backgroundColor: '#FFC107',
  },
  energyNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  suggestionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  recipeCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
  },
  cardGradient: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitleContainer: {
    flex: 1,
    marginRight: 16,
  },
  recipeTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  matchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  matchBar: {
    width: 60,
    height: 4,
    borderRadius: 2,
  },
  matchText: {
    fontSize: 12,
    color: '#666',
  },
  moodBenefits: {
    flexDirection: 'row',
    gap: 4,
  },
  moodBenefit: {
    fontSize: 20,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  matchReasons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  reasonChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingRight: 12,
    borderRadius: 16,
  },
  reasonIcon: {
    margin: 0,
  },
  reasonText: {
    fontSize: 12,
    color: '#2E7D32',
    marginLeft: -8,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  energyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerIcon: {
    margin: 0,
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    marginLeft: -8,
  },
  missingChip: {
    backgroundColor: '#FFF3E0',
  },
  missingChipText: {
    fontSize: 12,
    color: '#E65100',
  },
  nutritionFocus: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  nutritionChip: {
    backgroundColor: '#F3E5F5',
  },
  nutritionChipText: {
    fontSize: 11,
    color: '#6A1B9A',
  },
  emptyCard: {
    borderRadius: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  refreshButton: {
    alignSelf: 'center',
  },
  compactContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  compactTitle: {
    fontSize: 18,
  },
  compactCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  compactContent: {
    flex: 1,
  },
  compactRecipeName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  compactMoods: {
    flexDirection: 'row',
    gap: 4,
  },
  compactMood: {
    fontSize: 16,
  },
  compactMatch: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});

export default SmartRecipeSuggestions;