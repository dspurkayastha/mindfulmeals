import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Card, Title, Paragraph, Button, useTheme } from 'react-native-paper';
import SunsetHeader from '../../components/common/SunsetHeader';
import MindfulButton from '../../components/common/MindfulButton';

const ProfileScreen = () => {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <SunsetHeader title="Profile" subtitle="Manage your account" />
        
        <Card style={styles.card}>
          <Card.Content>
            <Title>Household Settings</Title>
            <Paragraph>Manage family members and preferences</Paragraph>
            <MindfulButton title="Edit Profile" onPress={() => {}} />
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
  button: { marginTop: 12, backgroundColor: '#607D8B' },
});

export default ProfileScreen;
