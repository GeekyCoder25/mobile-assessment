import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import React, {useState} from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '@/app';
import {useNavigation} from 'expo-router';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {Task, TaskKey} from '@/app/types';
import {MemoryStorage} from '@/storage';
import {TASKS} from '@/constants';
import {useGlobalStore} from '@/context/store';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {sendPushNotification} from '@/components/Notification';

const TaskDetails = () => {
	const {tasks, setTasks, setShowAddModal, setEditData, setApiData, pushToken} =
		useGlobalStore();
	const {params} = useRoute<RouteProp<RootStackParamList, 'details'>>();
	const task = tasks.find(task => task.id === params.id) || params;
	const {goBack} = useNavigation();
	const {id, title, description, keys} = task;
	const isAPITask = !task.description;
	const [selectedKey, setSelectedKey] = useState<TaskKey | null>(null);

	const handleMark = async () => {
		const storage = new MemoryStorage();
		const updateTasks: Task[] = tasks.map(index =>
			index.id === task.id
				? {
						...index,
						keys: index.keys.map(key =>
							key.id === selectedKey?.id
								? {...key, isComplete: !selectedKey.isComplete}
								: key
						),
				  }
				: index
		);
		setSelectedKey(null);
		setTasks(updateTasks);
		await storage.setItem(TASKS, JSON.stringify(updateTasks));
		const completed = keys.filter(key => key.isComplete);
		sendPushNotification({
			token: pushToken,
			title: 'Task Progress',
			body: `You've completed ${
				selectedKey?.isComplete ? completed.length - 1 : completed.length + 1
			} of ${keys.length} for your "${title}" task `,
		});
	};

	const handleEdit = () => {
		setEditData(task);
		setShowAddModal(true);
		goBack();
	};

	const handleAdd = () => {
		setApiData(task);
		goBack();
		setShowAddModal(true);
	};

	const handleDelete = async () => {
		const storage = new MemoryStorage();
		const updateTasks: Task[] = tasks.filter(taskID => taskID.id !== id);
		setTasks(updateTasks);
		await storage.setItem(TASKS, JSON.stringify(updateTasks));
		goBack();
		sendPushNotification({
			token: pushToken,
			title: 'Task Deleted',
			body: `You've deleted your task - ${title}`,
		});
	};

	return (
		<View style={styles.container}>
			<ScrollView>
				<View style={styles.header}>
					<TouchableOpacity style={styles.back} onPress={goBack}>
						<FontAwesome6
							name="arrow-left"
							size={24}
							color="#000051"
							style={styles.backIcon}
						/>
					</TouchableOpacity>

					{!isAPITask && (
						<TouchableOpacity style={styles.back} onPress={handleDelete}>
							<MaterialIcons
								name="delete"
								size={24}
								color="black"
								style={styles.backIcon}
							/>
						</TouchableOpacity>
					)}
				</View>
				<Text style={styles.title}>{title}</Text>
				<Text style={styles.titleSub}>{description}</Text>
				<View style={styles.keys}>
					{keys.map(key =>
						selectedKey?.id && selectedKey.id === key.id ? (
							<TouchableOpacity
								key={key.id}
								style={styles.activeKey}
								onPress={() =>
									setSelectedKey(prev => (prev?.id === key.id ? null : key))
								}
							>
								{key.isComplete ? (
									<MaterialCommunityIcons
										name="checkbox-marked"
										size={24}
										color="#FFF"
									/>
								) : (
									<MaterialCommunityIcons
										name="checkbox-blank-outline"
										size={24}
										color="#FFF"
									/>
								)}
								<Text style={styles.activeKeyTitle}>{key.title}</Text>
							</TouchableOpacity>
						) : (
							<TouchableOpacity
								key={key.title}
								style={styles.key}
								onPress={() =>
									setSelectedKey(prev => (prev?.id === key.id ? null : key))
								}
							>
								{key.isComplete ? (
									<MaterialCommunityIcons
										name="checkbox-marked"
										size={24}
										color="#e84794"
									/>
								) : (
									<MaterialCommunityIcons
										name="checkbox-blank-outline"
										size={24}
										color="#e84794"
									/>
								)}
								<Text style={styles.keyTitle}>{key.title}</Text>
							</TouchableOpacity>
						)
					)}
				</View>
			</ScrollView>

			{selectedKey && !isAPITask && (
				<TouchableOpacity style={styles.button} onPress={handleMark}>
					<Text style={styles.buttonText}>
						Mark {selectedKey.isComplete ? 'Incomplete' : 'Complete'}
					</Text>
				</TouchableOpacity>
			)}
			{isAPITask && (
				<TouchableOpacity style={styles.button} onPress={handleAdd}>
					<Text style={styles.buttonText}>Add to my task</Text>
				</TouchableOpacity>
			)}
			{!isAPITask && (
				<TouchableOpacity
					style={{...styles.editIcon, bottom: selectedKey ? 100 : 50}}
					onPress={handleEdit}
				>
					<AntDesign name="edit" size={20} color="#FFF" />
				</TouchableOpacity>
			)}
		</View>
	);
};

export default TaskDetails;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: '5%',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 10,
	},
	back: {
		flexDirection: 'row',
	},
	backIcon: {
		borderWidth: 1,
		borderColor: '#D1D5DB',
		paddingVertical: 15,
		paddingHorizontal: 20,
		marginBottom: 20,
		borderRadius: 15,
	},
	title: {
		fontSize: 30,
		fontWeight: '700',
		color: '#000051',
	},
	titleSub: {
		marginTop: 10,
		fontSize: 16,
		fontWeight: '600',
		color: '#6B7280',
	},
	keys: {
		rowGap: 20,
		marginVertical: 20,
	},
	activeKey: {
		borderWidth: 1,
		borderColor: '#D1D5DB',
		padding: 20,
		borderRadius: 20,
		flexDirection: 'row',
		columnGap: 10,
		backgroundColor: '#e84794',
	},
	key: {
		borderWidth: 1,
		borderColor: '#D1D5DB',
		padding: 20,
		borderRadius: 20,
		flexDirection: 'row',
		columnGap: 10,
	},
	editIcon: {
		backgroundColor: '#e84794',
		position: 'absolute',
		right: 20,
		bottom: 100,
		borderRadius: 50,
		width: 50,
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
	},
	activeKeyTitle: {
		fontSize: 18,
		color: '#FFF',
		fontWeight: '700',
	},
	keyTitle: {
		fontSize: 18,
		color: '#000051',
		fontWeight: '700',
	},
	button: {
		backgroundColor: '#ffb053',
		padding: 20,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 20,
	},
	buttonText: {
		fontWeight: '700',
		fontSize: 18,
		color: '#000051',
	},
});
