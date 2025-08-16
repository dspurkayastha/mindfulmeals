import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';

const CommunityScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Community</Text>
          <Text style={styles.headerSubtitle}>Share recipes and tips</Text>
        </View>
        
        <Card style={styles.card}>
          <Card.Content>
            <Title>Share Recipe</Title>
            <Paragraph>Share your family recipes with the community</Paragraph>
            <Button mode="contained" style={styles.button}>Share Recipe</Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollView: { flex: 1 },
  header: { padding: 20, backgroundColor: '#9C27B0', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 4 },
  headerSubtitle: { fontSize: 16, color: 'white', opacity: 0.9 },
  card: { margin: 20, elevation: 2 },
  button: { marginTop: 12, backgroundColor: '#9C27B0' },
});

export default CommunityScreen;
