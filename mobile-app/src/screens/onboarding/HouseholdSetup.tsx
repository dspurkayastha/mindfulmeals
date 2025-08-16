// mobile-app/src/screens/onboarding/HouseholdSetup.tsx
import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useTranslation } from '../../hooks/useTranslation';
import { Button, Input, Select, Card, Text } from '../../components/common';
import { VoiceInput } from '../../components/voice/VoiceInput';
import { useCreateHousehold } from '../../hooks/api/useUser';

export const HouseholdSetupScreen: React.FC<ScreenProps> = ({ navigation }) => {
  const { t, language } = useTranslation();
  const [formData, setFormData] = useState({
    householdName: '',
    region: '',
    dietaryType: 'vegetarian',
    budgetMonthly: '',
    primaryUserName: '',
    primaryUserAge: '',
  });
  
  const { mutate: createHousehold, isLoading } = useCreateHousehold();

  const handleVoiceInput = (field: string, transcript: string) => {
    setFormData(prev => ({ ...prev, [field]: transcript }));
  };

  const handleSubmit = () => {
    createHousehold({
      name: formData.householdName,
      region: formData.region,
      dietaryType: formData.dietaryType,
      budgetMonthly: formData.budgetMonthly ? parseInt(formData.budgetMonthly) : undefined,
      primaryUser: {
        name: formData.primaryUserName,
        ageGroup: formData.primaryUserAge,
        languagePreference: language,
      },
    }, {
      onSuccess: () => navigation.navigate('DietaryPreferences'),
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.formCard}>
        <Text variant="heading" style={styles.title}>
          {t('onboarding.household.title')}
        </Text>
        
        <Text variant="body" style={styles.subtitle}>
          {t('onboarding.household.subtitle')}
        </Text>

        {/* Household Name with Voice Input */}
        <View style={styles.inputGroup}>
          <Text variant="label">{t('onboarding.household.name')}</Text>
          <View style={styles.inputWithVoice}>
            <Input
              value={formData.householdName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, householdName: text }))}
              placeholder={t('onboarding.household.namePlaceholder')}
              style={styles.input}
            />
            <VoiceInput
              onTranscript={(transcript) => handleVoiceInput('householdName', transcript)}
              language={language}
            />
          </View>
        </View>

        {/* Regional Cuisine Preference */}
        <View style={styles.inputGroup}>
          <Text variant="label">{t('onboarding.household.region')}</Text>
          <Select
            value={formData.region}
            onValueChange={(value) => setFormData(prev => ({ ...prev, region: value }))}
            options={[
              { label: t('regions.northIndian'), value: 'north_indian' },
              { label: t('regions.southIndian'), value: 'south_indian' },
              { label: t('regions.gujarati'), value: 'gujarati' },
              { label: t('regions.bengali'), value: 'bengali' },
              { label: t('regions.punjabi'), value: 'punjabi' },
              { label: t('regions.rajasthani'), value: 'rajasthani' },
            ]}
          />
        </View>

        {/* Dietary Type */}
        <View style={styles.inputGroup}>
          <Text variant="label">{t('onboarding.household.dietaryType')}</Text>
          <Select
            value={formData.dietaryType}
            onValueChange={(value) => setFormData(prev => ({ ...prev, dietaryType: value }))}
            options={[
              { label: t('dietary.vegetarian'), value: 'vegetarian' },
              { label: t('dietary.nonVegetarian'), value: 'non_vegetarian' },
              { label: t('dietary.vegan'), value: 'vegan' },
              { label: t('dietary.eggetarian'), value: 'eggetarian' },
            ]}
          />
        </View>

        {/* Budget (Optional) */}
        <View style={styles.inputGroup}>
          <Text variant="label">{t('onboarding.household.budget')}</Text>
          <Input
            value={formData.budgetMonthly}
            onChangeText={(text) => setFormData(prev => ({ ...prev, budgetMonthly: text }))}
            placeholder={t('onboarding.household.budgetPlaceholder')}
            keyboardType="numeric"
            leftIcon="rupee"
          />
        </View>

        {/* Primary User Info */}
        <Text variant="subheading" style={styles.sectionTitle}>
          {t('onboarding.household.primaryUser')}
        </Text>

        <View style={styles.inputGroup}>
          <Text variant="label">{t('onboarding.household.userName')}</Text>
          <View style={styles.inputWithVoice}>
            <Input
              value={formData.primaryUserName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, primaryUserName: text }))}
              placeholder={t('onboarding.household.userNamePlaceholder')}
            />
            <VoiceInput
              onTranscript={(transcript) => handleVoiceInput('primaryUserName', transcript)}
              language={language}
            />
          </View>
        </View>

        <Button
          title={t('common.continue')}
          onPress={handleSubmit}
          loading={isLoading}
          disabled={!formData.householdName || !formData.region || !formData.primaryUserName}
          style={styles.submitButton}
        />
      </Card>
    </ScrollView>
  );
};