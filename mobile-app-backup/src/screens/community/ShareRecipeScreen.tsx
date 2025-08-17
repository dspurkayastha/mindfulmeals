import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import SunsetHeader from '../../components/common/SunsetHeader';
import MindfulButton from '../../components/common/MindfulButton';

const ShareRecipeScreen: React.FC<ScreenProps> = () => {
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <SunsetHeader title="Share Recipe" subtitle="Contribute to the community" />
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Recipe Title</Text>
            <TextInput placeholder="e.g., Grandma's Dal Tadka" value={title} onChangeText={setTitle} style={styles.input} />
            <Text variant="titleMedium" style={{ marginTop: 12 }}>Description</Text>
            <TextInput placeholder="Write your recipe..." value={content} onChangeText={setContent} style={[styles.input, styles.textarea]} multiline />
            <View style={{ marginTop: 16 }}>
              <MindfulButton title="Publish" onPress={() => {}} />
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
  input: { backgroundColor: 'white', borderRadius: 12, padding: 12, marginTop: 8 },
  textarea: { height: 120, textAlignVertical: 'top' },
});

export default ShareRecipeScreen;