import {Task} from '@/app/types';

export interface GlobalState {
	showAddModal: boolean;
	setShowAddModal: (showAddModal: boolean) => void;
	tasks: Task[];
	setTasks: (tasks: Task[]) => void;
	apiTasks: Task[];
	setApiTasks: (apiTasks: Task[]) => void;
	editData: Task | null;
	setEditData: (editData: Task | null) => void;
	apiData: Task | null;
	setApiData: (apiData: Task | null) => void;
	loading: boolean;
	setLoading: (loading: boolean) => void;
	isError: boolean;
	setIsError: (isError: boolean) => void;
	pushToken: string;
	setPushToken: (pushToken: string) => void;
	nickName: string;
	setNickName: (nickName: string) => void;
	imageUri: string;
	setImageUri: (imageUri: string) => void;
}
