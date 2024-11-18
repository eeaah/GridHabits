import logo from "../assets/logo.svg";
import styles from "../styles/index.module.css";

export default function Index() {
	return (
		<div className={styles.flex}>
			<img className={styles.logo} src={logo} />
			<h1 className={styles.header}>GridHabits</h1>
		</div>
	);
}
