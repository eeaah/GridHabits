import { loginWithGoogle, logout } from "../../firebase";

export default function login() {
	const handleLogin = async () => {
		console.log("hi");
		const user = await loginWithGoogle();
		if (!user) return;
		console.log("Logged in user", user);
		await fetch("/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				token: user.accessToken,
				email: user.email,
				displayName: user.displayName,
			}),
		});
	};

	const handleLogout = async () => {
		await logout();
		console.log("Logged out");
	};

	const test = () => {
		console.log("test");
	};

	return (
		<div>
			<button onClick={handleLogin}>Login with google</button>
			<button onClick={handleLogout}>Logout</button>
			<button onClick={test}>test</button>
		</div>
	);
}
