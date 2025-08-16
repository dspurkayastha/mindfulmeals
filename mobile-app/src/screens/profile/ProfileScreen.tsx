import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';

const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Text style={styles.headerSubtitle}>Manage your account</Text>
        </View>
        
        <Card style={styles.card}>
          <Card.Content>
            <Title>Household Settings</Title>
            <Paragraph>Manage family members and preferences</Paragraph>
            <Button mode="contained" style={styles.button}>Edit Profile</Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollView: { flex: 1 },
  header: { padding: 20, backgroundColor: '#607D8B', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 4 },
  headerSubtitle: { fontSize: 16, color: 'white', opacity: 0.9 },
  card: { margin: 20, elevation: 2 },
  button: { marginTop: 12, backgroundColor: '#607D8B' },
});

export default ProfileScreen;
