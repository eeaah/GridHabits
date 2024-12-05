import { createRequestHandler } from "@remix-run/express";
import express from "express";
import postgres from "./db.server.js";
import { verifyToken } from "./firebaseAdmin.js";

const viteDevServer =
	process.env.NODE_ENV === "production"
		? null
		: await import("vite").then((vite) =>
				vite.createServer({
					server: { middlewareMode: true },
				})
		  );

const app = express();
app.use(
	viteDevServer ? viteDevServer.middlewares : express.static("build/client")
);
app.use(express.json());

app.post("/auth/login", async (req, res) => {
	const { token, email, displayName } = req.body;

	try {
		const decodedToken = await verifyToken(token);
		const { uid } = decodedToken;
		let user =
			await postgres`SELECT * FROM users WHERE firebase_uid = ${uid}`;

		if (!user.length) {
			const baseUsername =
				displayName?.replace(/\s+/g, "").toLowerCase().slice(0, 20) ||
				"user";
			let username = baseUsername;
			let suffix = 1;
			let duplicates =
				await postgres`SELECT 1 FROM users WHERE username = ${username}`;
			while (duplicates.length) {
				duplicates =
					await postgres`SELECT 1 FROM users WHERE username = ${username}`
						.length;
				username = `${baseUsername}${suffix}`.split(0, 20);
				suffix += 1;
			}

			user =
				await postgres`INSERT INTO users (firebase_uid, username, email) VALUES (${uid}, ${username}, ${email})`;
		} else {
			user = user.rows[0];
		}

		res.cookie("session", token, {
			httpOnly: true,
			secure: false,
			sameSite: "strict",
		});
		res.status(200).json({ message: "Login successful" });
	} catch (error) {
		res.status(401).json({ error: "Unauthorized" });
	}
});

const build = viteDevServer
	? () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
	: await import("./build/server/index.js");

app.all("*", createRequestHandler({ build }));

app.listen(3000, () => {
	console.log("App listening on http://localhost:3000");
});
