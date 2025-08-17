import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Text, IconButton, useTheme, Portal, Snackbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from '../../hooks/useTranslation';
import { hapticFeedback } from '../../utils/haptic';

interface SkippableWrapperProps {
  children: React.ReactNode;
  promptId: string;
  skipMessage?: string;
  onSkip?: () => void;
  allowPermanentDismiss?: boolean;
  showSkipHint?: boolean;
}

const SKIP_PREFERENCES_KEY = '@mindful_skip_preferences';

export const SkippableWrapper: React.FC<SkippableWrapperProps> = ({
  children,
  promptId,
  skipMessage,
  onSkip,
  allowPermanentDismiss = true,
  showSkipHint = true,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [skipCount, setSkipCount] = useState(0);

  useEffect(() => {
    loadSkipCount();
  }, [promptId]);

  const loadSkipCount = async () => {
    try {
      const prefs = await AsyncStorage.getItem(SKIP_PREFERENCES_KEY);
      if (prefs) {
        const parsed = JSON.parse(prefs);
        setSkipCount(parsed[promptId]?.count || 0);
      }
    } catch (error) {
      console.error('Error loading skip preferences:', error);
    }
  };

  const saveSkipPreference = async (permanent: boolean = false) => {
    try {
      const prefs = await AsyncStorage.getItem(SKIP_PREFERENCES_KEY);
      const parsed = prefs ? JSON.parse(prefs) : {};
      
      parsed[promptId] = {
        count: skipCount + 1,
        lastSkipped: new Date().toISOString(),
        permanentlyDismissed: permanent,
      };
      
      await AsyncStorage.setItem(SKIP_PREFERENCES_KEY, JSON.stringify(parsed));
    } catch (error) {
      console.error('Error saving skip preferences:', error);
    }
  };

  const handleSkip = () => {
    hapticFeedback.selection();
    saveSkipPreference(false);
    setSkipCount(prev => prev + 1);
    
    if (skipCount >= 2 && allowPermanentDismiss) {
      setShowSnackbar(true);
    }
    
    onSkip?.();
  };

  const handlePermanentDismiss = async () => {
    hapticFeedback.notificationSuccess();
    await saveSkipPreference(true);
    setShowSnackbar(false);
    onSkip?.();
  };

  return (
    <>
      <View style={styles.container}>
        {children}
        
        {showSkipHint && (
          <TouchableOpacity
            style={[styles.skipHint, { backgroundColor: colors.surface }]}
            onPress={handleSkip}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.skipHintText, { color: colors.onSurfaceVariant }]}>
              {skipMessage || t('mindfulness.tapToSkip', 'Tap to skip')}
            </Text>
            <IconButton
              icon="close"
              size={16}
              iconColor={colors.onSurfaceVariant}
              style={styles.skipIcon}
            />
          </TouchableOpacity>
        )}
      </View>

      <Portal>
        <Snackbar
          visible={showSnackbar}
          onDismiss={() => setShowSnackbar(false)}
          duration={5000}
          action={{
            label: t('mindfulness.dontShowAgain', "Don't show again"),
            onPress: handlePermanentDismiss,
          }}
        >
          {t('mindfulness.promptSkipped', 'You can disable this prompt permanently')}
        </Snackbar>
      </Portal>
    </>
  );
};

export const useSkipPreference = (promptId: string) => {
  const [isSkipped, setIsSkipped] = useState(false);

  useEffect(() => {
    checkSkipPreference();
  }, [promptId]);

  const checkSkipPreference = async () => {
    try {
      const prefs = await AsyncStorage.getItem(SKIP_PREFERENCES_KEY);
      if (prefs) {
        const parsed = JSON.parse(prefs);
        setIsSkipped(parsed[promptId]?.permanentlyDismissed || false);
      }
    } catch (error) {
      console.error('Error checking skip preference:', error);
    }
  };

  return isSkipped;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipHint: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  skipHintText: {
    fontSize: 14,
    marginRight: 4,
  },
  skipIcon: {
    margin: 0,
  },
});

export default SkippableWrapper;