import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Animated,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import {
  Text,
  IconButton,
  Button,
  useTheme,
  Chip,
} from 'react-native-paper';
import { LinearGradient } from 'react-native-linear-gradient';
import { useTranslation } from '../../hooks/useTranslation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HapticFeedback from 'react-native-haptic-feedback';
import { BlurView } from '@react-native-community/blur';

const { width } = Dimensions.get('window');

interface PreMealIntentionProps {
  visible: boolean;
  onClose: () => void;
  mealName: string;
  mealId: string;
  onIntentionSet?: (intention: MealIntention) => void;
}

interface MealIntention {
  mealId: string;
  mealName: string;
  desiredFeeling: string;
  desiredEnergy: number;
  mindfulEating: boolean;
  portionAwareness: boolean;
  timestamp: string;
}

const FEELING_OPTIONS = [
  { id: 'energized', label: 'Energized', icon: '⚡', color: '#FFC107' },
  { id: 'satisfied', label: 'Satisfied', icon: '😊', color: '#4CAF50' },
  { id: 'light', label: 'Light', icon: '🌿', color: '#00BCD4' },
  { id: 'nourished', label: 'Nourished', icon: '💪', color: '#9C27B0' },
  { id: 'comforted', label: 'Comforted', icon: '🤗', color: '#E91E63' },
  { id: 'focused', label: 'Focused', icon: '🎯', color: '#2196F3' },
];

const PreMealIntention: React.FC<PreMealIntentionProps> = ({
  visible,
  onClose,
  mealName,
  mealId,
  onIntentionSet,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [selectedFeeling, setSelectedFeeling] = useState<string>('');
  const [desiredEnergy, setDesiredEnergy] = useState(3);
  const [mindfulEating, setMindfulEating] = useState(false);
  const [portionAwareness, setPortionAwareness] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const energyAnim = useRef(new Animated.Value(3)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  useEffect(() => {
    Animated.timing(energyAnim, {
      toValue: desiredEnergy,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [desiredEnergy]);

  const handleSetIntention = async () => {
    if (!selectedFeeling) return;

    const intention: MealIntention = {
      mealId,
      mealName,
      desiredFeeling: selectedFeeling,
      desiredEnergy,
      mindfulEating,
      portionAwareness,
      timestamp: new Date().toISOString(),
    };

    // Save intention
    try {
      const stored = await AsyncStorage.getItem('@meal_intentions');
      const intentions = stored ? JSON.parse(stored) : [];
      intentions.push(intention);
      await AsyncStorage.setItem('@meal_intentions', JSON.stringify(intentions));
    } catch (error) {
      console.error('Error saving intention:', error);
    }

    HapticFeedback.trigger('notificationSuccess');
    onIntentionSet?.(intention);
    handleClose();
  };

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
      // Reset state
      setSelectedFeeling('');
      setDesiredEnergy(3);
      setMindfulEating(false);
      setPortionAwareness(false);
    });
  };

  const renderFeelingOption = (option: typeof FEELING_OPTIONS[0]) => {
    const isSelected = selectedFeeling === option.id;
    
    return (
      <TouchableOpacity
        key={option.id}
        onPress={() => {
          setSelectedFeeling(option.id);
          HapticFeedback.trigger('impactLight');
        }}
        style={[
          styles.feelingOption,
          isSelected && { borderColor: option.color, borderWidth: 2 },
        ]}
      >
        <LinearGradient
          colors={isSelected ? [option.color, option.color + '80'] : ['#F5F5F5', '#EEEEEE']}
          style={styles.feelingGradient}
        >
          <Text style={styles.feelingIcon}>{option.icon}</Text>
          <Text style={[
            styles.feelingLabel,
            isSelected && { color: 'white', fontWeight: '600' },
          ]}>
            {t(`intention.feelings.${option.id}`)}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const getEnergyColor = () => {
    const colors = ['#FF5722', '#FF7043', '#FFC107', '#66BB6A', '#4CAF50'];
    return colors[Math.floor(desiredEnergy) - 1] || '#999';
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        >
          <BlurView
            style={StyleSheet.absoluteFillObject}
            blurType="dark"
            blurAmount={10}
          />
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.content,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <IconButton
              icon="close"
              size={24}
              onPress={handleClose}
              style={styles.closeButton}
            />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {t('intention.title', { meal: mealName })}
              </Text>
              <Text style={styles.subtitle}>
                {t('intention.subtitle')}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {t('intention.howToFeel')}
              </Text>
              <View style={styles.feelingsGrid}>
                {FEELING_OPTIONS.map(renderFeelingOption)}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {t('intention.energyLevel')}
              </Text>
              <View style={styles.energyContainer}>
                <View style={styles.energySlider}>
                  {[1, 2, 3, 4, 5].map((level) => (
                    <TouchableOpacity
                      key={level}
                      onPress={() => setDesiredEnergy(level)}
                      style={styles.energyDot}
                    >
                      <Animated.View
                        style={[
                          styles.energyDotInner,
                          {
                            backgroundColor: energyAnim.interpolate({
                              inputRange: [level - 0.5, level, level + 0.5],
                              outputRange: ['#E0E0E0', getEnergyColor(), '#E0E0E0'],
                              extrapolate: 'clamp',
                            }),
                            transform: [{
                              scale: energyAnim.interpolate({
                                inputRange: [level - 0.5, level, level + 0.5],
                                outputRange: [1, 1.3, 1],
                                extrapolate: 'clamp',
                              }),
                            }],
                          },
                        ]}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.energyLabels}>
                  <Text style={styles.energyLabel}>{t('intention.lowEnergy')}</Text>
                  <Text style={[styles.energyValue, { color: getEnergyColor() }]}>
                    {desiredEnergy}/5
                  </Text>
                  <Text style={styles.energyLabel}>{t('intention.highEnergy')}</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {t('intention.practices')}
              </Text>
              <TouchableOpacity
                onPress={() => setMindfulEating(!mindfulEating)}
                style={[
                  styles.practiceOption,
                  mindfulEating && styles.practiceOptionActive,
                ]}
              >
                <IconButton
                  icon={mindfulEating ? 'checkbox-marked' : 'checkbox-blank-outline'}
                  size={24}
                  iconColor={mindfulEating ? '#4CAF50' : '#999'}
                />
                <View style={styles.practiceContent}>
                  <Text style={styles.practiceTitle}>
                    {t('intention.mindfulEating')}
                  </Text>
                  <Text style={styles.practiceDescription}>
                    {t('intention.mindfulEatingDesc')}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setPortionAwareness(!portionAwareness)}
                style={[
                  styles.practiceOption,
                  portionAwareness && styles.practiceOptionActive,
                ]}
              >
                <IconButton
                  icon={portionAwareness ? 'checkbox-marked' : 'checkbox-blank-outline'}
                  size={24}
                  iconColor={portionAwareness ? '#4CAF50' : '#999'}
                />
                <View style={styles.practiceContent}>
                  <Text style={styles.practiceTitle}>
                    {t('intention.portionAwareness')}
                  </Text>
                  <Text style={styles.practiceDescription}>
                    {t('intention.portionAwarenessDesc')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.actions}>
              <Button
                mode="text"
                onPress={handleClose}
                style={styles.skipButton}
              >
                {t('intention.skip')}
              </Button>
              <Button
                mode="contained"
                onPress={handleSetIntention}
                disabled={!selectedFeeling}
                style={styles.setButton}
              >
                {t('intention.setIntention')}
              </Button>
            </View>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 24,
    width: width * 0.9,
    maxWidth: 400,
    maxHeight: '80%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  header: {
    alignItems: 'flex-end',
    paddingTop: 8,
    paddingRight: 8,
  },
  closeButton: {
    margin: 0,
  },
  titleContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  feelingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  feelingOption: {
    width: 100,
    height: 90,
    borderRadius: 16,
    overflow: 'hidden',
  },
  feelingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  feelingIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  feelingLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  energyContainer: {
    alignItems: 'center',
  },
  energySlider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    paddingVertical: 16,
  },
  energyDot: {
    padding: 8,
  },
  energyDotInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  energyLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 8,
  },
  energyLabel: {
    fontSize: 12,
    color: '#666',
  },
  energyValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  practiceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    marginBottom: 12,
  },
  practiceOptionActive: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  practiceContent: {
    flex: 1,
    marginLeft: -8,
  },
  practiceTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  practiceDescription: {
    fontSize: 12,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
  },
  skipButton: {
    flex: 1,
    marginRight: 8,
  },
  setButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default PreMealIntention;