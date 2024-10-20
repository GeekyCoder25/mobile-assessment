import {
	View,
	Text,
	StyleSheet,
	Image,
	ActivityIndicator,
	Modal,
	Dimensions,
	TextInput,
	TouchableOpacity,
	ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '..';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MemoryStorage} from '@/storage';
import {IMAGE_URI, NICK_NAME, TASKS} from '@/constants';
import {useGlobalStore} from '@/context/store';
import axios from 'axios';
import useNotification from '@/components/Notification';
import Toast from 'react-native-toast-message';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

const Splash = () => {
	useNotification();
	const navigation: NavigationProp = useNavigation();
	const {
		setTasks,
		setApiTasks,
		setIsError,
		setLoading,
		setNickName,
		setImageUri,
	} = useGlobalStore();
	const [showModal, setShowModal] = useState(false);
	const [formData, setFormData] = useState('');

	useEffect(() => {
		const loadTasks = async () => {
			try {
				const storage = new MemoryStorage();
				const name = await storage.getItem(NICK_NAME);
				if (!name) {
					return setShowModal(true);
				}
				setNickName(name);
				const storedTasks = await storage.getItem(TASKS);
				const savedImage = await storage.getItem(IMAGE_URI);
				const tasks = storedTasks ? JSON.parse(storedTasks) : [];
				setTasks(tasks);
				savedImage && setImageUri(savedImage);
				return navigation.replace('tabs');
			} catch (e) {
				console.error(e);
			}
		};
		loadTasks();
	}, []);

	useEffect(() => {
		const fetchTasks = async () => {
			try {
				const response = await axios.get<
					{
						userId: number;
						id: number;
						title: string;
						completed: boolean;
					}[]
				>('https://jsonplaceholder.typicode.com/todos');
				setApiTasks(
					response.data.map(data => {
						return {
							id: `${data.id}`,
							description: '',
							title: data.title,
							keys: [
								{
									id: `${data.id}`,
									isComplete: data.completed,
									title: data.title,
								},
							],
						};
					})
				);
			} catch (error) {
				setIsError(true);
				console.error('Error fetching tasks', error);
			} finally {
				setLoading(false);
			}
		};
		fetchTasks();
	}, []);

	const handleSave = async () => {
		const storage = new MemoryStorage();
		if (!formData) {
			Toast.show({
				type: 'error',
				text1: 'Error',
				text2: 'Please input a name',
				topOffset: 80,
			});
		}
		await storage.setItem(NICK_NAME, formData);
		setShowModal(false);
		setNickName(formData);
		return navigation.replace('tabs');
	};

	return (
		<View style={styles.container}>
			<Image
				source={require('../../assets/images/icon.png')}
				style={styles.image}
			/>
			<ActivityIndicator color={'#e84794'} style={styles.indicator} />
			<Modal visible={showModal} transparent>
				<View style={styles.modalContainer}>
					<View style={styles.overlay} />
					<View style={styles.modal}>
						<ScrollView>
							<Text style={styles.text}>What should we call you?</Text>
							<TextInput
								style={styles.input}
								maxLength={30}
								onChangeText={text => setFormData(text)}
								placeholder="Name / Nick-name"
							/>
							<TouchableOpacity onPress={handleSave}>
								<View style={styles.button}>
									<Text style={styles.submitText}>{'Save'}</Text>
								</View>
							</TouchableOpacity>
						</ScrollView>
					</View>
				</View>
				<Toast />
			</Modal>
		</View>
	);
};

export default Splash;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FFF',
	},
	image: {
		width: 250,
		height: 250,
		borderRadius: 250,
	},
	indicator: {
		marginTop: 50,
	},
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
	text: {
		fontSize: 20,
		fontWeight: '600',
	},
	input: {
		backgroundColor: '#f9fafb',
		borderWidth: 1,
		marginTop: 30,
		minHeight: 30,
		borderColor: '#D1D5DB',
		borderRadius: 8,
		padding: 15,
	},
	button: {
		backgroundColor: '#e84794',
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 40,
	},
	submitText: {
		padding: 20,
		color: '#FFF',
		fontWeight: '600',
	},
});
