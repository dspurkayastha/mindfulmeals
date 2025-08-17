import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Card, Title, Paragraph, Button, useTheme } from 'react-native-paper';
import SunsetHeader from '../../components/common/SunsetHeader';
import MindfulButton from '../../components/common/MindfulButton';

const CommunityScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <SunsetHeader title="Community" subtitle="Share recipes and tips" />
        
        <Card style={styles.card}>
          <Card.Content>
            <Title>Share Recipe</Title>
            <Paragraph>Share your family recipes with the community</Paragraph>
            <MindfulButton title="Share Recipe" onPress={() => navigation.navigate('ShareRecipe')} />
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

export default CommunityScreen;
