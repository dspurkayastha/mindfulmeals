import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Share,
} from 'react-native';
import {
  Text,
  Card,
  IconButton,
  useTheme,
} from 'react-native-paper';
import { LinearGradient } from 'react-native-linear-gradient';
import ViewShot from 'react-native-view-shot';
import { format, parseISO } from 'date-fns';
import { useTranslation } from '../hooks/useTranslation';
import { showToast } from '../utils/toast';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;

interface ShareableGratitudeCardProps {
  entry: {
    itemName: string;
    text: string;
    timestamp: string;
    itemType: 'meal' | 'ingredient';
  };
  onShare?: () => void;
}

const ShareableGratitudeCard: React.FC<ShareableGratitudeCardProps> = ({
  entry,
  onShare,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const viewShotRef = useRef<ViewShot>(null);

  const handleShare = async () => {
    try {
      const uri = await viewShotRef.current?.capture?.();
      if (uri) {
        await Share.share({
          title: t('share.gratitudeTitle'),
          message: t('share.gratitudeMessage', { item: entry.itemName }),
          url: uri,
        });
        onShare?.();
      }
    } catch (error) {
      showToast({
        message: t('share.error'),
        preset: 'error',
      });
    }
  };

  const getGradientColors = () => {
    return entry.itemType === 'meal'
      ? ['#FFF3E0', '#FFE0B2', '#FFCC80']
      : ['#E8F5E9', '#C8E6C9', '#A5D6A7'];
  };

  return (
    <View style={styles.container}>
      <ViewShot
        ref={viewShotRef}
        options={{ format: 'jpg', quality: 0.9 }}
        style={styles.viewShot}
      >
        <LinearGradient
          colors={getGradientColors()}
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.header}>
            <Text style={styles.appName}>MindfulMeals</Text>
            <Text style={styles.date}>
              {format(parseISO(entry.timestamp), 'MMMM d, yyyy')}
            </Text>
          </View>

          <View style={styles.content}>
            <IconButton
              icon={entry.itemType === 'meal' ? 'food' : 'leaf'}
              size={48}
              iconColor={entry.itemType === 'meal' ? '#FF6F00' : '#2E7D32'}
              style={styles.icon}
            />

            <Text style={styles.itemName}>{entry.itemName}</Text>

            <View style={styles.quoteContainer}>
              <Text style={styles.quoteLeft}>"</Text>
              <Text style={styles.gratitudeText}>{entry.text}</Text>
              <Text style={styles.quoteRight}>"</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.hashtag}>#MindfulEating</Text>
            <Text style={styles.hashtag}>#Gratitude</Text>
          </View>
        </LinearGradient>
      </ViewShot>

      <IconButton
        icon="share-variant"
        size={28}
        mode="contained"
        onPress={handleShare}
        style={styles.shareButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  viewShot: {
    backgroundColor: 'white',
  },
  card: {
    width: CARD_WIDTH,
    padding: 24,
    borderRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    margin: 0,
    marginBottom: 16,
  },
  itemName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  quoteContainer: {
    paddingHorizontal: 20,
  },
  quoteLeft: {
    fontSize: 36,
    color: '#999',
    marginBottom: -10,
  },
  gratitudeText: {
    fontSize: 18,
    color: '#444',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 10,
  },
  quoteRight: {
    fontSize: 36,
    color: '#999',
    alignSelf: 'flex-end',
    marginTop: -10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 10,
  },
  hashtag: {
    fontSize: 12,
    color: '#666',
  },
  shareButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
  },
});

export default ShareableGratitudeCard;