import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SectionList,
  TouchableOpacity,
  Share,
  Linking,
} from 'react-native';
import {
  Text,
  useTheme,
  Card,
  Checkbox,
  IconButton,
  FAB,
  Chip,
  Button,
  Divider,
  Portal,
  Modal,
  Surface,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '../../hooks/useTranslation';
import { MindfulLoader, FloatingBreatherButton } from '../../components/mindfulness';
import { showToast } from '../../utils/toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MilestoneService from '../../services/MilestoneService';

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  checked: boolean;
  fromMealPlan?: string;
  seasonal?: boolean;
  locallySourced?: boolean;
}

interface ShoppingSection {
  title: string;
  data: ShoppingItem[];
}

const EXTERNAL_APPS = [
  { name: 'Blinkit', url: 'blinkit://app', color: '#FFC300' },
  { name: 'Zepto', url: 'zepto://app', color: '#FF6B6B' },
  { name: 'Swiggy', url: 'swiggy://instamart', color: '#FC8019' },
];

const SEASONAL_ITEMS = {
  winter: ['oranges', 'carrots', 'cauliflower', 'spinach', 'mustard greens'],
  summer: ['mangoes', 'watermelon', 'cucumber', 'tomatoes', 'corn'],
  monsoon: ['okra', 'bottle gourd', 'bitter gourd', 'corn', 'peaches'],
  autumn: ['apples', 'pomegranate', 'guava', 'sweet potato', 'pumpkin'],
};

const ShoppingListScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPreShoppingBreather, setShowPreShoppingBreather] = useState(false);
  const [showIngredientAppreciation, setShowIngredientAppreciation] = useState(false);
  const [appreciationItem, setAppreciationItem] = useState<ShoppingItem | null>(null);
  const [checkedCount, setCheckedCount] = useState(0);

  useEffect(() => {
    loadShoppingList();
  }, []);

  useEffect(() => {
    const checked = shoppingList.filter(item => item.checked).length;
    setCheckedCount(checked);
    
    // Show appreciation prompt after checking 3 items
    if (checked === 3 && checked < shoppingList.length) {
      const uncheckedItem = shoppingList.find(item => !item.checked);
      if (uncheckedItem) {
        setAppreciationItem(uncheckedItem);
        setShowIngredientAppreciation(true);
      }
    }
  }, [shoppingList]);

  const loadShoppingList = async () => {
    try {
      // Load from meal plans and pantry
      const mealPlans = await AsyncStorage.getItem('@meal_plans');
      const pantryItems = await AsyncStorage.getItem('@pantry_items');
      
      // Generate shopping list from meal plans
      const generatedList = await generateShoppingList(
        mealPlans ? JSON.parse(mealPlans) : [],
        pantryItems ? JSON.parse(pantryItems) : []
      );
      
      setShoppingList(generatedList);
    } catch (error) {
      console.error('Error loading shopping list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateShoppingList = async (mealPlans: any[], pantryItems: any[]): Promise<ShoppingItem[]> => {
    // Mock implementation - in real app, this would analyze meal plans
    const currentSeason = getCurrentSeason();
    const seasonalItems = SEASONAL_ITEMS[currentSeason] || [];
    
    return [
      {
        id: '1',
        name: 'Organic Spinach',
        quantity: 2,
        unit: 'bunches',
        category: 'produce',
        checked: false,
        fromMealPlan: 'Green Smoothie Bowl',
        seasonal: seasonalItems.includes('spinach'),
        locallySourced: true,
      },
      {
        id: '2',
        name: 'Almond Milk',
        quantity: 1,
        unit: 'L',
        category: 'dairy',
        checked: false,
        fromMealPlan: 'Morning Smoothie',
      },
      {
        id: '3',
        name: 'Quinoa',
        quantity: 500,
        unit: 'g',
        category: 'grains',
        checked: false,
        fromMealPlan: 'Power Protein Bowl',
      },
      {
        id: '4',
        name: 'Fresh Tomatoes',
        quantity: 6,
        unit: 'pieces',
        category: 'produce',
        checked: false,
        fromMealPlan: 'Mediterranean Salad',
        seasonal: seasonalItems.includes('tomatoes'),
      },
      {
        id: '5',
        name: 'Chickpeas',
        quantity: 2,
        unit: 'cans',
        category: 'proteins',
        checked: false,
        fromMealPlan: 'Protein Bowl',
      },
    ];
  };

  const getCurrentSeason = (): keyof typeof SEASONAL_ITEMS => {
    const month = new Date().getMonth();
    if (month >= 11 || month <= 1) return 'winter';
    if (month >= 2 && month <= 4) return 'summer';
    if (month >= 5 && month <= 8) return 'monsoon';
    return 'autumn';
  };

  const toggleItem = (id: string) => {
    setShoppingList(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const groupByCategory = (): ShoppingSection[] => {
    const grouped = shoppingList.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, ShoppingItem[]>);

    return Object.entries(grouped).map(([category, items]) => ({
      title: category.charAt(0).toUpperCase() + category.slice(1),
      data: items.sort((a, b) => Number(a.checked) - Number(b.checked)),
    }));
  };

  const shareList = async () => {
    const listText = shoppingList
      .filter(item => !item.checked)
      .map(item => `${item.quantity} ${item.unit} ${item.name}`)
      .join('\n');

    try {
      await Share.share({
        message: `My Mindful Shopping List:\n\n${listText}\n\nGenerated by MindfulMeals 🌱`,
        title: 'Shopping List',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const openInExternalApp = async (app: typeof EXTERNAL_APPS[0]) => {
    try {
      const supported = await Linking.canOpenURL(app.url);
      if (supported) {
        await Linking.openURL(app.url);
      } else {
        showToast({
          message: `${app.name} app not installed`,
          preset: 'info',
        });
      }
    } catch (error) {
      console.error('Error opening app:', error);
    }
  };

  const handleStartShopping = () => {
    setShowPreShoppingBreather(true);
  };

  const renderShoppingItem = ({ item }: { item: ShoppingItem }) => (
    <TouchableOpacity
      onPress={() => toggleItem(item.id)}
      onLongPress={() => {
        setAppreciationItem(item);
        setShowIngredientAppreciation(true);
      }}
    >
      <Card style={[styles.itemCard, item.checked && styles.itemChecked]}>
        <View style={styles.itemContent}>
          <Checkbox
            status={item.checked ? 'checked' : 'unchecked'}
            onPress={() => toggleItem(item.id)}
            color={colors.primary}
          />
          
          <View style={styles.itemDetails}>
            <Text
              style={[
                styles.itemName,
                item.checked && styles.itemNameChecked,
              ]}
            >
              {item.name}
            </Text>
            <Text style={styles.itemQuantity}>
              {item.quantity} {item.unit}
            </Text>
            
            <View style={styles.itemTags}>
              {item.fromMealPlan && (
                <Chip compact style={styles.mealPlanChip}>
                  {item.fromMealPlan}
                </Chip>
              )}
              {item.seasonal && (
                <Chip
                  compact
                  icon="leaf"
                  style={styles.seasonalChip}
                >
                  Seasonal
                </Chip>
              )}
              {item.locallySourced && (
                <Chip
                  compact
                  icon="map-marker"
                  style={styles.localChip}
                >
                  Local
                </Chip>
              )}
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <MindfulLoader
          duration="short"
          message="Preparing your mindful shopping list..."
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.title}>Shopping List</Text>
        <IconButton
          icon="share-variant"
          size={24}
          onPress={shareList}
        />
      </View>

      <View style={styles.progressContainer}>
        <LinearGradient
          colors={['#E8F5E9', '#C8E6C9']}
          style={styles.progressCard}
        >
          <Text style={styles.progressText}>
            {checkedCount} of {shoppingList.length} items
          </Text>
          <Text style={styles.progressSubtext}>
            {checkedCount === shoppingList.length
              ? '🎉 Shopping complete!'
              : 'Take your time, shop mindfully'}
          </Text>
        </LinearGradient>
      </View>

      <SectionList
        sections={groupByCategory()}
        keyExtractor={(item) => item.id}
        renderItem={renderShoppingItem}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
      />

      <View style={styles.externalApps}>
        <Text style={styles.externalAppsTitle}>Shop with:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {EXTERNAL_APPS.map((app) => (
            <TouchableOpacity
              key={app.name}
              onPress={() => openInExternalApp(app)}
              style={[styles.appButton, { backgroundColor: app.color }]}
            >
              <Text style={styles.appButtonText}>{app.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FAB
        icon="meditation"
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={handleStartShopping}
        label="Start Mindful Shopping"
      />

      {/* Pre-Shopping Breather Modal */}
      <Portal>
        <Modal
          visible={showPreShoppingBreather}
          onDismiss={() => setShowPreShoppingBreather(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Surface style={styles.breatherSurface}>
            <IconButton
              icon="close"
              size={24}
              onPress={() => setShowPreShoppingBreather(false)}
              style={styles.closeButton}
            />
            
            <Text style={styles.breatherTitle}>Pre-Shopping Mindfulness</Text>
            <Text style={styles.breatherText}>
              Before you shop, take a moment to center yourself.
              This helps you make conscious choices and appreciate
              the nourishment you're bringing home.
            </Text>
            
            <View style={styles.breatherAnimation}>
              <Text style={styles.breathIcon}>🧘</Text>
            </View>
            
            <Text style={styles.breatherInstruction}>
              Take 3 deep breaths with me...
            </Text>
            
            <Button
              mode="contained"
              onPress={() => {
                setShowPreShoppingBreather(false);
                showToast({
                  message: 'Enjoy your mindful shopping journey!',
                  preset: 'success',
                });
              }}
              style={styles.breatherButton}
            >
              I'm Ready to Shop
            </Button>
          </Surface>
        </Modal>
      </Portal>

      {/* Ingredient Appreciation Modal */}
      <Portal>
        <Modal
          visible={showIngredientAppreciation}
          onDismiss={() => setShowIngredientAppreciation(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Surface style={styles.appreciationSurface}>
            <Text style={styles.appreciationTitle}>
              Ingredient Appreciation
            </Text>
            
            {appreciationItem && (
              <>
                <Text style={styles.appreciationItem}>
                  {appreciationItem.name}
                </Text>
                
                <Text style={styles.appreciationPrompt}>
                  Where do you think this {appreciationItem.name} came from?
                  Take a moment to appreciate the journey from farm to your table.
                </Text>
                
                {appreciationItem.seasonal && (
                  <Chip icon="leaf" style={styles.appreciationChip}>
                    In season now! Peak freshness and flavor
                  </Chip>
                )}
                
                {appreciationItem.locallySourced && (
                  <Chip icon="map-marker" style={styles.appreciationChip}>
                    Locally grown - supporting nearby farmers
                  </Chip>
                )}
              </>
            )}
            
            <Button
              mode="outlined"
              onPress={() => setShowIngredientAppreciation(false)}
              style={styles.appreciationButton}
            >
              Continue Shopping
            </Button>
          </Surface>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  progressContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  progressCard: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1B5E20',
  },
  progressSubtext: {
    fontSize: 14,
    color: '#2E7D32',
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 140,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
  },
  itemCard: {
    marginHorizontal: 16,
    marginVertical: 4,
    elevation: 1,
  },
  itemChecked: {
    opacity: 0.6,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemNameChecked: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  itemTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  mealPlanChip: {
    height: 24,
    backgroundColor: '#E3F2FD',
  },
  seasonalChip: {
    height: 24,
    backgroundColor: '#FFF3E0',
  },
  localChip: {
    height: 24,
    backgroundColor: '#F3E5F5',
  },
  externalApps: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  externalAppsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  appButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
  },
  appButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 16,
  },
  modalContent: {
    padding: 20,
  },
  breatherSurface: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  breatherTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  breatherText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
    lineHeight: 24,
  },
  breatherAnimation: {
    marginVertical: 32,
  },
  breathIcon: {
    fontSize: 64,
  },
  breatherInstruction: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 24,
  },
  breatherButton: {
    paddingHorizontal: 32,
  },
  appreciationSurface: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  appreciationTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  appreciationItem: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 16,
  },
  appreciationPrompt: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
    lineHeight: 24,
  },
  appreciationChip: {
    marginBottom: 12,
  },
  appreciationButton: {
    marginTop: 16,
    paddingHorizontal: 32,
  },
});

export default ShoppingListScreen;