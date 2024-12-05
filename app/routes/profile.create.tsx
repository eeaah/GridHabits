import { Form, useNavigate } from "@remix-run/react";
import styles from "../styles/createHabit.module.css";

export default function createHabit() {
	return (
		<dialog id="createHabit" className={styles.modal} open>
			<Form key="111">
				Create new habit
				<p>Name</p>
				<input aria-label="Name" type="text"></input>
				<p>Goal</p>
				<input aria-label="Goal" type="text"></input>
				<p>Color</p>
				<input aria-label="Color" type="number"></input>
				<p></p>
				<button>submit</button>
			</Form>
		</dialog>
	);
}
