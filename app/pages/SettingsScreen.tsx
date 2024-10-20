import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image,
	TextInput,
	ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {launchImageLibraryAsync} from 'expo-image-picker';
import {useGlobalStore} from '@/context/store';
import {MemoryStorage} from '@/storage';
import {IMAGE_URI, NICK_NAME} from '@/constants';
import Toast from 'react-native-toast-message';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const SettingsScreen = () => {
	const storage = new MemoryStorage();
	const {imageUri, setImageUri, nickName, setNickName} = useGlobalStore();
	const [formData, setFormData] = useState(nickName);
	const [isEditing, setIsEditing] = useState(false);

	const handlePickImage = async () => {
		const response = await launchImageLibraryAsync({
			allowsEditing: true,
			quality: 0.1,
			aspect: [1, 1],
		});
		if (response.assets && response.assets.length > 0) {
			const capturedAsset = response.assets[0].uri;
			setImageUri(capturedAsset);
			await storage.setItem(IMAGE_URI, capturedAsset);
		}
	};

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
		setNickName(formData);
		setIsEditing(false);
	};

	return (
		<ScrollView style={styles.container}>
			<View style={styles.imageContainer}>
				<TouchableOpacity onPress={handlePickImage}>
					{imageUri ? (
						<Image source={{uri: imageUri}} style={styles.image} />
					) : (
						<FontAwesome name="user-circle" size={150} color="#e84794" />
					)}
				</TouchableOpacity>
			</View>
			<View style={styles.nameContainer}>
				<Text style={styles.name}>{nickName}</Text>
				{!isEditing && (
					<TouchableOpacity
						onPress={() => setIsEditing(true)}
						style={styles.edit}
					>
						<MaterialIcons name="edit" size={16} color="#e84794" />
					</TouchableOpacity>
				)}
			</View>
			{isEditing && (
				<>
					<Text style={styles.text}>Name / Nick-name</Text>
					<TextInput
						style={styles.input}
						maxLength={30}
						onChangeText={text => setFormData(text)}
						placeholder="Name / Nick-name"
						value={formData}
					/>
					<TouchableOpacity onPress={handleSave}>
						<View style={styles.button}>
							<Text style={styles.submitText}>Update</Text>
						</View>
					</TouchableOpacity>
				</>
			)}
		</ScrollView>
	);
};

export default SettingsScreen;

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FFF',
		paddingHorizontal: '5%',
		paddingTop: 50,
	},
	imageContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	image: {
		width: 150,
		height: 150,
		borderRadius: 75,
	},
	nameContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		columnGap: 5,
		marginRight: -10,
	},
	name: {
		fontSize: 30,
		fontWeight: '600',
		marginVertical: 50,
	},
	edit: {
		marginTop: -10,
	},
	text: {
		fontSize: 16,
	},
	input: {
		backgroundColor: '#f9fafb',
		borderWidth: 1,
		marginTop: 10,
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
