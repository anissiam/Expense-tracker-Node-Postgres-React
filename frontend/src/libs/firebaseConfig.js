// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDrFEYF5f_mCIaUXiguzH4myikuMIUd1IU",
    authDomain: "tomb-raider-e178e.firebaseapp.com",
    databaseURL: "https://tomb-raider-e178e.firebaseio.com",
    projectId: "tomb-raider-e178e",
    storageBucket: "tomb-raider-e178e.firebasestorage.app",
    messagingSenderId: "139306597357",
    appId: "1:139306597357:web:66d94a65e742d5f9cc85e4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {app , auth}