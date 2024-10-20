import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
} from 'react-native';
import React from 'react';
import Feather from '@expo/vector-icons/Feather';
import {useGlobalStore} from '@/context/store';
import {RootStackParamList} from '@/app';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

const TasksScreen = () => {
	const navigation: NavigationProp = useNavigation();
	const {tasks, setShowAddModal} = useGlobalStore();

	return (
		<View style={styles.tasks}>
			<Text style={styles.taskHeader}>Task Overview</Text>

			{!tasks.length ? (
				<View style={styles.taskContainer}>
					<Text style={styles.empty}>No task has been created</Text>
				</View>
			) : (
				<ScrollView>
					{tasks.map((task, index) => (
						<TouchableOpacity
							onPress={() => navigation.navigate('details', task)}
							key={task.id}
							style={{
								...styles.task,
								backgroundColor: index % 2 === 0 ? '#fff2f8' : '#f1fef6',
							}}
						>
							<Text style={styles.title}>{task.title}</Text>
							<Text style={styles.titleSub}>{task.description}</Text>
							<View style={styles.keys}>
								{task.keys.map(key => (
									<View key={key.id} style={styles.key}>
										{key.isComplete ? (
											<AntDesign name="checkcircle" size={12} color="#e84794" />
										) : (
											<MaterialIcons
												size={12}
												color="#e84794"
												name="radio-button-unchecked"
											/>
										)}
										<Text>{key.title}</Text>
									</View>
								))}
							</View>
						</TouchableOpacity>
					))}
				</ScrollView>
			)}

			<TouchableOpacity onPress={() => setShowAddModal(true)}>
				<View style={styles.add}>
					<AntDesign name="plus" size={24} color="#FFF" />
				</View>
			</TouchableOpacity>
		</View>
	);
};

export default TasksScreen;

const styles = StyleSheet.create({
	tasks: {
		padding: 20,
		backgroundColor: '#FFF',
		paddingVertical: 40,
		flex: 1,
	},
	taskHeader: {
		fontSize: 25,
		fontWeight: '600',
		marginBottom: 20,
	},
	summaryText: {
		color: '#FFF',
		fontWeight: '600',
		fontSize: 30,
	},
	summaryTextSub: {
		marginTop: 10,
		color: '#FFF',
	},
	taskContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	empty: {
		fontWeight: '600',
		fontSize: 18,
	},
	add: {
		position: 'absolute',
		right: 10,
		bottom: 10,
		backgroundColor: '#e84794',
		padding: 10,
		borderRadius: 100,
		width: 50,
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
	},
	task: {
		marginVertical: 10,
		backgroundColor: '#f1fef6',
		height: 150,
		padding: 20,
		borderRadius: 20,
	},
	title: {
		fontSize: 22,
		fontWeight: '600',
		color: '#000051',
	},
	titleSub: {
		marginTop: 5,
		fontSize: 16,
		fontWeight: '400',
		color: '#6B7280',
	},
	keys: {
		marginTop: 10,
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 20,
	},
	key: {
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: 5,
	},
});
