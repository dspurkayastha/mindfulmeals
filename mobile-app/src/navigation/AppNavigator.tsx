import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import HomeScreen from '../screens/home/HomeScreen';
import MealPlanningScreen from '../screens/meal-planning/MealPlanningScreen';
import PantryScreen from '../screens/pantry/PantryScreen';
import ShoppingScreen from '../screens/shopping/ShoppingScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import CommunityScreen from '../screens/community/CommunityScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';

import CalorieScannerScreen from '../screens/scanner/CalorieScannerScreen';
import RecipeListScreen from '../screens/recipes/RecipeListScreen';
import RecipeDetailsScreen from '../screens/recipes/RecipeDetailsScreen';
import WellnessScreen from '../screens/wellness/WellnessScreen';
import QuickCommerceScreen from '../screens/commerce/QuickCommerceScreen';
import ShareRecipeScreen from '../screens/community/ShareRecipeScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
	<Tab.Navigator screenOptions={{ headerShown: false }}>
		<Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: ({ color, size }) => (<Icon name="home" color={color} size={size} />) }} />
		<Tab.Screen name="Meal Planning" component={MealPlanningScreen} options={{ tabBarIcon: ({ color, size }) => (<Icon name="restaurant-menu" color={color} size={size} />) }} />
		<Tab.Screen name="Recipes" component={RecipeListScreen} options={{ tabBarIcon: ({ color, size }) => (<Icon name="book" color={color} size={size} />) }} />
		<Tab.Screen name="Wellness" component={WellnessScreen} options={{ tabBarIcon: ({ color, size }) => (<Icon name="self-improvement" color={color} size={size} />) }} />
		<Tab.Screen name="Pantry" component={PantryScreen} options={{ tabBarIcon: ({ color, size }) => (<Icon name="kitchen" color={color} size={size} />) }} />
		<Tab.Screen name="Shopping" component={ShoppingScreen} options={{ tabBarIcon: ({ color, size }) => (<Icon name="shopping-cart" color={color} size={size} />) }} />
		<Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ color, size }) => (<Icon name="person" color={color} size={size} />) }} />
	</Tab.Navigator>
);

const AppNavigator = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				<Stack.Screen name="Onboarding" component={OnboardingScreen} />
				<Stack.Screen name="MainTabs" component={MainTabs} />
				<Stack.Screen name="Community" component={CommunityScreen} />
				<Stack.Screen name="CalorieScanner" component={CalorieScannerScreen} />
				<Stack.Screen name="RecipeDetails" component={RecipeDetailsScreen} />
				<Stack.Screen name="QuickCommerce" component={QuickCommerceScreen} />
				<Stack.Screen name="ShareRecipe" component={ShareRecipeScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default AppNavigator;