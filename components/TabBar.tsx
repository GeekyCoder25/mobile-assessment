import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {FC} from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import {NavigationHelpers, ParamListBase} from '@react-navigation/native';
import {BottomTabNavigationEventMap} from '@react-navigation/bottom-tabs';

const TabBar: FC<{
	activeRouteIndex: number;
	navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
}> = ({activeRouteIndex, navigation}) => {
	const routes = [
		{
			label: 'Home',
			route: 'home',
			icon: <AntDesign name="home" size={24} color="black" />,
			iconActive: <AntDesign name="home" size={24} color="#e84794" />,
		},
		{
			label: 'Task Details',
			route: 'tasks',
			icon: <FontAwesome5 name="tasks" size={24} color="black" />,
			iconActive: <FontAwesome5 name="tasks" size={24} color="#e84794" />,
		},
		{
			label: 'Settings',
			route: 'settings',
			icon: <Ionicons name="settings-outline" size={24} color="black" />,
			iconActive: (
				<Ionicons name="settings-outline" size={24} color="#e84794" />
			),
		},
	];

	return (
		<View style={styles.tabsContainer}>
			{routes.map((route, index) => (
				<TouchableOpacity
					key={route.route}
					onPress={() => navigation.navigate(route.route)}
				>
					<View style={styles.route}>
						{index === activeRouteIndex ? route.iconActive : route.icon}
						{index === activeRouteIndex ? (
							<Text style={styles.activeText}>{route.label}</Text>
						) : (
							<Text>{route.label}</Text>
						)}
					</View>
				</TouchableOpacity>
			))}
		</View>
	);
};

export default TabBar;

const styles = StyleSheet.create({
	tabsContainer: {
		paddingHorizontal: 40,
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: '#FDFDFD',
		shadowColor: '#171717',
		shadowOffset: {width: -2, height: 4},
		shadowOpacity: 0.2,
		shadowRadius: 3,
		elevation: 20,
	},
	route: {
		paddingVertical: 20,
		alignItems: 'center',
		rowGap: 5,
	},
	activeText: {
		color: '#e84794',
	},
});
