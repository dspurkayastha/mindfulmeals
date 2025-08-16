import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Card, Title, Paragraph, Button, useTheme } from 'react-native-paper';
import SunsetHeader from '../../components/common/SunsetHeader';

const ShoppingScreen = () => {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <SunsetHeader title="Shopping" subtitle="Order groceries online" />
        
        <Card style={styles.card}>
          <Card.Content>
            <Title>Quick Commerce</Title>
            <Paragraph>Order from Blinkit, Zepto, or Swiggy</Paragraph>
            <Button mode="contained" style={styles.button}>Start Shopping</Button>
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
  button: { marginTop: 12, backgroundColor: '#2196F3' },
});

export default ShoppingScreen;
