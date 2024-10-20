import {useEffect, useRef} from 'react';
import {Platform} from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import {useGlobalStore} from '../context/store';
import Toast from 'react-native-toast-message';

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
});

export async function sendPushNotification({
	token,
	title,
	body,
}: {
	token: string;
	title: string;
	body: string;
}) {
	const message = {
		to: token,
		sound: 'default',
		title: title || 'New Task Added',
		body: body || "You've added a new task ",
		data: {someData: 'goes here'},
	};

	await fetch('https://exp.host/--/api/v2/push/send', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Accept-encoding': 'gzip, deflate',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(message),
	});
}

sendPushNotification;

function handleRegistrationError(errorMessage: string) {
	console.log(errorMessage);
	// Toast.show({
	//   type: 'error',
	//   text1: 'Notification error',
	//   text2: errorMessage,
	// });
}

async function registerForPushNotificationsAsync() {
	if (Platform.OS === 'android') {
		Notifications.setNotificationChannelAsync('default', {
			name: 'default',
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: '#FF231F7C',
		});
	}

	if (Device.isDevice) {
		const {status: existingStatus} = await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== 'granted') {
			const {status} = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus !== 'granted') {
			handleRegistrationError('Notification permission not granted');
			return;
		}
		const projectId = '94fdb1e1-9834-48e5-ab29-3ed2c89a87b1';
		if (!projectId) {
			handleRegistrationError('Project ID not found');
		}
		try {
			const pushTokenString = (
				await Notifications.getExpoPushTokenAsync({projectId})
			)?.data;
			// sendPushNotification(pushTokenString, 'hey');

			return pushTokenString;
		} catch (e: any) {
			console.log('err', e.response?.data || e.message);
			handleRegistrationError(`${e}`);
		}
	} else {
		handleRegistrationError('Must use physical device for push notifications');
	}
}

export default function useNotification() {
	const {setPushToken} = useGlobalStore();

	const notificationListener = useRef<Notifications.Subscription>();
	const responseListener = useRef<Notifications.Subscription>();

	// notification && console.log(notification.request.content.data);

	useEffect(() => {
		registerForPushNotificationsAsync()
			.then(token => token && setPushToken(token))
			.catch(e => handleRegistrationError(e.message));

		notificationListener.current =
			Notifications.addNotificationReceivedListener(listener => {
				const data = listener.request.content.data;

				Toast.show({
					type: 'info',
					text1: 'Notification Type',
					text2: data.type,
				});
			});

		responseListener.current =
			Notifications.addNotificationResponseReceivedListener(response => {
				console.log(response);
			});

		return () => {
			notificationListener.current &&
				Notifications.removeNotificationSubscription(
					notificationListener.current
				);
			responseListener.current &&
				Notifications.removeNotificationSubscription(responseListener.current);
		};
	}, []);

	return () => {};
}
