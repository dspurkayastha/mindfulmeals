import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';

const ShoppingScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Shopping</Text>
          <Text style={styles.headerSubtitle}>Order groceries online</Text>
        </View>
        
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
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollView: { flex: 1 },
  header: { padding: 20, backgroundColor: '#2196F3', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 4 },
  headerSubtitle: { fontSize: 16, color: 'white', opacity: 0.9 },
  card: { margin: 20, elevation: 2 },
  button: { marginTop: 12, backgroundColor: '#2196F3' },
});

export default ShoppingScreen;
