import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import postgres from "../../db.server.js";
import Grid from "../components/grid";
import styles from "../styles/profile.module.css";
import {
	habit,
	habitEntry,
	habitEntryRaw,
	habitRaw,
} from "../types/habit.types.js";

export const loader = async () => {
	// const users = await postgres`SELECT * FROM users;`;
	const habitsRaw: habitRaw[] =
		await postgres`SELECT * FROM habits WHERE user_id=1;`;
	const habitsArray = Array.isArray(habitsRaw) ? habitsRaw : [habitsRaw];
	const habits: habit[] = habitsArray.map((prev) => ({
		...prev,
		goal: parseFloat(prev.goal),
		habit_entries: [],
	}));

	const overviewEntries: { [key: string]: habitEntry } = {};
	let count = 0;
	for (let habit of habits) {
		let maxCompletion = 0;
		if (habit.goal === -1) {
			habit.goal = 1;
		}
		const habitEntriesRaw: habitEntryRaw[] =
			await postgres`SELECT * FROM habit_entries WHERE habit_id=${habit.habit_id};`;
		const habit_entries: habitEntry[] = habitEntriesRaw.map((prev) => ({
			...prev,
			completion: parseFloat(prev.completion),
			entry_date: new Date(prev.entry_date),
		}));
		habit_entries.sort((a, b) => {
			if (a.entry_date < b.entry_date) return -1;
			if (a.entry_date > b.entry_date) return 1;
			return 0;
		});
		habit.habit_entries = habit_entries;
		for (let entry of habit.habit_entries) {
			maxCompletion = Math.max(maxCompletion, entry.completion);
			const key = entry.entry_date.toISOString().slice(0, 10);
			let completion = 0;
			if (habit.goal === -1) {
				completion = entry.completion > 0 ? 1 : 0;
			} else {
				completion = entry.completion >= habit.goal ? 1 : 0;
			}
			if (key in overviewEntries) {
				overviewEntries[key].completion += completion;
			} else {
				overviewEntries[key] = {
					habit_id: habit.habit_id,
					entry_id: count++,
					completion: completion,
					entry_date: entry.entry_date,
					note: null,
				};
			}
		}
		if (habit.goal === -1) {
			habit.goal = maxCompletion;
		}
		habit;
	}
	const overview: habit = {
		habit_id: 0,
		user_id: 0,
		title: "overview",
		goal: habits.length,
		color_id: -1,
		habit_entries: Object.values(overviewEntries).sort((a, b) => {
			if (a.entry_date < b.entry_date) return -1;
			if (a.entry_date > b.entry_date) return 1;
			return 0;
		}),
	};
	console.log(habits);
	return json({ habits: habits, overview: overview });
};

export default function Profile() {
	const data = useLoaderData() as { habits: habitRaw[]; overview: habitRaw };
	const habits: habit[] = data.habits.map((habit) => ({
		...habit,
		goal: parseFloat(habit.goal),
		habit_entries: habit.habit_entries.map((entry) => ({
			...entry,
			completion: parseFloat(entry.completion),
			entry_date: new Date(entry.entry_date),
		})),
	}));
	const overview: habit = {
		...data.overview,
		goal: parseFloat(data.overview.goal),
		habit_entries: data.overview.habit_entries.map((entry) => ({
			...entry,
			completion: parseFloat(entry.completion),
			entry_date: new Date(entry.entry_date),
		})),
	};
	const endDate = new Date();

	return (
		<div className={styles.main}>
			<div className={styles.sidebar}>Overview</div>
			<div className={styles.main_container}>
				<div className={styles.container}>
					<h1 className={styles.name}>Profile name</h1>
					<div className={styles.main_flex}>
						<img
							src="https://placecats.com/512/512"
							className={styles.profile_icon}
						/>
						<Grid habit={overview} endDate={endDate} />
					</div>
				</div>
					{habits.map((habit) => (
						<div className={styles.container}>
							<h1 className={styles.habitTitle}>{habit.title}</h1>
							<div className={styles.main_flex}>
								<div
									className={styles.profile_icon}
								/>
								<Grid habit={habit} endDate={endDate} />
							</div>
						</div>
					))}
			</div>
		</div>
	);
}
