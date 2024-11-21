import styles from "../styles/grid.module.css";
import { habit, habitEntry } from "../types/habit.types";

const addDays = (date: Date, days: number) => {
	var res = new Date(date);
	res.setDate(res.getDate() + days);
	return res;
};

const hexToRgb = (hex: string) => {
	var bigint = parseInt(hex.slice(1), 16);
	return {
		r: (bigint >> 16) & 255,
		g: (bigint >> 8) & 255,
		b: bigint & 255,
	};
};

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
	return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

const getColor = (completion: number, goal: number) => {
	const baseColor = "#302930";
	const accentColor = "#06d6a0";
	const baseRGB = hexToRgb(baseColor);
	const accentRGB = hexToRgb(accentColor);
	const ratio = Math.max(0, Math.min(1, completion / goal));
	const blendedRGB = {
		r: Math.round(baseRGB.r + (accentRGB.r - baseRGB.r) * ratio),
		g: Math.round(baseRGB.g + (accentRGB.g - baseRGB.g) * ratio),
		b: Math.round(baseRGB.b + (accentRGB.b - baseRGB.b) * ratio),
	};
	return rgbToHex(blendedRGB);
};

const SVGGrid = ({
	days,
	habit,
	endDate,
}: {
	days: { [key: string]: habitEntry };
	habit: habit;
	endDate: Date;
}) => {
	const numRows = 7;
	const numCols = 54;
	const cellSize = 16;
	const offsetSize = cellSize;
	const gap = 2;
	const radius = 4;
	const startDate = new Date(endDate);
	startDate.setFullYear(endDate.getFullYear() - 1);
	startDate.setDate(startDate.getDate() - startDate.getDay());
	const yearAgo = new Date(endDate);
	yearAgo.setFullYear(endDate.getFullYear() - 1);
	let currentMonth = startDate.getMonth();
	let currentYear = startDate.getFullYear();
	let monthOffset = 0;
	let monthLabels = [];
	let yearLabels = [];
	monthLabels.push({
		month: startDate.toLocaleString("default", {
			month: "short",
		}),
		x: 0,
	});
	yearLabels.push({
		year: startDate.getFullYear(),
		x: 0,
	});

	return (
		<svg
			width="100%"
			height="100%"
			viewBox={`0 -15 ${
				numCols * (cellSize + gap) + 13 * offsetSize
			} ${numRows * (cellSize + gap) + (20 + 4) * 2}`}
			// width: (cols + 1 width) + offset width + max font width correction
			// height: rows height + (font height + font spacing) * 2
			xmlns="http://www.w3.org/2000/svg"
		>
			<g className="grid">
				{Array.from({ length: numCols }).map((_, col) =>
					Array.from({ length: numRows }).map((_, row) => {
						const currentDate = addDays(startDate, col * 7 + row);
						const currentFormattedDate = currentDate
							.toISOString()
							.slice(0, 10);
						const currentEntry = days[currentFormattedDate];
						if (currentDate > endDate || currentDate < yearAgo) {
							return;
						}
						if (currentDate.getMonth() !== currentMonth) {
							currentMonth = currentDate.getMonth();
							monthOffset += offsetSize;
							let correctOffset = 0;
							if (row > 0 && col < numCols - 3) {
								correctOffset = gap + cellSize;
							} else if (col >= numCols - 3) {
								correctOffset = -1 * (gap + cellSize);
							}
							monthLabels.push({
								month: currentDate.toLocaleString("default", {
									month: "short",
								}),
								x:
									monthOffset +
									correctOffset +
									col * (gap + cellSize),
							});
							if (currentDate.getFullYear() !== currentYear) {
								currentYear = currentDate.getFullYear();
								yearLabels.push({
									year: currentYear,
									x: monthOffset + col * (gap + cellSize),
								});
							}
						}
						return (
							<rect
								key={currentFormattedDate}
								x={col * (gap + cellSize) + monthOffset}
								y={row * (gap + cellSize) + 10}
								rx={cellSize / radius}
								ry={cellSize / radius}
								width={cellSize}
								height={cellSize}
								fill={getColor(
									currentEntry?.completion || 0.0,
									habit.goal
								)}
								// onMouseEnter={}
								onClick={() => console.log(currentEntry)}
								className={styles.square}
							/>
						);
					})
				)}
			</g>
			{monthLabels.map(({ month, x }, col) => (
				<text
					key={col}
					x={x}
					y="0"
					color="white"
					className={styles.label}
				>
					{month}
				</text>
			))}
			{yearLabels.map(({ year, x }, col) => (
				<text
					className={styles.label}
					key={col}
					x={x}
					y={(numRows + 1) * (gap + cellSize) + 14}
				>
					{year}
				</text>
			))}
		</svg>
	);
};

const Statistics = ({ habit }: { habit: habit }) => {
	const entries = habit.habit_entries;
	let maxStreak = 0;
	let totalCompletion = 0;
	let completedDays = 0;
	let activeDays = entries.length;
	let currentStreak = 0;
	let prevDate = new Date();

	for (let entry of entries) {
		totalCompletion += entry.completion;
		if (entry.completion < habit.goal) {
			currentStreak = 0;
			prevDate = entry.entry_date;
			continue;
		}
		completedDays++;
		if (86400000 >= entry.entry_date.getTime() - prevDate.getTime())
			maxStreak = Math.max(maxStreak, ++currentStreak);
		else currentStreak = 1;
		prevDate = entry.entry_date;
	}
	return (
		<div className={styles.flex}>
			<p>
				Total completion:{" "}
				<span className={styles.number}>{totalCompletion}</span>
			</p>
			<p>
				Completed days:{" "}
				<span className={styles.number}>{completedDays}</span>
			</p>
			<p>
				Max streak: <span className={styles.number}>{maxStreak}</span>
			</p>
			<p>
				Active days: <span className={styles.number}>{activeDays}</span>
			</p>
		</div>
	);
};

export default function Grid({
	habit,
	endDate,
}: {
	habit: habit;
	endDate: Date;
}) {
	let days: { [key: string]: habitEntry } = {};
	for (const item of habit.habit_entries) {
		days[item.entry_date.toISOString().slice(0, 10)] = item;
	}

	return (
		<div style={{ width: "100%" }}>
			{/* <div className={styles.container}>{days}</div> */}
			<Statistics habit={habit} />
			<div className={styles.container}>
				<SVGGrid days={days} habit={habit} endDate={endDate} />
			</div>
		</div>
	);
}
