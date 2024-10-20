export interface Task {
	id: string;
	title: string;
	description: string;
	keys: TaskKey[];
}

export interface TaskKey {
	id: string;
	title: string;
	isComplete: boolean;
}
