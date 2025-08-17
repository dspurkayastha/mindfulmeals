import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Animated,
  TouchableOpacity,
  Dimensions,
  Vibration,
} from 'react-native';
import {
  Text,
  IconButton,
  TextInput,
  Button,
  useTheme,
} from 'react-native-paper';
import { BlurView } from '@react-native-community/blur';
import { useTranslation } from '../../hooks/useTranslation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToast } from '../../utils/toast';
import HapticFeedback from 'react-native-haptic-feedback';
import LottieView from 'lottie-react-native';
import MilestoneService from '../../services/MilestoneService';

const { width, height } = Dimensions.get('window');

interface GratitudeOverlayProps {
  visible: boolean;
  onClose: () => void;
  itemName: string;
  itemId: string;
  itemType: 'meal' | 'ingredient';
}

const GRATITUDE_PROMPTS = [
  'gratitude.prompts.nourishment',
  'gratitude.prompts.preparation',
  'gratitude.prompts.source',
  'gratitude.prompts.experience',
  'gratitude.prompts.sharing',
];

const GratitudeOverlay: React.FC<GratitudeOverlayProps> = ({
  visible,
  onClose,
  itemName,
  itemId,
  itemType,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [gratitudeText, setGratitudeText] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState(0);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const heartScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Haptic feedback on open
      HapticFeedback.trigger('impactMedium');
      
      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Select random prompt
      setSelectedPrompt(Math.floor(Math.random() * GRATITUDE_PROMPTS.length));
    } else {
      // Reset state
      setGratitudeText('');
      setShowSuccess(false);
      heartScale.setValue(0);
    }
  }, [visible]);

  const handleSave = async () => {
    if (!gratitudeText.trim()) {
      showToast({
        message: t('gratitude.enterText'),
        preset: 'info',
      });
      return;
    }

    setSaving(true);
    HapticFeedback.trigger('notificationSuccess');

    try {
      // Save gratitude entry
      const gratitudeEntry = {
        id: `gratitude_${Date.now()}`,
        itemId,
        itemName,
        itemType,
        text: gratitudeText,
        timestamp: new Date().toISOString(),
      };

      const stored = await AsyncStorage.getItem('@gratitude_entries');
      const entries = stored ? JSON.parse(stored) : [];
      entries.push(gratitudeEntry);
      await AsyncStorage.setItem('@gratitude_entries', JSON.stringify(entries));

      // Show success animation
      setShowSuccess(true);
      Animated.spring(heartScale, {
        toValue: 1,
        tension: 50,
        friction: 3,
        useNativeDriver: true,
      }).start();

      showToast({
        message: t('gratitude.saved'),
        preset: 'success',
      });

      // Track milestone
      await MilestoneService.trackGratitude();

      // Close after delay
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      showToast({
        message: t('gratitude.saveError'),
        preset: 'error',
      });
    } finally {
      setSaving(false);
    }
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
    });
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
          {!showSuccess ? (
            <>
              <View style={styles.header}>
                <View style={styles.iconContainer}>
                  <IconButton
                    icon={itemType === 'meal' ? 'food' : 'leaf'}
                    size={32}
                    iconColor={colors.primary}
                  />
                </View>
                <IconButton
                  icon="close"
                  size={24}
                  onPress={handleClose}
                  style={styles.closeButton}
                />
              </View>

              <Text style={styles.title}>
                {t('gratitude.titleFor', { item: itemName })}
              </Text>

              <Text style={styles.prompt}>
                {t(GRATITUDE_PROMPTS[selectedPrompt])}
              </Text>

              <TextInput
                mode="outlined"
                multiline
                numberOfLines={4}
                placeholder={t('gratitude.placeholder')}
                value={gratitudeText}
                onChangeText={setGratitudeText}
                style={styles.textInput}
                outlineColor={colors.primary}
                activeOutlineColor={colors.primary}
                autoFocus
              />

              <View style={styles.quickResponses}>
                <TouchableOpacity
                  style={styles.quickChip}
                  onPress={() => setGratitudeText(t('gratitude.quick1'))}
                >
                  <Text style={styles.quickChipText}>🙏 {t('gratitude.quick1')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickChip}
                  onPress={() => setGratitudeText(t('gratitude.quick2'))}
                >
                  <Text style={styles.quickChipText}>❤️ {t('gratitude.quick2')}</Text>
                </TouchableOpacity>
              </View>

              <Button
                mode="contained"
                onPress={handleSave}
                loading={saving}
                disabled={saving}
                style={styles.saveButton}
              >
                {t('gratitude.express')}
              </Button>
            </>
          ) : (
            <Animated.View
              style={[
                styles.successContainer,
                {
                  transform: [{ scale: heartScale }],
                },
              ]}
            >
              <LottieView
                source={require('../../assets/animations/gratitude-heart.json')}
                autoPlay
                loop={false}
                style={styles.lottie}
              />
              <Text style={styles.successText}>
                {t('gratitude.thanksForSharing')}
              </Text>
            </Animated.View>
          )}
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
    padding: 24,
    width: width * 0.9,
    maxWidth: 400,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    padding: 4,
  },
  closeButton: {
    margin: -8,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  prompt: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  textInput: {
    marginBottom: 16,
    minHeight: 100,
  },
  quickResponses: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  quickChip: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  quickChipText: {
    fontSize: 14,
  },
  saveButton: {
    borderRadius: 24,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  lottie: {
    width: 150,
    height: 150,
  },
  successText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
    marginTop: 16,
  },
});

export default GratitudeOverlay;