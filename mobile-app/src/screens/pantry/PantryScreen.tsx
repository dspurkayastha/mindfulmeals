import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Card, Title, Paragraph, Button, useTheme } from 'react-native-paper';
import SunsetHeader from '../../components/common/SunsetHeader';
import MindfulButton from '../../components/common/MindfulButton';
import { colors as palette } from '../../utils/theme';

const PantryScreen = () => {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <SunsetHeader title="Pantry" subtitle="Manage your ingredients" />
        
        <Card style={styles.card}>
          <Card.Content>
            <Title>Add Item</Title>
            <Paragraph>Scan barcode or add manually</Paragraph>
            <MindfulButton title="Add Item" onPress={() => {}} />
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  card: { margin: 20, elevation: 2 },
});

export default PantryScreen;
