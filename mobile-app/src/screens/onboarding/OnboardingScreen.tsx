import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Button } from 'react-native-paper';
import SunsetHeader from '../../components/common/SunsetHeader';

const OnboardingScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
              <View style={styles.content}>
          <SunsetHeader title="Swasthya Food" subtitle="Healthy Indian Meals Made Simple" />

          <View style={styles.features}>
            <Text style={styles.feature}>🍽️ Personalized Meal Planning</Text>
            <Text style={styles.feature}>🥘 Regional Indian Cuisine</Text>
            <Text style={styles.feature}>💰 Budget-Friendly Options</Text>
            <Text style={styles.feature}>🏥 Health Goal Tracking</Text>
          </View>
          
          <Button
            mode="contained"
            style={styles.button}
            onPress={() => navigation.navigate('MainTabs')}
          >
            Get Started
          </Button>
        </View>
</SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4CAF50' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  title: { fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 16 },
  subtitle: { fontSize: 18, color: 'white', textAlign: 'center', marginBottom: 40 },
  features: { marginBottom: 40 },
  feature: { fontSize: 16, color: 'white', marginBottom: 12, textAlign: 'center' },
  button: { backgroundColor: 'white', color: '#4CAF50', paddingHorizontal: 32 },
});

export default OnboardingScreen;
