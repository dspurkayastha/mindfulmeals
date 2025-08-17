import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  IconButton,
  Button,
  useTheme,
} from 'react-native-paper';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { useTranslation } from '../../hooks/useTranslation';
import HapticFeedback from 'react-native-haptic-feedback';
import Sound from 'react-native-sound';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export type CelebrationMilestone = 
  | 'first_pantry_item'
  | 'pantry_10_items'
  | 'first_meal_planned'
  | 'first_gratitude'
  | 'gratitude_streak_3'
  | 'gratitude_streak_7'
  | 'breathing_streak_3'
  | 'breathing_streak_7'
  | 'first_reflection'
  | 'weekly_wellness_complete'
  | 'first_mindful_meal'
  | 'mindful_week'
  | 'mindful_habit'
  | 'mindful_master'
  | 'weekly_wellness'
  | 'gratitude_consistency';

interface MicroCelebrationProps {
  milestone: CelebrationMilestone;
  visible: boolean;
  onDismiss: () => void;
  onShare?: () => void;
}

const MILESTONE_CONFIG = {
  first_pantry_item: {
    icon: '🎉',
    animation: 'confetti',
    colors: ['#4CAF50', '#81C784', '#A5D6A7'],
    sound: 'achievement.mp3',
  },
  pantry_10_items: {
    icon: '🌟',
    animation: 'stars',
    colors: ['#FFC107', '#FFD54F', '#FFE082'],
    sound: 'level_up.mp3',
  },
  first_meal_planned: {
    icon: '🍽️',
    animation: 'celebration',
    colors: ['#2196F3', '#64B5F6', '#90CAF9'],
    sound: 'success.mp3',
  },
  first_gratitude: {
    icon: '❤️',
    animation: 'heart',
    colors: ['#E91E63', '#F06292', '#F8BBD0'],
    sound: 'heart.mp3',
  },
  gratitude_streak_3: {
    icon: '🙏',
    animation: 'gratitude',
    colors: ['#9C27B0', '#BA68C8', '#CE93D8'],
    sound: 'streak.mp3',
  },
  gratitude_streak_7: {
    icon: '💫',
    animation: 'magic',
    colors: ['#673AB7', '#9575CD', '#B39DDB'],
    sound: 'magic.mp3',
  },
  breathing_streak_3: {
    icon: '🧘',
    animation: 'zen',
    colors: ['#00BCD4', '#4DD0E1', '#80DEEA'],
    sound: 'meditation.mp3',
  },
  breathing_streak_7: {
    icon: '🌊',
    animation: 'waves',
    colors: ['#009688', '#4DB6AC', '#80CBC4'],
    sound: 'ocean.mp3',
  },
  first_reflection: {
    icon: '💭',
    animation: 'sparkle',
    colors: ['#FF5722', '#FF7043', '#FF8A65'],
    sound: 'reflection.mp3',
  },
  weekly_wellness_complete: {
    icon: '🏆',
    animation: 'trophy',
    colors: ['#795548', '#8D6E63', '#A1887F'],
    sound: 'complete.mp3',
  },
  first_mindful_meal: {
    icon: '🍴',
    animation: 'confetti',
    colors: ['#4CAF50', '#66BB6A', '#81C784'],
    sound: 'achievement.mp3',
  },
  mindful_week: {
    icon: '🌈',
    animation: 'rainbow',
    colors: ['#E91E63', '#9C27B0', '#3F51B5'],
    sound: 'level_up.mp3',
  },
  mindful_habit: {
    icon: '⭐',
    animation: 'stars',
    colors: ['#FF9800', '#FFB74D', '#FFCC80'],
    sound: 'magic.mp3',
  },
  mindful_master: {
    icon: '👑',
    animation: 'crown',
    colors: ['#FFC107', '#FFD54F', '#FFE082'],
    sound: 'complete.mp3',
  },
  weekly_wellness: {
    icon: '🎯',
    animation: 'target',
    colors: ['#00BCD4', '#26C6DA', '#4DD0E1'],
    sound: 'success.mp3',
  },
  gratitude_consistency: {
    icon: '💝',
    animation: 'heart',
    colors: ['#E91E63', '#EC407A', '#F06292'],
    sound: 'heart.mp3',
  },
};

const MicroCelebration: React.FC<MicroCelebrationProps> = ({
  milestone,
  visible,
  onDismiss,
  onShare,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [hasShown, setHasShown] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const particleAnims = useRef(
    Array(6).fill(0).map(() => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current;

  const config = MILESTONE_CONFIG[milestone];
  const celebrationSound = useRef<Sound | null>(null);

  useEffect(() => {
    if (visible && !hasShown) {
      showCelebration();
      setHasShown(true);
    }
  }, [visible, hasShown]);

  const showCelebration = async () => {
    // Check if this milestone was already celebrated
    const celebrated = await hasBeenCelebrated(milestone);
    if (celebrated && milestone !== 'weekly_wellness_complete') {
      onDismiss();
      return;
    }

    // Haptic feedback
    HapticFeedback.trigger('notificationSuccess');

    // Play sound
    celebrationSound.current = new Sound(
      config.sound,
      Sound.MAIN_BUNDLE,
      (error) => {
        if (!error) {
          celebrationSound.current?.play();
        }
      }
    );

    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    // Particle animation
    particleAnims.forEach((anim, index) => {
      const angle = (index * 60) * Math.PI / 180;
      const distance = 100;

      Animated.sequence([
        Animated.delay(index * 50),
        Animated.parallel([
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(anim.x, {
            toValue: Math.cos(angle) * distance,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(anim.y, {
            toValue: Math.sin(angle) * distance,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(anim.opacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    });

    // Rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    // Mark as celebrated
    await markAsCelebrated(milestone);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      handleDismiss();
    }, 5000);
  };

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      celebrationSound.current?.release();
      onDismiss();
    });
  };

  const hasBeenCelebrated = async (milestone: CelebrationMilestone) => {
    try {
      const celebrated = await AsyncStorage.getItem('@celebrated_milestones');
      const milestones = celebrated ? JSON.parse(celebrated) : [];
      return milestones.includes(milestone);
    } catch {
      return false;
    }
  };

  const markAsCelebrated = async (milestone: CelebrationMilestone) => {
    try {
      const celebrated = await AsyncStorage.getItem('@celebrated_milestones');
      const milestones = celebrated ? JSON.parse(celebrated) : [];
      if (!milestones.includes(milestone)) {
        milestones.push(milestone);
        await AsyncStorage.setItem(
          '@celebrated_milestones',
          JSON.stringify(milestones)
        );
      }
    } catch (error) {
      console.error('Error marking milestone as celebrated:', error);
    }
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleDismiss}
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
          onPress={handleDismiss}
        />

        <Animated.View
          style={[
            styles.celebrationContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={config.colors}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Particles */}
            {particleAnims.map((anim, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.particle,
                  {
                    opacity: anim.opacity,
                    transform: [
                      { translateX: anim.x },
                      { translateY: anim.y },
                    ],
                  },
                ]}
              >
                <Text style={styles.particleEmoji}>✨</Text>
              </Animated.View>
            ))}

            {/* Main content */}
            <Animated.View
              style={[
                styles.iconContainer,
                {
                  transform: [{ rotate: spin }],
                },
              ]}
            >
              <Text style={styles.icon}>{config.icon}</Text>
            </Animated.View>

            <Text style={styles.title}>
              {t(`celebration.${milestone}.title`)}
            </Text>

            <Text style={styles.message}>
              {t(`celebration.${milestone}.message`)}
            </Text>

            <View style={styles.actions}>
              {onShare && (
                <Button
                  mode="outlined"
                  onPress={onShare}
                  style={styles.shareButton}
                  labelStyle={styles.shareButtonLabel}
                >
                  {t('celebration.share')}
                </Button>
              )}
              <Button
                mode="contained"
                onPress={handleDismiss}
                style={styles.continueButton}
                labelStyle={styles.continueButtonLabel}
              >
                {t('celebration.continue')}
              </Button>
            </View>

            <LottieView
              source={require(`../../assets/animations/${config.animation}.json`)}
              autoPlay
              loop
              style={styles.backgroundAnimation}
              speed={0.8}
            />
          </LinearGradient>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  celebrationContainer: {
    width: width * 0.85,
    maxWidth: 350,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gradient: {
    padding: 32,
    alignItems: 'center',
    position: 'relative',
  },
  particle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
  particleEmoji: {
    fontSize: 20,
  },
  iconContainer: {
    marginBottom: 16,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  shareButton: {
    borderColor: 'white',
    borderWidth: 2,
  },
  shareButtonLabel: {
    color: 'white',
  },
  continueButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  continueButtonLabel: {
    color: 'white',
  },
  backgroundAnimation: {
    position: 'absolute',
    width: '120%',
    height: '120%',
    opacity: 0.1,
  },
});

export default MicroCelebration;