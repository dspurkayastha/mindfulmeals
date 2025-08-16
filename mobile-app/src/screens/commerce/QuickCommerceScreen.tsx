import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import SunsetHeader from '../../components/common/SunsetHeader';
import MindfulButton from '../../components/common/MindfulButton';

const QuickCommerceScreen: React.FC<ScreenProps> = () => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <SunsetHeader title="Quick Commerce" subtitle="Order from your favorite vendors" />
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Vendors</Text>
            <View style={styles.actions}>
              <MindfulButton title="Blinkit" onPress={() => {}} />
              <MindfulButton title="Zepto" onPress={() => {}} variant="secondary" />
              <MindfulButton title="Swiggy Instamart" onPress={() => {}} />
            </View>
          </Card.Content>
        </Card>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  card: { borderRadius: 16 },
  actions: { marginTop: 12, gap: 12 },
});

export default QuickCommerceScreen;