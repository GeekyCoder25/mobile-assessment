import {View, Text, StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Splash from './pages/Splash';
import TabNavigator from './tabs';
import TaskDetails from './pages/Tasks/TaskDetails';
import {Task} from './types';
import {StatusBar} from 'expo-status-bar';

export type RootStackParamList = {
	Splash: undefined;
	tabs: undefined;
	details: Task;
	settings: undefined;
};

export const PAGE_HEIGHT = Dimensions.get('window').height;
export const PAGE_WIDTH = Dimensions.get('window').width;

const App = () => {
	const Stack = createNativeStackNavigator();
	return (
		<View style={styles.container}>
			<StatusBar style="auto" translucent={false} backgroundColor={'#e84794'} />
			<Stack.Navigator screenOptions={{headerShown: false}}>
				<Stack.Screen name="Splash" component={Splash} />
				<Stack.Screen name="tabs" component={TabNavigator} />
				<Stack.Screen name="details" component={TaskDetails} />
			</Stack.Navigator>
		</View>
	);
};

export default App;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		maxWidth: 800,
	},
});
