import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Text, IconButton, useTheme } from 'react-native-paper';
import { useTranslation } from '../../hooks/useTranslation';
import { LinearGradient } from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

interface FloatingBreatherButtonProps {
  onPress: () => void;
  onDismiss: () => void;
  style?: any;
}

const FloatingBreatherButton: React.FC<FloatingBreatherButtonProps> = ({
  onPress,
  onDismiss,
  style,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: pulseAnim }],
        },
        style,
      ]}
    >
      <TouchableOpacity 
        onPress={onPress} 
        activeOpacity={0.9}
        accessible={true}
        accessibilityLabel={t('mindfulness.takeBreathLabel', 'Take a mindful breathing break')}
        accessibilityHint={t('mindfulness.takeBreathHint', 'Double tap to start a 5-minute breathing exercise')}
        accessibilityRole="button"
      >
        <LinearGradient
          colors={['#81C784', '#4CAF50', '#388E3C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          <View style={styles.innerContent}>
            <IconButton
              icon="meditation"
              iconColor="white"
              size={32}
              style={styles.icon}
              accessible={false}
              importantForAccessibility="no"
            />
            <Text style={styles.text}>{t('mindfulness.takeBreath')}</Text>
            <Text style={styles.subtext}>{t('mindfulness.fiveMinutes')}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.dismissButton}
        onPress={onDismiss}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessible={true}
        accessibilityLabel={t('mindfulness.dismissLabel', 'Dismiss breathing suggestion')}
        accessibilityHint={t('mindfulness.dismissHint', 'Double tap to dismiss this suggestion')}
        accessibilityRole="button"
      >
        <Text style={styles.dismissText}>{t('mindfulness.skipForNow')}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    alignItems: 'center',
  },
  button: {
    borderRadius: 30,
    paddingHorizontal: 30,
    paddingVertical: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  innerContent: {
    alignItems: 'center',
  },
  icon: {
    margin: 0,
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginTop: -5,
  },
  subtext: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    marginTop: 4,
  },
  dismissButton: {
    marginTop: 12,
    padding: 8,
  },
  dismissText: {
    color: '#666',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default FloatingBreatherButton;