import { getApp, getApps, initializeApp } from "firebase/app";
import {
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
} from "firebase/auth";
const firebaseConfig = {
	apiKey: "AIzaSyDlb_n9950e4HMmK5zhcTblzIRupEynsVs",
	authDomain: "gridhabits-b596c.firebaseapp.com",
	projectId: "gridhabits-b596c",
	storageBucket: "gridhabits-b596c.firebasestorage.app",
	messagingSenderId: "683513079484",
	appId: "1:683513079484:web:4a24a877aafcdc672f52b9",
	measurementId: "G-NJVCZ000RE",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
	try {
		console.log("hi");
		const result = await signInWithPopup(auth, googleProvider);
		return result.user;
	} catch (error) {
		console.error("Error signing in with Google", error);
	}
};

export const logout = async () => {
	try {
		await signOut(auth);
	} catch (error) {
		console.error("Error signing out", error);
	}
};
