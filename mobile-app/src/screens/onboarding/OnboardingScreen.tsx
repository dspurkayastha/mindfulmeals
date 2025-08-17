import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import SunsetHeader from '../../components/common/SunsetHeader';
import MindfulButton from '../../components/common/MindfulButton';
import { colors as palette } from '../../utils/theme';

const OnboardingScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <SunsetHeader title="Swasthya Food" subtitle="Healthy Indian Meals Made Simple" />

        <View style={styles.features}>
          <Text style={styles.feature}>🍽️ Personalized Meal Planning</Text>
          <Text style={styles.feature}>🥘 Regional Indian Cuisine</Text>
          <Text style={styles.feature}>💰 Budget-Friendly Options</Text>
          <Text style={styles.feature}>🏥 Health Goal Tracking</Text>
        </View>
        
        <MindfulButton title="Get Started" onPress={() => navigation.navigate('MainTabs')} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  features: { marginBottom: 40 },
  feature: { fontSize: 16, color: palette.textPrimary, marginBottom: 12, textAlign: 'center' },
});

export default OnboardingScreen;
