import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Card, Title, Paragraph, Button, useTheme } from 'react-native-paper';
import SunsetHeader from '../../components/common/SunsetHeader';

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
            <Button mode="contained" style={styles.button}>Add Item</Button>
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
  button: { marginTop: 12, backgroundColor: '#FF9800' },
});

export default PantryScreen;
