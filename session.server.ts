import { createCookieSessionStorage } from "@remix-run/node";

type SessionData = {
	userId: string;
};

type SessionFlashData = {
	error: string;
};

export const sessionStorage =
	createCookieSessionStorage<SessionData, SessionFlashData>({
		cookie: {
			name: "__session",
			// domain: "remix.run",
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 7,
			path: "/",
			sameSite: "lax",
			secrets: [process.env.SESSION_SECRET || "default_secret"],
			secure: true,
		},
	});
