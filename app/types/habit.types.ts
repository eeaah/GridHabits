export type habitEntryRaw = {
	habit_id: number;
	entry_id: number;
	completion: string;
	entry_date: string;
	note: string | null;
}

export type habitEntry = {
	habit_id: number;
	entry_id: number;
	completion: number;
	entry_date: Date;
	note: string | null;
}

export type habitRaw = {
	habit_id: number;
	user_id: number;
	title: string;
	goal: string;
	color_id: number;
	habit_entries: habitEntryRaw[];
}

export type habit = {
	habit_id: number;
	user_id: number;
	title: string;
	goal: number;
	color_id: number;
	habit_entries: habitEntry[];
	// active_days: number;
	// total_completion: number;
	// max_streak: number;
	// current_streak: number;

}

export type habitInfo = habit & {
	
}