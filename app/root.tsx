import { Links, Meta, Outlet, Scripts } from "@remix-run/react";
import logo from "./assets/logo.svg";
import styles from "./styles/root.module.css";

export default function App() {
	return (
		<html>
			<head>
				<link rel="icon" href="/logo.svg" />
				<Meta />
				<Links />
			</head>
			<body>
				<div className={styles.navbar}>
					<ul className={styles.navbar_links}>
						<li className={styles.nav_item}>
							<button
								className={`${styles.nav_item} ${styles.nav_home}`}
							>
								<img src={logo} className={styles.logo} />
								GridHabits
							</button>
						</li>
						<li className={styles.nav_item}>Search</li>
						<li className={styles.nav_item}>About</li>
					</ul>
					<div className={''}>
						<button className={styles.profile_icon}>
							<img src="https://placecats.com/512/512" className={styles.profile_icon}/>
						</button>
					</div>
				</div>
				{/* <h1 className={styles.red}>hifdff</h1> */}
				<Outlet />
				<Scripts />
			</body>
		</html>
	);
}
