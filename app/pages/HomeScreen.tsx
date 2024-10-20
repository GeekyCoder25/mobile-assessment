import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	ActivityIndicator,
	FlatList,
	Image,
} from 'react-native';
import React, {useEffect} from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import AddTask from '@/components/AddTask';
import {useGlobalStore} from '@/context/store';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '..';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {calculateTruePercentage} from '@/utils';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

const HomeScreen = () => {
	const {
		showAddModal,
		setShowAddModal,
		tasks,
		apiTasks,
		isError,
		loading,
		nickName,
		imageUri,
	} = useGlobalStore();
	const navigation: NavigationProp = useNavigation();

	useEffect(() => {}, []);

	const getGreeting = () => {
		const hour = new Date().getHours();
		if (hour < 12) {
			return {
				greeting: 'Good morning',
			};
		} else if (hour < 18) {
			return {
				greeting: 'Good afternoon',
			};
		} else {
			return {
				greeting: 'Good evening',
			};
		}
	};

	const completed = tasks.filter(
		task => task.keys.every(key => key.isComplete) || false
	);

	const tasksPercentage =
		calculateTruePercentage(
			tasks.map(task => task.keys.map(key => key.isComplete)).flat()
		) || 0;

	return (
		<View style={styles.container}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={styles.header}>
					<View>
						<Text style={styles.greeting}>
							{getGreeting().greeting}, {nickName}
						</Text>
						<Text>Welcome to your task manager</Text>
					</View>
					<TouchableOpacity onPress={() => navigation.navigate('settings')}>
						{imageUri ? (
							<Image source={{uri: imageUri}} style={styles.image} />
						) : (
							<FontAwesome name="user-circle" size={40} color="#e84794" />
						)}
					</TouchableOpacity>
				</View>

				<View style={styles.banner}>
					<View style={styles.summary}>
						<Text style={styles.summaryText}>Today's progress summary</Text>
						<Text style={styles.summaryTextSub}>
							{completed.length} of {tasks.length} completed
						</Text>
					</View>
					<AnimatedCircularProgress
						size={65}
						width={6}
						fill={tasksPercentage}
						tintColor={'#ffca44'}
						backgroundColor="#ee6d9d"
						rotation={0}
					>
						{() => (
							<View>
								<View style={styles.timer} />
								<View style={styles.timerInner}>
									<Text style={styles.timerText}>
										{tasksPercentage}
										<Text style={styles.timerPercent}>%</Text>
									</Text>
								</View>
							</View>
						)}
					</AnimatedCircularProgress>
				</View>
				<View style={styles.tasks}>
					<View>
						<Text style={styles.taskHeader}>My Tasks</Text>
						{!tasks.length ? (
							<View style={styles.taskContainer}>
								<Text style={styles.empty}>No task has been created</Text>
							</View>
						) : (
							<ScrollView horizontal>
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
												<View key={key.title} style={styles.key}>
													{key.isComplete ? (
														<AntDesign
															name="checkcircle"
															size={12}
															color="#e84794"
														/>
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
					</View>
					<View>
						<Text style={styles.taskHeader}>Online Tasks</Text>
						{!apiTasks.length ? (
							loading ? (
								<View style={styles.taskContainer}>
									<ActivityIndicator size={'large'} color={'#e84794'} />
								</View>
							) : !isError ? (
								<View style={styles.taskContainer}>
									<Text style={styles.empty}>No task has been created</Text>
								</View>
							) : (
								<View style={styles.taskContainer}>
									<Text style={styles.empty}>Network error</Text>
								</View>
							)
						) : (
							<FlatList
								horizontal
								data={apiTasks}
								keyExtractor={item => item.id.toString()}
								renderItem={({item: task, index}) => (
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
												<View key={key.title} style={styles.key}>
													{key.isComplete ? (
														<Feather
															name="check-circle"
															size={12}
															color="#e84794"
														/>
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
								)}
							/>
						)}
					</View>
				</View>
			</ScrollView>
			{showAddModal && <AddTask />}

			<TouchableOpacity onPress={() => setShowAddModal(true)}>
				<View style={styles.add}>
					<AntDesign name="plus" size={24} color="#FFF" />
				</View>
			</TouchableOpacity>
		</View>
	);
};

export default HomeScreen;

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 20,
		backgroundColor: '#fdfdfd',
		flex: 1,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginTop: 20,
	},
	greeting: {
		fontSize: 26,
		color: '#000051',
		fontWeight: '700',
	},
	image: {
		width: 40,
		height: 40,
		borderRadius: 20,
	},
	banner: {
		backgroundColor: '#e84794',
		marginVertical: 30,
		padding: 20,
		borderRadius: 10,
		flexDirection: 'row',
	},
	timer: {
		position: 'absolute',
		backgroundColor: 'rgba(0,0,0,0.1)',
		width: 51,
		height: 51,
		zIndex: -1,
		borderRadius: 40,
		top: 0,
	},
	timerInner: {
		borderRadius: 40,
		alignItems: 'center',
		backgroundColor: '#e84794',
		width: 50,
		height: 50,
		justifyContent: 'center',
	},
	timerText: {
		color: '#FFF',
		fontWeight: '800',
		fontSize: 20,
	},
	timerPercent: {
		fontWeight: '600',
		fontSize: 16,
	},
	tasks: {
		marginVertical: 20,
		flex: 1,
		rowGap: 30,
	},
	taskHeader: {
		fontSize: 25,
		fontWeight: '600',
		marginBottom: 20,
		color: '#000051',
	},
	summary: {
		flex: 1,
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
		marginRight: 20,
		width: 300,
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
