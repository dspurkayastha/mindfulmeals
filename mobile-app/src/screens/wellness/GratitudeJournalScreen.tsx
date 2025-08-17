import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Title,
  Card,
  Chip,
  IconButton,
  FAB,
  useTheme,
  Divider,
  Avatar,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '../../hooks/useTranslation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, startOfWeek, endOfWeek, isThisWeek, parseISO } from 'date-fns';
import { MindfulLoader } from '../../components/mindfulness';
import { LinearGradient } from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

interface GratitudeEntry {
  id: string;
  itemId: string;
  itemName: string;
  itemType: 'meal' | 'ingredient';
  text: string;
  timestamp: string;
  photo?: string;
}

const GratitudeJournalScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [weeklyHighlights, setWeeklyHighlights] = useState<GratitudeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'meals' | 'ingredients'>('all');

  useEffect(() => {
    loadGratitudeEntries();
  }, []);

  const loadGratitudeEntries = async () => {
    try {
      const stored = await AsyncStorage.getItem('@gratitude_entries');
      if (stored) {
        const allEntries = JSON.parse(stored);
        // Sort by timestamp, newest first
        const sortedEntries = allEntries.sort((a: GratitudeEntry, b: GratitudeEntry) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setEntries(sortedEntries);
        
        // Calculate weekly highlights
        const thisWeekEntries = sortedEntries.filter((entry: GratitudeEntry) => 
          isThisWeek(parseISO(entry.timestamp))
        );
        setWeeklyHighlights(thisWeekEntries.slice(0, 3));
      }
    } catch (error) {
      console.error('Error loading gratitude entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadGratitudeEntries();
    setRefreshing(false);
  }, []);

  const getFilteredEntries = () => {
    if (filter === 'all') return entries;
    return entries.filter(entry => 
      filter === 'meals' ? entry.itemType === 'meal' : entry.itemType === 'ingredient'
    );
  };

  const renderWeeklyHighlight = ({ item }: { item: GratitudeEntry }) => (
    <Card style={styles.highlightCard}>
      <LinearGradient
        colors={['#E8F5E9', '#C8E6C9']}
        style={styles.highlightGradient}
      >
        <View style={styles.highlightContent}>
          <Text style={styles.highlightDate}>
            {format(parseISO(item.timestamp), 'EEEE')}
          </Text>
          <Text style={styles.highlightTitle} numberOfLines={1}>
            {item.itemName}
          </Text>
          <Text style={styles.highlightText} numberOfLines={2}>
            "{item.text}"
          </Text>
        </View>
      </LinearGradient>
    </Card>
  );

  const renderGratitudeEntry = ({ item }: { item: GratitudeEntry }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('GratitudeDetail', { entry: item })}
      activeOpacity={0.9}
    >
      <Card style={styles.entryCard}>
        <Card.Content style={styles.entryContent}>
          <View style={styles.entryHeader}>
            <Avatar.Icon
              size={40}
              icon={item.itemType === 'meal' ? 'food' : 'leaf'}
              style={[
                styles.entryIcon,
                { backgroundColor: item.itemType === 'meal' ? '#FFF3E0' : '#E8F5E9' }
              ]}
              color={item.itemType === 'meal' ? '#FF6F00' : '#2E7D32'}
            />
            <View style={styles.entryInfo}>
              <Text style={styles.entryTitle}>{item.itemName}</Text>
              <Text style={styles.entryDate}>
                {format(parseISO(item.timestamp), 'MMM d, h:mm a')}
              </Text>
            </View>
          </View>
          
          <Text style={styles.entryText} numberOfLines={3}>
            {item.text}
          </Text>

          {item.photo && (
            <Image
              source={{ uri: item.photo }}
              style={styles.entryPhoto}
              resizeMode="cover"
            />
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Title style={styles.title}>{t('journal.gratitudeJournal')}</Title>
      <Text style={styles.subtitle}>{t('journal.subtitle')}</Text>

      {weeklyHighlights.length > 0 && (
        <View style={styles.weeklySection}>
          <Text style={styles.sectionTitle}>{t('journal.weeklyHighlights')}</Text>
          <FlatList
            horizontal
            data={weeklyHighlights}
            renderItem={renderWeeklyHighlight}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.highlightsContainer}
          />
        </View>
      )}

      <View style={styles.filterContainer}>
        <Chip
          selected={filter === 'all'}
          onPress={() => setFilter('all')}
          style={styles.filterChip}
        >
          {t('journal.all')}
        </Chip>
        <Chip
          selected={filter === 'meals'}
          onPress={() => setFilter('meals')}
          style={styles.filterChip}
        >
          {t('journal.meals')}
        </Chip>
        <Chip
          selected={filter === 'ingredients'}
          onPress={() => setFilter('ingredients')}
          style={styles.filterChip}
        >
          {t('journal.ingredients')}
        </Chip>
      </View>

      <Divider style={styles.divider} />
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <LottieView
        source={require('../../assets/animations/gratitude-heart.json')}
        autoPlay
        loop
        style={styles.emptyAnimation}
      />
      <Text style={styles.emptyTitle}>{t('journal.emptyTitle')}</Text>
      <Text style={styles.emptyText}>{t('journal.emptyText')}</Text>
    </View>
  );

  if (isLoading) {
    return <MindfulLoader duration="short" />;
  }

  const filteredEntries = getFilteredEntries();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={filteredEntries}
        renderItem={renderGratitudeEntry}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
          />
        }
      />

      <FAB
        icon="heart-plus"
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('QuickGratitude')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
    marginBottom: 20,
  },
  weeklySection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  highlightsContainer: {
    paddingRight: 20,
  },
  highlightCard: {
    width: width * 0.7,
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  highlightGradient: {
    padding: 16,
  },
  highlightContent: {
    justifyContent: 'center',
  },
  highlightDate: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
    marginBottom: 4,
  },
  highlightTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  highlightText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    borderRadius: 20,
  },
  divider: {
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 100,
    flexGrow: 1,
  },
  entryCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    elevation: 2,
  },
  entryContent: {
    padding: 16,
  },
  entryHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  entryIcon: {
    marginRight: 12,
  },
  entryInfo: {
    flex: 1,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  entryDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  entryText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  entryPhoto: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyAnimation: {
    width: 200,
    height: 200,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 28,
  },
});

export default GratitudeJournalScreen;