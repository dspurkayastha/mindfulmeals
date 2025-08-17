import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  TextInput,
  Button,
  Chip,
  IconButton,
  useTheme,
} from 'react-native-paper';
import { useTranslation } from '../../hooks/useTranslation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToast } from '../../utils/toast';
import Slider from '@react-native-community/slider';
import { hapticFeedback } from '../../utils/haptic';

interface PostMealReflectionProps {
  mealId: string;
  mealName: string;
  onComplete: (reflection: any) => void;
  onSkip?: () => void;
}

const MOOD_OPTIONS = [
  { key: 'energized', label: 'Energized', icon: '⚡', color: '#FFC107' },
  { key: 'satisfied', label: 'Satisfied', icon: '😊', color: '#4CAF50' },
  { key: 'heavy', label: 'Heavy', icon: '😴', color: '#9E9E9E' },
  { key: 'still_hungry', label: 'Still Hungry', icon: '🍽️', color: '#FF5722' },
];

const PostMealReflection: React.FC<PostMealReflectionProps> = ({
  mealId,
  mealName,
  onComplete,
  onSkip,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [energyLevel, setEnergyLevel] = useState(3);
  const [satisfaction, setSatisfaction] = useState(5);
  const [gratitudeText, setGratitudeText] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!selectedMood) {
      showToast({
        message: t('reflection.selectMood'),
        preset: 'info',
      });
      return;
    }

    setSaving(true);
    
    const reflection = {
      mealId,
      mealName,
      mood: selectedMood,
      energyLevel,
      satisfaction,
      gratitudeText,
      timestamp: new Date().toISOString(),
    };

    try {
      // Save to local storage
      const stored = await AsyncStorage.getItem('@meal_reflections');
      const reflections = stored ? JSON.parse(stored) : [];
      reflections.push(reflection);
      await AsyncStorage.setItem(
        '@meal_reflections',
        JSON.stringify(reflections)
      );

      showToast({
        message: t('reflection.saved'),
        preset: 'success',
      });

      hapticFeedback.reflectionComplete();
      onComplete(reflection);
    } catch (error) {
      showToast({
        message: t('reflection.saveError'),
        preset: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const getEnergyLabel = () => {
    if (energyLevel <= 2) return t('reflection.lowEnergy');
    if (energyLevel <= 4) return t('reflection.moderateEnergy');
    return t('reflection.highEnergy');
  };

  const getEnergyColor = () => {
    if (energyLevel <= 2) return '#FF5722';
    if (energyLevel <= 4) return '#FFC107';
    return '#4CAF50';
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.header}>
              <Title style={styles.title}>
                {t('reflection.howWasMeal', { meal: mealName })}
              </Title>
              {onSkip && (
                <IconButton
                  icon="close"
                  size={24}
                  onPress={onSkip}
                  style={styles.closeButton}
                />
              )}
            </View>

            <Text style={styles.sectionTitle}>{t('reflection.mood')}</Text>
            <View style={styles.moodContainer}>
              {MOOD_OPTIONS.map((mood) => (
                <TouchableOpacity
                  key={mood.key}
                  onPress={() => {
                    hapticFeedback.selection();
                    setSelectedMood(mood.key);
                  }}
                  style={[
                    styles.moodOption,
                    selectedMood === mood.key && {
                      backgroundColor: mood.color + '20',
                      borderColor: mood.color,
                    },
                  ]}
                >
                  <Text style={styles.moodIcon}>{mood.icon}</Text>
                  <Text
                    style={[
                      styles.moodLabel,
                      selectedMood === mood.key && { color: mood.color },
                    ]}
                  >
                    {t(`reflection.moods.${mood.key}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>{t('reflection.energyLevel')}</Text>
            <View style={styles.energyContainer}>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={5}
                step={1}
                value={energyLevel}
                onValueChange={setEnergyLevel}
                minimumTrackTintColor={getEnergyColor()}
                maximumTrackTintColor="#E0E0E0"
                thumbTintColor={getEnergyColor()}
              />
              <View style={styles.energyLabels}>
                <Text style={styles.energyValue}>{energyLevel}/5</Text>
                <Text style={[styles.energyLabel, { color: getEnergyColor() }]}>
                  {getEnergyLabel()}
                </Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>{t('reflection.satisfaction', 'How satisfied are you?')}</Text>
            <View style={styles.energyContainer}>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={10}
                step={1}
                value={satisfaction}
                onValueChange={setSatisfaction}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor="#E0E0E0"
                thumbTintColor={colors.primary}
              />
              <View style={styles.energyLabels}>
                <Text style={styles.energyValue}>{satisfaction}/10</Text>
                <Text style={[styles.energyLabel, { color: colors.primary }]}>
                  {satisfaction <= 3 ? t('reflection.notSatisfied', 'Not satisfied') :
                   satisfaction <= 6 ? t('reflection.moderatelySatisfied', 'Moderately satisfied') :
                   t('reflection.verySatisfied', 'Very satisfied')}
                </Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>{t('reflection.gratitude')}</Text>
            <TextInput
              mode="outlined"
              multiline
              numberOfLines={3}
              placeholder={t('reflection.gratitudePlaceholder')}
              value={gratitudeText}
              onChangeText={setGratitudeText}
              style={styles.textInput}
              outlineColor={colors.primary}
              activeOutlineColor={colors.primary}
            />

            <View style={styles.photoSection}>
              <TouchableOpacity style={styles.photoButton}>
                <IconButton icon="camera" size={24} />
                <Text style={styles.photoText}>{t('reflection.addPhoto')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.photoButton}>
                <IconButton icon="microphone" size={24} />
                <Text style={styles.photoText}>{t('reflection.addVoiceNote')}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.actions}>
              {onSkip && (
                <Button
                  mode="text"
                  onPress={onSkip}
                  style={styles.skipButton}
                >
                  {t('reflection.skipForNow')}
                </Button>
              )}
              <Button
                mode="contained"
                onPress={handleSave}
                loading={saving}
                disabled={saving || !selectedMood}
                style={styles.saveButton}
              >
                {t('reflection.save')}
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 16,
    borderRadius: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    flex: 1,
  },
  closeButton: {
    margin: -8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 12,
  },
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  moodOption: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  moodIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 14,
    color: '#666',
  },
  energyContainer: {
    marginBottom: 20,
  },
  slider: {
    height: 40,
    marginHorizontal: -10,
  },
  energyLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  energyValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  energyLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  textInput: {
    marginBottom: 20,
  },
  photoSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  photoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 8,
  },
  photoText: {
    fontSize: 14,
    marginLeft: -8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  skipButton: {
    flex: 1,
  },
  saveButton: {
    flex: 2,
  },
})

export default PostMealReflection;