import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Chip,
  IconButton,
  useTheme,
} from 'react-native-paper';
import { useTranslation } from '../hooks/useTranslation';
import HapticFeedback from 'react-native-haptic-feedback';
import GratitudeOverlay from './mindfulness/GratitudeOverlay';

const { width } = Dimensions.get('window');

interface MealCardProps {
  meal: {
    id: string;
    name: string;
    description?: string;
    image?: string;
    calories?: number;
    prepTime?: number;
    tags?: string[];
    mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  };
  onPress?: () => void;
  onSchedule?: () => void;
}

const MealCard: React.FC<MealCardProps> = ({ meal, onPress, onSchedule }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [showGratitude, setShowGratitude] = useState(false);

  const handleLongPress = () => {
    HapticFeedback.trigger('impactMedium');
    setShowGratitude(true);
  };

  const getMealTypeColor = () => {
    switch (meal.mealType) {
      case 'breakfast':
        return '#FFC107';
      case 'lunch':
        return '#4CAF50';
      case 'dinner':
        return '#2196F3';
      case 'snack':
        return '#FF5722';
      default:
        return colors.primary;
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={onPress}
        onLongPress={handleLongPress}
        delayLongPress={600}
        activeOpacity={0.9}
      >
        <Card style={styles.card}>
          {meal.image && (
            <Card.Cover
              source={{ uri: meal.image }}
              style={styles.image}
            />
          )}
          
          <Card.Content style={styles.content}>
            <View style={styles.header}>
              <Title style={styles.title} numberOfLines={1}>
                {meal.name}
              </Title>
              {meal.mealType && (
                <Chip
                  mode="flat"
                  style={[
                    styles.mealTypeChip,
                    { backgroundColor: getMealTypeColor() + '20' },
                  ]}
                  textStyle={{ color: getMealTypeColor() }}
                >
                  {t(`meals.${meal.mealType}`)}
                </Chip>
              )}
            </View>

            {meal.description && (
              <Paragraph style={styles.description} numberOfLines={2}>
                {meal.description}
              </Paragraph>
            )}

            <View style={styles.info}>
              {meal.calories && (
                <View style={styles.infoItem}>
                  <IconButton
                    icon="fire"
                    size={16}
                    iconColor="#FF5722"
                    style={styles.infoIcon}
                  />
                  <Paragraph style={styles.infoText}>
                    {meal.calories} cal
                  </Paragraph>
                </View>
              )}

              {meal.prepTime && (
                <View style={styles.infoItem}>
                  <IconButton
                    icon="clock-outline"
                    size={16}
                    iconColor="#2196F3"
                    style={styles.infoIcon}
                  />
                  <Paragraph style={styles.infoText}>
                    {meal.prepTime} min
                  </Paragraph>
                </View>
              )}
            </View>

            {meal.tags && meal.tags.length > 0 && (
              <View style={styles.tags}>
                {meal.tags.slice(0, 3).map((tag, index) => (
                  <Chip
                    key={index}
                    mode="outlined"
                    style={styles.tag}
                    textStyle={styles.tagText}
                  >
                    {tag}
                  </Chip>
                ))}
              </View>
            )}
          </Card.Content>

          {onSchedule && (
            <Card.Actions style={styles.actions}>
              <TouchableOpacity
                style={styles.scheduleButton}
                onPress={onSchedule}
              >
                <IconButton
                  icon="calendar-plus"
                  size={20}
                  iconColor={colors.primary}
                />
                <Paragraph style={styles.scheduleText}>
                  {t('meals.schedule')}
                </Paragraph>
              </TouchableOpacity>
            </Card.Actions>
          )}
        </Card>
      </TouchableOpacity>

      <GratitudeOverlay
        visible={showGratitude}
        onClose={() => setShowGratitude(false)}
        itemName={meal.name}
        itemId={meal.id}
        itemType="meal"
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    elevation: 2,
    overflow: 'hidden',
  },
  image: {
    height: 180,
  },
  content: {
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    flex: 1,
    marginRight: 8,
  },
  mealTypeChip: {
    height: 28,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  info: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    margin: 0,
    marginRight: -4,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    height: 24,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
  },
  actions: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleText: {
    fontSize: 14,
    color: '#666',
    marginLeft: -8,
  },
});

export default MealCard;