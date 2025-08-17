import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  useTheme,
  IconButton,
  Chip,
  HelperText,
  Card,
  Divider,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from '../../hooks/useTranslation';
import { useUpdatePantryItem } from '../../hooks/api/usePantryItems';
import { showToast } from '../../utils/toast';
import { MindfulLoader } from '../../components/mindfulness';

interface PantryItemForm {
  name: string;
  category: string;
  quantity: string;
  unit: string;
  expiryDate: Date | null;
  notes: string;
  lowStockThreshold?: string;
}

const CATEGORIES = [
  { key: 'produce', label: 'Produce', icon: '🥬' },
  { key: 'dairy', label: 'Dairy', icon: '🥛' },
  { key: 'proteins', label: 'Proteins', icon: '🍗' },
  { key: 'grains', label: 'Grains', icon: '🌾' },
  { key: 'condiments', label: 'Condiments', icon: '🧂' },
  { key: 'snacks', label: 'Snacks', icon: '🍪' },
  { key: 'beverages', label: 'Beverages', icon: '🥤' },
  { key: 'frozen', label: 'Frozen', icon: '🧊' },
  { key: 'other', label: 'Other', icon: '📦' },
];

const UNITS = [
  'pieces', 'kg', 'g', 'L', 'ml', 'cups', 'tbsp', 'tsp', 'oz', 'lb', 'pack', 'bunch', 'can', 'jar', 'bottle', 'bag'
];

const EditPantryItemScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const { mutate: updatePantryItem, isLoading } = useUpdatePantryItem();
  
  const item = route.params?.item;
  
  const [form, setForm] = useState<PantryItemForm>({
    name: item?.name || '',
    category: item?.category || '',
    quantity: item?.quantity?.toString() || '',
    unit: item?.unit || 'pieces',
    expiryDate: item?.expiryDate ? new Date(item.expiryDate) : null,
    notes: item?.notes || '',
    lowStockThreshold: item?.lowStockThreshold?.toString() || '',
  });
  
  const [errors, setErrors] = useState<Partial<PantryItemForm>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Track if any changes were made
    const changed = 
      form.name !== item?.name ||
      form.category !== item?.category ||
      form.quantity !== item?.quantity?.toString() ||
      form.unit !== item?.unit ||
      form.notes !== (item?.notes || '') ||
      form.lowStockThreshold !== (item?.lowStockThreshold?.toString() || '') ||
      (form.expiryDate?.toISOString() !== item?.expiryDate);
    
    setHasChanges(changed);
  }, [form, item]);

  const validateForm = (): boolean => {
    const newErrors: Partial<PantryItemForm> = {};
    
    if (!form.name.trim()) {
      newErrors.name = 'Item name is required';
    }
    
    if (!form.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (!form.quantity || isNaN(Number(form.quantity)) || Number(form.quantity) <= 0) {
      newErrors.quantity = 'Please enter a valid quantity';
    }
    
    if (form.lowStockThreshold && (isNaN(Number(form.lowStockThreshold)) || Number(form.lowStockThreshold) < 0)) {
      newErrors.lowStockThreshold = 'Please enter a valid threshold';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showToast({
        message: 'Please fix the errors before continuing',
        preset: 'error',
      });
      return;
    }

    if (!hasChanges) {
      showToast({
        message: 'No changes made',
        preset: 'info',
      });
      navigation.goBack();
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would update in backend
      const updatedItem = {
        ...item,
        ...form,
        quantity: Number(form.quantity),
        lowStockThreshold: form.lowStockThreshold ? Number(form.lowStockThreshold) : undefined,
        updatedAt: new Date().toISOString(),
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      showToast({
        message: `${form.name} updated successfully!`,
        preset: 'success',
      });

      navigation.goBack();
    } catch (error) {
      showToast({
        message: 'Failed to update item. Please try again.',
        preset: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setForm({ ...form, expiryDate: selectedDate });
    }
  };

  const updateField = (field: keyof PantryItemForm, value: any) => {
    setForm({ ...form, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleQuickQuantityChange = (change: number) => {
    const currentQty = Number(form.quantity) || 0;
    const newQty = Math.max(0, currentQty + change);
    updateField('quantity', newQty.toString());
  };

  if (isSubmitting) {
    return (
      <View style={styles.loadingContainer}>
        <MindfulLoader 
          duration="short" 
          message="Updating your pantry..." 
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.title}>Edit Pantry Item</Text>
          <View style={{ width: 48 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Card style={styles.formCard}>
            <Card.Content>
              <TextInput
                label="Item Name *"
                value={form.name}
                onChangeText={(text) => updateField('name', text)}
                mode="outlined"
                error={!!errors.name}
                style={styles.input}
              />
              <HelperText type="error" visible={!!errors.name}>
                {errors.name}
              </HelperText>

              <Text style={styles.sectionTitle}>Category *</Text>
              <View style={styles.categoryGrid}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.key}
                    onPress={() => updateField('category', cat.key)}
                    style={[
                      styles.categoryChip,
                      form.category === cat.key && styles.categoryChipSelected,
                    ]}
                  >
                    <Text style={styles.categoryIcon}>{cat.icon}</Text>
                    <Text style={[
                      styles.categoryLabel,
                      form.category === cat.key && styles.categoryLabelSelected,
                    ]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <HelperText type="error" visible={!!errors.category}>
                {errors.category}
              </HelperText>

              <View style={styles.quantitySection}>
                <View style={styles.quantityRow}>
                  <TextInput
                    label="Quantity *"
                    value={form.quantity}
                    onChangeText={(text) => updateField('quantity', text)}
                    mode="outlined"
                    keyboardType="numeric"
                    error={!!errors.quantity}
                    style={[styles.input, styles.quantityInput]}
                  />
                  
                  <View style={styles.quickButtons}>
                    <IconButton
                      icon="minus"
                      mode="contained"
                      size={20}
                      onPress={() => handleQuickQuantityChange(-1)}
                      style={styles.quickButton}
                    />
                    <IconButton
                      icon="plus"
                      mode="contained"
                      size={20}
                      onPress={() => handleQuickQuantityChange(1)}
                      style={styles.quickButton}
                    />
                  </View>
                </View>
                
                <View style={styles.unitSelector}>
                  <Text style={styles.unitLabel}>Unit</Text>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.unitScroll}
                  >
                    {UNITS.map((unit) => (
                      <Chip
                        key={unit}
                        selected={form.unit === unit}
                        onPress={() => updateField('unit', unit)}
                        style={styles.unitChip}
                      >
                        {unit}
                      </Chip>
                    ))}
                  </ScrollView>
                </View>
              </View>
              <HelperText type="error" visible={!!errors.quantity}>
                {errors.quantity}
              </HelperText>

              <TextInput
                label="Low Stock Alert (Optional)"
                value={form.lowStockThreshold}
                onChangeText={(text) => updateField('lowStockThreshold', text)}
                mode="outlined"
                keyboardType="numeric"
                placeholder="Alert when quantity drops below"
                error={!!errors.lowStockThreshold}
                style={styles.input}
              />
              <HelperText type="info" visible={!errors.lowStockThreshold}>
                Get notified when running low on this item
              </HelperText>
              <HelperText type="error" visible={!!errors.lowStockThreshold}>
                {errors.lowStockThreshold}
              </HelperText>

              <Divider style={styles.divider} />

              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.datePickerButton}
              >
                <IconButton icon="calendar" size={20} />
                <View style={styles.datePickerContent}>
                  <Text style={styles.datePickerLabel}>Expiry Date (Optional)</Text>
                  <Text style={styles.datePickerValue}>
                    {form.expiryDate 
                      ? form.expiryDate.toLocaleDateString()
                      : 'Not set'}
                  </Text>
                </View>
                {form.expiryDate && (
                  <IconButton
                    icon="close"
                    size={20}
                    onPress={() => updateField('expiryDate', null)}
                  />
                )}
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={form.expiryDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                />
              )}

              <TextInput
                label="Notes (Optional)"
                value={form.notes}
                onChangeText={(text) => updateField('notes', text)}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.input}
              />
            </Card.Content>
          </Card>

          {hasChanges && (
            <View style={styles.changesIndicator}>
              <IconButton icon="information" size={20} iconColor={colors.primary} />
              <Text style={styles.changesText}>
                You have unsaved changes
              </Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading || !hasChanges}
            style={styles.submitButton}
          >
            Save Changes
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  formCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  input: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryChipSelected: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 6,
  },
  categoryLabel: {
    fontSize: 14,
  },
  categoryLabelSelected: {
    fontWeight: '600',
    color: '#2E7D32',
  },
  quantitySection: {
    marginBottom: 8,
  },
  quantityRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-end',
  },
  quantityInput: {
    flex: 1,
  },
  quickButtons: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 8,
  },
  quickButton: {
    margin: 0,
    backgroundColor: '#E8F5E9',
  },
  unitSelector: {
    marginTop: 8,
  },
  unitLabel: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.7,
  },
  unitScroll: {
    maxHeight: 40,
  },
  unitChip: {
    marginRight: 8,
    height: 36,
  },
  divider: {
    marginVertical: 16,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingRight: 8,
  },
  datePickerContent: {
    flex: 1,
    marginLeft: -8,
  },
  datePickerLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  datePickerValue: {
    fontSize: 16,
    marginTop: 2,
  },
  changesIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  changesText: {
    flex: 1,
    fontSize: 14,
    color: '#1565C0',
    marginLeft: -8,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1,
  },
});

export default EditPantryItemScreen;