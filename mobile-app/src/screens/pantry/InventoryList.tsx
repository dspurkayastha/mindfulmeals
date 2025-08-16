// mobile-app/src/screens/pantry/InventoryList.tsx
import React, { useState } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from '../../hooks/useTranslation';
import { PantryItem, SearchBar, FilterChips, FloatingActionButton } from '../../components';
import { usePantryItems, useAddPantryItem } from '../../hooks/api/useInventory';
import { BarCodeScanner } from '../../components/barcode/BarCodeScanner';

export const InventoryListScreen: React.FC<ScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showScanner, setShowScanner] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { 
    data: pantryItems, 
    isLoading, 
    refetch,
    groupedByCategory,
    expiringItems,
    lowStockItems 
  } = usePantryItems();

  const { mutate: addPantryItem } = useAddPantryItem();

  const handleBarcodeScanned = async (barcode: string) => {
    setShowScanner(false);
    try {
      // Navigate to add item screen with barcode pre-filled
      navigation.navigate('AddPantryItem', { barcode });
    } catch (error) {
      // Handle barcode lookup error
      showToast(t('pantry.barcodeError'));
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const filteredItems = pantryItems?.filter(item => {
    const matchesSearch = item.ingredient.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.ingredient.nameHindi?.includes(searchQuery);
    
    const matchesFilter = selectedFilter === 'all' ||
                         (selectedFilter === 'expiring' && expiringItems.includes(item.id)) ||
                         (selectedFilter === 'low_stock' && lowStockItems.includes(item.id)) ||
                         (selectedFilter === item.ingredient.category);
    
    return matchesSearch && matchesFilter;
  });

  const renderPantryItem = ({ item }) => (
    <PantryItem
      item={item}
      onPress={() => navigation.navigate('PantryItemDetails', { itemId: item.id })}
      onEdit={() => navigation.navigate('EditPantryItem', { itemId: item.id })}
      onUse={() => handleUseItem(item.id)}
      showExpiryWarning={expiringItems.includes(item.id)}
      showLowStockWarning={lowStockItems.includes(item.id)}
    />
  );

  const filterOptions = [
    { key: 'all', label: t('pantry.filters.all') },
    { key: 'expiring', label: t('pantry.filters.expiring'), count: expiringItems.length },
    { key: 'low_stock', label: t('pantry.filters.lowStock'), count: lowStockItems.length },
    { key: 'cereals', label: t('categories.cereals') },
    { key: 'pulses', label: t('categories.pulses') },
    { key: 'vegetables', label: t('categories.vegetables') },
    { key: 'spices', label: t('categories.spices') },
  ];

  if (showScanner) {
    return (
      <BarCodeScanner
        onBarcodeScanned={handleBarcodeScanned}
        onClose={() => setShowScanner(false)}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Search and Filters */}
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('pantry.searchPlaceholder')}
          voiceEnabled={true}
          language="hindi"
        />
      </View>

      <FilterChips
        options={filterOptions}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        style={styles.filters}
      />

      {/* Alerts Section */}
      {(expiringItems.length > 0 || lowStockItems.length > 0) && (
        <View style={styles.alertsSection}>
          {expiringItems.length > 0 && (
            <AlertCard
              type="warning"
              icon="clock"
              title={t('pantry.expiringAlert')}
              message={t('pantry.expiringCount', { count: expiringItems.length })}
              onPress={() => navigation.navigate('ExpiringItems')}
            />
          )}
          {lowStockItems.length > 0 && (
            <AlertCard
              type="info"
              icon="shopping-cart"
              title={t('pantry.lowStockAlert')}
              message={t('pantry.lowStockCount', { count: lowStockItems.length })}
              onPress={() => navigation.navigate('ShoppingList')}
            />
          )}
        </View>
      )}

      {/* Pantry Items List */}
      <FlatList
        data={filteredItems}
        renderItem={renderPantryItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="package"
            title={t('pantry.empty.title')}
            message={t('pantry.empty.message')}
            actionText={t('pantry.empty.action')}
            onAction={() => setShowScanner(true)}
          />
        }
        contentContainerStyle={styles.listContainer}
      />

      {/* Floating Action Buttons */}
      <View style={styles.fab}>
        <FloatingActionButton
          icon="camera"
          onPress={() => setShowScanner(true)}
          label={t('pantry.scanBarcode')}
          style={styles.scanFab}
        />
        <FloatingActionButton
          icon="plus"
          onPress={() => navigation.navigate('AddPantryItem')}
          label={t('pantry.addManually')}
          style={styles.addFab}
        />
      </View>
    </View>
  );
};