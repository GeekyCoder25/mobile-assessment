import {create} from 'zustand';
import {GlobalState} from './store.types';

export const useGlobalStore = create<GlobalState>(set => ({
	showAddModal: false,
	setShowAddModal: showAddModal => set({showAddModal}),
	tasks: [],
	setTasks: tasks => set({tasks}),
	apiTasks: [],
	setApiTasks: apiTasks => set({apiTasks}),
	editData: null,
	setEditData: editData => set({editData}),
	apiData: null,
	setApiData: apiData => set({apiData}),
	loading: true,
	setLoading: loading => set({loading}),
	isError: false,
	setIsError: isError => set({isError}),
	pushToken: '',
	setPushToken: pushToken => set({pushToken}),
	nickName: '',
	setNickName: nickName => set({nickName}),
	imageUri: '',
	setImageUri: imageUri => set({imageUri}),
}));
