import {
	Dimensions,
	Modal,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import React, {useCallback, useMemo, useState} from 'react';
import {useGlobalStore} from '@/context/store';
import Toast from 'react-native-toast-message';
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {MemoryStorage} from '@/storage';
import {TASKS} from '@/constants';
import AntDesign from '@expo/vector-icons/AntDesign';
import {Task} from '@/app/types';
import {randomUUID} from 'expo-crypto';
import {sendPushNotification} from './Notification';

const AddTask = () => {
	const {
		showAddModal,
		setShowAddModal,
		tasks,
		setTasks,
		editData,
		setEditData,
		apiData,
		setApiData,
		pushToken,
	} = useGlobalStore();
	const initialFormData = useMemo(() => {
		return editData
			? {
					...editData,
					keys: editData.keys.map(key => key.title),
			  }
			: {
					id: randomUUID(),
					title: apiData?.title || '',
					description: '',
					keys: [''],
			  };
	}, [editData, apiData]);

	const [formData, setFormData] = useState(initialFormData);

	const handlePress = async () => {
		try {
			const storage = new MemoryStorage();

			if (!formData.title) {
				throw new Error('Please add a task title');
			} else if (!formData.description) {
				throw new Error('Please add a task description');
			}

			setShowAddModal(false);
			setEditData(null);
			const storedTasks = await storage.getItem(TASKS);
			if (!editData) {
				const newTask: Task = {
					...formData,
					keys: formData.keys
						.filter(key => key)
						.map(key => {
							return {
								id: randomUUID(),
								title: key,
								isComplete: false,
							};
						}),
				};

				setTasks([...tasks, newTask]);
				await storage.setItem(
					TASKS,
					JSON.stringify(
						storedTasks ? [...JSON.parse(storedTasks), {...newTask}] : [newTask]
					)
				);
				if (apiData) {
					sendPushNotification({
						token: pushToken,
						title: 'New Task Added',
						body: `You've added a new task from an online task - ${formData.title}`,
					});
				} else {
					sendPushNotification({
						token: pushToken,
						title: 'New Task Added',
						body: `You've added a new task - ${formData.title}`,
					});
				}
			} else {
				const updatedTasks = tasks.map(task =>
					task.id === editData.id
						? {
								...formData,
								keys: formData.keys
									.filter(key => key)
									.map(key => {
										return {
											id:
												editData.keys.find(keyID => keyID.title === key)?.id ||
												randomUUID(),
											title: key,
											isComplete: !!editData.keys.find(
												keyID => keyID.title === key
											)?.isComplete,
										};
									}),
						  }
						: task
				);
				setTasks(updatedTasks);
				sendPushNotification({
					token: pushToken,
					title: 'Task Update',
					body: `You've successfully updated your task - ${formData.title}`,
				});
				await storage.setItem(TASKS, JSON.stringify(updatedTasks));
			}
		} catch (error: any) {
			console.log(error.message);
			Toast.show({
				type: 'error',
				text1: 'Form error',
				text2: error.message,
			});
		}
	};

	const handleClose = () => {
		setShowAddModal(false);
		setEditData(null);
		setApiData(null);
	};

	return (
		<Modal transparent visible={showAddModal}>
			<View style={styles.modalContainer}>
				<Pressable onPress={handleClose} style={styles.overlay} />
				<View style={styles.modal}>
					<ScrollView>
						<View style={styles.header}>
							<Text style={styles.headerText}>
								{!editData ? 'Add New' : 'Update'} Task
							</Text>
							<TouchableOpacity onPress={handleClose}>
								<AntDesign name="closecircleo" size={24} color="black" />
							</TouchableOpacity>
						</View>

						<View style={styles.content}>
							<View>
								<Text>Title</Text>
								<TextInput
									style={styles.input}
									maxLength={30}
									onChangeText={text =>
										setFormData(prev => {
											return {
												...prev,
												title: text,
											};
										})
									}
									value={formData.title}
								/>
							</View>
							<View style={styles.desc}>
								<Text>Description</Text>
								<TextInput
									style={styles.input2}
									multiline
									textAlignVertical="top"
									onChangeText={text =>
										setFormData(prev => {
											return {
												...prev,
												description: text,
											};
										})
									}
									value={formData.description}
								/>
							</View>
						</View>

						<TouchableOpacity
							style={styles.keyContainer}
							onPress={() =>
								setFormData(prev => {
									return {
										...prev,
										keys: [...prev.keys, ''],
									};
								})
							}
						>
							<View style={styles.keyHeader}>
								<Text style={styles.keyHeaderText}>Add Key Point</Text>
							</View>
						</TouchableOpacity>

						{formData.keys.map((key, index) => (
							<View style={styles.key} key={index}>
								{key ? (
									<Fontisto name="radio-btn-active" size={24} color="#e84794" />
								) : (
									<Fontisto
										name="radio-btn-passive"
										size={24}
										color="#e84794"
									/>
								)}
								<TextInput
									style={styles.inputKey}
									onChangeText={text =>
										setFormData(prev => {
											return {
												...prev,
												keys: formData.keys.map((i, keyIndex) =>
													keyIndex !== index ? i : text
												),
											};
										})
									}
									value={key}
								/>
								<TouchableOpacity
									onPress={() =>
										setFormData(prev => {
											return {
												...prev,
												keys: prev.keys.filter(
													(i, keyIndex) => index !== keyIndex
												),
											};
										})
									}
								>
									<MaterialIcons name="delete" size={24} color="black" />
								</TouchableOpacity>
							</View>
						))}
						<TouchableOpacity onPress={handlePress}>
							<View style={styles.button}>
								<Text style={styles.submitText}>
									{!editData ? 'Add' : 'Update'}
								</Text>
							</View>
						</TouchableOpacity>
					</ScrollView>
				</View>
			</View>
			<Toast />
		</Modal>
	);
};

export default AddTask;

const styles = StyleSheet.create({
	overlay: {
		backgroundColor: '#000',
		opacity: 0.7,
		flex: 1,
		position: 'absolute',
		top: 0,
		bottom: 0,
		height: '100%',
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	modal: {
		backgroundColor: '#FFF',
		width: '90%',
		padding: 20,
		borderRadius: 20,
		maxHeight: Dimensions.get('window').height * 0.8,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	headerText: {
		fontSize: 20,
		fontWeight: '600',
	},
	content: {
		marginVertical: 20,
	},
	input: {
		backgroundColor: '#f9fafb',
		borderWidth: 1,
		marginTop: 10,
		minHeight: 50,
		borderColor: '#D1D5DB',
		borderRadius: 8,
		padding: 15,
	},
	input2: {
		backgroundColor: '#f9fafb',
		borderWidth: 1,
		marginTop: 10,
		minHeight: 250,
		borderColor: '#D1D5DB',
		borderRadius: 8,
		padding: 15,
	},
	desc: {
		marginTop: 20,
	},
	keyContainer: {
		flexDirection: 'row',
	},
	keyHeader: {
		borderWidth: 1,
		padding: 10,
		borderColor: '#e84794',
		borderRadius: 10,
	},
	keyHeaderText: {
		color: '#000051',
		fontWeight: '600',
	},
	button: {
		backgroundColor: '#e84794',
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 20,
	},
	submitText: {
		padding: 20,
		color: '#FFF',
		fontWeight: '600',
	},
	key: {
		marginTop: 20,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
	},
	inputKey: {
		backgroundColor: '#f9fafb',
		width: '100%',
		height: 50,
		borderColor: '#D1D5DB',
		borderWidth: 1,
		paddingLeft: 10,
		borderRadius: 10,
		flex: 1,
	},
});
