import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../pages/HomeScreen';
import SettingsScreen from '../pages/SettingsScreen';
import TabBar from '@/components/TabBar';
import TasksScreen from '../pages/Tasks/TasksScreen';

const TabNavigator = () => {
	const Tab = createBottomTabNavigator();

	return (
		<Tab.Navigator
			screenOptions={{headerShown: false}}
			tabBar={tab => (
				<TabBar
					activeRouteIndex={tab.state.index}
					navigation={tab.navigation}
				/>
			)}
		>
			<Tab.Screen name="home" component={HomeScreen} />
			<Tab.Screen name="tasks" component={TasksScreen} />
			<Tab.Screen name="settings" component={SettingsScreen} />
		</Tab.Navigator>
	);
};

export default TabNavigator;
