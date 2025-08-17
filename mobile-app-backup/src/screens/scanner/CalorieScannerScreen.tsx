import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Card, Text, useTheme, ActivityIndicator } from 'react-native-paper';
import SunsetHeader from '../../components/common/SunsetHeader';
import MindfulButton from '../../components/common/MindfulButton';

const CalorieScannerScreen: React.FC<ScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<null | { calories: number; carbs: number; protein: number; fat: number }>(null);

  const handleScan = () => {
    setIsScanning(true);
    setResult(null);
    setTimeout(() => {
      setResult({ calories: 312, carbs: 42, protein: 9, fat: 11 });
      setIsScanning(false);
    }, 1800);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <SunsetHeader title="Calorie Scanner" subtitle="Point at your meal to estimate nutrition" />

      <View style={styles.content}>
        <Card style={styles.cameraCard}>
          <Card.Content style={styles.cameraContent}>
            {isScanning ? (
              <ActivityIndicator />
            ) : (
              <Text variant="bodyMedium" style={{ opacity: 0.7 }}>Camera preview placeholder</Text>
            )}
          </Card.Content>
        </Card>

        <MindfulButton title={isScanning ? 'Scanning…' : 'Scan Calories'} onPress={handleScan} disabled={isScanning} />

        {result && (
          <Card style={styles.resultCard}>
            <Card.Content>
              <Text variant="titleMedium">Estimated Nutrition</Text>
              <Text style={styles.resultText}>Calories: {result.calories} kcal</Text>
              <Text style={styles.resultText}>Carbs: {result.carbs} g</Text>
              <Text style={styles.resultText}>Protein: {result.protein} g</Text>
              <Text style={styles.resultText}>Fat: {result.fat} g</Text>
            </Card.Content>
          </Card>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, gap: 16 },
  cameraCard: { height: 240, borderRadius: 16, overflow: 'hidden' },
  cameraContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  resultCard: { borderRadius: 16 },
  resultText: { marginTop: 6 },
});

export default CalorieScannerScreen;