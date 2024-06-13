import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const db = getFirestore();
export const auth = getAuth();
