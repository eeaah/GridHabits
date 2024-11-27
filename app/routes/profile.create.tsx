import styles from "../styles/createHabit.module.css";

export default function createHabit() {
	return (
		<dialog id="createHabit" className={styles.modal} open>
			<form>
				Create new habit
				<p>Name</p>
				<input aria-label="Name"></input>
				<p>Goal</p>
				<input aria-label="Goal"></input>
				<p>Color</p>
				<input aria-label="Color"></input>
				<p></p>
				<button>submit</button>
			</form>
		</dialog>
	);
}
