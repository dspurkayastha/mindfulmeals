import React, { useState } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { Card, Text, Chip, Searchbar, useTheme } from 'react-native-paper';
import SunsetHeader from '../../components/common/SunsetHeader';

const mockRecipes = [
	{ id: '1', title: 'Palak Paneer', cuisine: 'North Indian', calories: 320 },
	{ id: '2', title: 'Idli Sambhar', cuisine: 'South Indian', calories: 260 },
	{ id: '3', title: 'Undhiyu', cuisine: 'Gujarati', calories: 310 },
];

const RecipeListScreen: React.FC<ScreenProps> = ({ navigation }) => {
	const { colors } = useTheme();
	const [query, setQuery] = useState('');
	const [active, setActive] = useState('all');

	const data = mockRecipes.filter(r => active === 'all' || r.cuisine === active)
		.filter(r => r.title.toLowerCase().includes(query.toLowerCase()));

	return (
		<SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
			<SunsetHeader title="Recipes" subtitle="Browse curated and community recipes" />
			<View style={styles.content}>
				<Searchbar placeholder="Search recipes" value={query} onChangeText={setQuery} style={styles.search} />
				<View style={styles.chips}>
					{['all', 'North Indian', 'South Indian', 'Gujarati'].map(c => (
						<Chip key={c} selected={active === c} onPress={() => setActive(c)} style={styles.chip}>{c}</Chip>
					))}
				</View>
				<FlatList
					data={data}
					renderItem={({ item }) => (
						<Card style={styles.card} onPress={() => navigation.navigate('RecipeDetails', { id: item.id })}>
							<Card.Title title={item.title} subtitle={`${item.cuisine} • ${item.calories} cal`} />
						</Card>
					)}
					keyExtractor={(item) => item.id}
				/>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1 },
	content: { padding: 16, gap: 12 },
	search: { marginBottom: 8 },
	chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
	chip: {}
	,
	card: { marginBottom: 12, borderRadius: 12 },
});

export default RecipeListScreen;