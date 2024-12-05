import admin from "firebase-admin";

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.applicationDefault(),
	});
}

export const verifyToken = async (token) => {
	try {
		return await admin.auth().verifyIdToken(token);
	} catch (error) {
		console.error("Error verifying token", error);
		throw new Error("Invalid token");
	}
};
