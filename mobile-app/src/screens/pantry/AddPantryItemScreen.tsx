import React, { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from '../../hooks/useTranslation';
import { useAddPantryItem } from '../../hooks/api/usePantryItems';
import { showToast } from '../../utils/toast';
import { MindfulLoader } from '../../components/mindfulness';
import MilestoneService from '../../services/MilestoneService';

interface PantryItemForm {
  name: string;
  category: string;
  quantity: string;
  unit: string;
  expiryDate: Date | null;
  notes: string;
  barcode?: string;
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

const AddPantryItemScreen = ({ route }: any) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { mutate: addPantryItem, isLoading } = useAddPantryItem();
  
  const [form, setForm] = useState<PantryItemForm>({
    name: '',
    category: '',
    quantity: '',
    unit: 'pieces',
    expiryDate: null,
    notes: '',
    barcode: route?.params?.barcode || '',
  });
  
  const [errors, setErrors] = useState<Partial<PantryItemForm>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showToast({
        message: 'Please fill in all required fields',
        preset: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would save to backend
      const newItem = {
        ...form,
        quantity: Number(form.quantity),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Track milestone
      await MilestoneService.trackPantryItem();

      showToast({
        message: `${form.name} added to your pantry!`,
        preset: 'success',
      });

      navigation.goBack();
    } catch (error) {
      showToast({
        message: 'Failed to add item. Please try again.',
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

  if (isSubmitting) {
    return (
      <View style={styles.loadingContainer}>
        <MindfulLoader 
          duration="short" 
          message="Adding to your mindful pantry..." 
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
          <Text style={styles.title}>Add Pantry Item</Text>
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
                placeholder="e.g., Brown Rice, Fresh Spinach"
                error={!!errors.name}
                autoCapitalize="words"
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
                placeholder="e.g., Organic, bought from farmer's market"
                style={styles.input}
              />

              {form.barcode ? (
                <View style={styles.barcodeInfo}>
                  <IconButton icon="barcode" size={20} />
                  <Text style={styles.barcodeText}>Barcode: {form.barcode}</Text>
                </View>
              ) : null}
            </Card.Content>
          </Card>

          <View style={styles.mindfulTip}>
            <IconButton icon="meditation" size={20} iconColor={colors.primary} />
            <Text style={styles.mindfulTipText}>
              Take a moment to appreciate this ingredient and its journey to your pantry
            </Text>
          </View>
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
            disabled={isLoading}
            style={styles.submitButton}
          >
            Add to Pantry
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
  quantityRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  quantityInput: {
    flex: 1,
  },
  unitSelector: {
    flex: 2,
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
  barcodeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  barcodeText: {
    fontSize: 14,
    marginLeft: -8,
  },
  mindfulTip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  mindfulTipText: {
    flex: 1,
    fontSize: 14,
    color: '#1B5E20',
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

export default AddPantryItemScreen;