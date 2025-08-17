import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  FlatList,
  RefreshControl,
  Animated,
  Dimensions,
} from 'react-native';
import {
  Card,
  Title,
  Searchbar,
  Chip,
  FAB,
  useTheme,
  ActivityIndicator,
  Divider,
  Text,
  IconButton,
} from 'react-native-paper';
import { usePantryItems } from '../../hooks/api/usePantryItems';
import { useTranslation } from '../../hooks/useTranslation';
import { useStressDetection } from '../../hooks/useStressDetection';
import PantryItem from '../../components/PantryItem';
import EmptyState from '../../components/EmptyState';
import { showToast } from '../../utils/toast';
import { FloatingBreatherButton, MindfulLoader, GratitudeOverlay } from '../../components/mindfulness';
import { hapticFeedback } from '../../utils/haptic';

const { width } = Dimensions.get('window');

const PantryScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [organizingStartTime, setOrganizingStartTime] = useState<number | null>(null);
  const [showBreatherButton, setShowBreatherButton] = useState(false);
  const [gratitudeItem, setGratitudeItem] = useState<any>(null);
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const breathButtonOpacity = useRef(new Animated.Value(0)).current;
  
  const { StressAwareFlatList, trackTap } = useStressDetection({
    screen: 'Pantry',
    enableScrollTracking: true,
    enableTapTracking: true,
  });

  const {
    data: pantryItems = [],
    isLoading,
    error,
    refetch,
  } = usePantryItems();

  // Track organizing time
  useEffect(() => {
    setOrganizingStartTime(Date.now());
    
    // Check every minute if user has been organizing for 5 minutes
    const interval = setInterval(() => {
      if (organizingStartTime && Date.now() - organizingStartTime >= 5 * 60 * 1000) {
        setShowBreatherButton(true);
        Animated.timing(breathButtonOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [organizingStartTime]);

  const categories = [
    { key: 'all', label: t('pantry.all'), icon: 'view-grid' },
    { key: 'produce', label: t('pantry.produce'), icon: 'fruit-grapes' },
    { key: 'dairy', label: t('pantry.dairy'), icon: 'cheese' },
    { key: 'proteins', label: t('pantry.proteins'), icon: 'food-drumstick' },
    { key: 'grains', label: t('pantry.grains'), icon: 'barley' },
    { key: 'condiments', label: t('pantry.condiments'), icon: 'bottle-soda' },
    { key: 'snacks', label: t('pantry.snacks'), icon: 'cookie' },
  ];

  const filteredItems = pantryItems.filter((item: any) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRefresh = async () => {
    hapticFeedback.pullToRefresh();
    setRefreshing(true);
    try {
      await refetch();
      showToast({
        message: t('pantry.refreshed'),
        preset: 'success',
      });
    } catch (error) {
      showToast({
        message: t('pantry.refreshError'),
        preset: 'error',
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddItem = () => {
    hapticFeedback.buttonPress();
    trackTap();
    navigation.navigate('AddPantryItem');
  };

  const handleItemPress = (item: any) => {
    navigation.navigate('PantryItemDetail', { item });
  };

  const renderPantryItem = ({ item }: any) => (
    <PantryItem
      item={item}
      onPress={() => handleItemPress(item)}
      onLongPress={() => {
        setGratitudeItem(item);
      }}
    />
  );

  const renderCategoryChips = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.categoryContainer}
      contentContainerStyle={styles.categoryContent}
    >
      {categories.map((category) => (
        <Chip
          key={category.key}
          selected={selectedCategory === category.key}
          onPress={() => setSelectedCategory(category.key)}
          icon={category.icon}
          style={[
            styles.categoryChip,
            selectedCategory === category.key && styles.selectedChip,
          ]}
          textStyle={[
            styles.chipText,
            selectedCategory === category.key && styles.selectedChipText,
          ]}
        >
          {category.label}
        </Chip>
      ))}
    </ScrollView>
  );

  if (error) {
    return (
      <EmptyState
        title={t('pantry.errorTitle')}
        message={t('pantry.errorMessage')}
        actionLabel={t('common.retry')}
        onAction={refetch}
      />
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Title style={styles.title}>{t('pantry.title')}</Title>
        <Text style={styles.subtitle}>{t('pantry.subtitle')}</Text>
      </View>

      <Searchbar
        placeholder={t('pantry.searchPlaceholder')}
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        inputStyle={styles.searchInput}
      />

      {renderCategoryChips()}
      <Divider />

      {isLoading ? (
        <MindfulLoader duration="short" />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          title={t('pantry.emptyTitle')}
          message={t('pantry.emptyMessage')}
          actionLabel={t('pantry.addFirst')}
          onAction={handleAddItem}
        />
      ) : (
        <StressAwareFlatList
          data={filteredItems}
          renderItem={renderPantryItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
            />
          }
          contentContainerStyle={styles.listContent}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          // Performance optimizations
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={10}
          updateCellsBatchingPeriod={50}
          getItemLayout={(data, index) => ({
            length: 80, // Approximate item height
            offset: 80 * index,
            index,
          })}
        />
      )}

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={handleAddItem}
        label={t('pantry.addItem')}
      />

      {showBreatherButton && (
        <FloatingBreatherButton
          onPress={() => {
            setShowBreatherButton(false);
            navigation.navigate('BreathingExercise', {
              context: 'pantry',
              returnScreen: 'Pantry',
              duration: 3, // 3 minutes for pantry context
            });
          }}
          onDismiss={() => {
            setShowBreatherButton(false);
            Animated.timing(breathButtonOpacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }).start();
          }}
          style={{
            opacity: breathButtonOpacity,
          }}
        />
      )}

      {gratitudeItem && (
        <GratitudeOverlay
          visible={!!gratitudeItem}
          onClose={() => setGratitudeItem(null)}
          itemName={gratitudeItem.name}
          itemId={gratitudeItem.id}
          itemType="ingredient"
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 4,
  },
  searchBar: {
    marginHorizontal: 20,
    marginVertical: 10,
    elevation: 0,
    borderRadius: 12,
  },
  searchInput: {
    fontSize: 16,
  },
  categoryContainer: {
    maxHeight: 50,
    marginBottom: 10,
  },
  categoryContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryChip: {
    marginRight: 8,
    borderRadius: 20,
  },
  selectedChip: {
    backgroundColor: '#4CAF50',
  },
  chipText: {
    fontSize: 14,
  },
  selectedChipText: {
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 28,
  },
});

export default PantryScreen;
