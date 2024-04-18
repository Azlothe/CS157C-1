import { auth } from "../services/FirebaseService";
import { onAuthStateChanged } from "firebase/auth";

const getEmail = () => {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
            const email = user?.email || "";
            resolve(email);
        });
    });
};

export { getEmail };