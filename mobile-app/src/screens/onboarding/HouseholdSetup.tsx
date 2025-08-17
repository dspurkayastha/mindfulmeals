// mobile-app/src/screens/onboarding/HouseholdSetup.tsx
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { 
  TextInput, 
  Button, 
  Card, 
  Text, 
  HelperText,
  useTheme,
  RadioButton,
  ActivityIndicator,
} from 'react-native-paper';
import { useTranslation } from '@/hooks/useTranslation';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

// Mock hook until backend is ready
const useCreateHousehold = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const mutate = async (data: any, options: any) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      Toast.show({
        type: 'success',
        text1: 'Household created!',
        text2: 'Welcome to your mindful journey',
      });
      options.onSuccess?.();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: 'Please try again',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return { mutate, isLoading };
};

export const HouseholdSetupScreen: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    householdName: '',
    region: 'north',
    dietaryType: 'vegetarian',
    budgetMonthly: '',
    primaryUserName: '',
  });
  
  const { mutate: createHousehold, isLoading } = useCreateHousehold();

  const handleSubmit = () => {
    if (!formData.householdName || !formData.primaryUserName) {
      Toast.show({
        type: 'error',
        text1: 'Please fill required fields',
        text2: 'Household name and your name are required',
      });
      return;
    }

    createHousehold({
      name: formData.householdName,
      region: formData.region,
      dietaryType: formData.dietaryType,
      budgetMonthly: formData.budgetMonthly ? parseInt(formData.budgetMonthly) : undefined,
      primaryUser: {
        name: formData.primaryUserName,
      },
    }, {
      onSuccess: () => navigation.navigate('Home' as never),
    });
  };

  const regions = [
    { label: 'North India', value: 'north' },
    { label: 'South India', value: 'south' },
    { label: 'East India', value: 'east' },
    { label: 'West India', value: 'west' },
  ];

  const dietaryTypes = [
    { label: 'Vegetarian', value: 'vegetarian' },
    { label: 'Non-Vegetarian', value: 'non-vegetarian' },
    { label: 'Vegan', value: 'vegan' },
    { label: 'Jain', value: 'jain' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineMedium" style={styles.title}>
            {t('household.setup')}
          </Text>
          
          <Text variant="bodyLarge" style={styles.subtitle}>
            Let's set up your mindful household
          </Text>

          {/* Household Name */}
          <TextInput
            label={t('household.name')}
            value={formData.householdName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, householdName: text }))}
            mode="outlined"
            style={styles.input}
            placeholder="e.g., The Sharma Family"
          />

          {/* Region Selection */}
          <Text variant="titleMedium" style={styles.sectionTitle}>
            {t('household.region')}
          </Text>
          <RadioButton.Group
            onValueChange={(value) => setFormData(prev => ({ ...prev, region: value }))}
            value={formData.region}
          >
            {regions.map((region) => (
              <RadioButton.Item
                key={region.value}
                label={region.label}
                value={region.value}
                mode="android"
                style={styles.radioItem}
              />
            ))}
          </RadioButton.Group>

          {/* Dietary Preference */}
          <Text variant="titleMedium" style={styles.sectionTitle}>
            {t('household.dietary')}
          </Text>
          <RadioButton.Group
            onValueChange={(value) => setFormData(prev => ({ ...prev, dietaryType: value }))}
            value={formData.dietaryType}
          >
            {dietaryTypes.map((diet) => (
              <RadioButton.Item
                key={diet.value}
                label={diet.label}
                value={diet.value}
                mode="android"
                style={styles.radioItem}
              />
            ))}
          </RadioButton.Group>

          {/* Budget */}
          <TextInput
            label={t('household.budget')}
            value={formData.budgetMonthly}
            onChangeText={(text) => setFormData(prev => ({ ...prev, budgetMonthly: text }))}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            placeholder="Optional - helps with meal planning"
            left={<TextInput.Affix text="₹" />}
          />
          <HelperText type="info">
            We'll suggest meals within your budget
          </HelperText>

          {/* Primary User Name */}
          <TextInput
            label="Your Name"
            value={formData.primaryUserName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, primaryUserName: text }))}
            mode="outlined"
            style={styles.input}
            placeholder="How should we address you?"
          />

          {/* Submit Button */}
          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={isLoading}
            style={styles.submitButton}
            contentStyle={styles.submitButtonContent}
          >
            {isLoading ? (
              <ActivityIndicator color={theme.colors.onPrimary} />
            ) : (
              t('household.createHousehold')
            )}
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    elevation: 2,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 24,
    textAlign: 'center',
    opacity: 0.8,
  },
  input: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 8,
  },
  radioItem: {
    paddingVertical: 4,
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 16,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
});