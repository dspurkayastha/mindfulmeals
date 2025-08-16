import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Card, Text, useTheme, Switch } from 'react-native-paper';
import SunsetHeader from '../../components/common/SunsetHeader';
import MindfulButton from '../../components/common/MindfulButton';
import { useMindfulness } from '../../hooks/useMindfulness';

const WellnessScreen: React.FC<ScreenProps> = () => {
  const { colors } = useTheme();
  const [state, actions] = useMindfulness();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <SunsetHeader title="Wellness" subtitle="Mindful progress and practice" />
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Mindful Mode</Text>
            <View style={styles.row}>
              <Text>Enabled</Text>
              <Switch value={state.isMindfulMode} onValueChange={actions.toggleMindfulMode} />
            </View>
            <Text style={styles.quote}>{state.currentQuote}</Text>
            <View style={styles.actions}>
              <MindfulButton title="Refresh Quote" onPress={actions.refreshQuote} />
              <MindfulButton title="Start Mindful Eating" variant="secondary" onPress={actions.startMindfulEating} />
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Gratitude Journal</Text>
            {state.gratitudeJournal.length === 0 ? (
              <Text style={{ opacity: 0.7 }}>No entries yet</Text>
            ) : (
              state.gratitudeJournal.map((g, i) => (
                <Text key={i}>• {g}</Text>
              ))
            )}
          </Card.Content>
        </Card>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 12 },
  card: { borderRadius: 16 },
  row: { marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  quote: { marginTop: 12, fontStyle: 'italic' },
  actions: { marginTop: 12, gap: 12 },
});

export default WellnessScreen;