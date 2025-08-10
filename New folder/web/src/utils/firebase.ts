// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD_huYlgRzWHgLk50KEpdZ39LWfmYOpwB4",
    authDomain: "training-3f6e4.firebaseapp.com",
    projectId: "training-3f6e4",
    storageBucket: "training-3f6e4.firebasestorage.app",
    messagingSenderId: "112115028405",
    appId: "1:112115028405:web:8ddbfc1844cc8a71ccc9fc",
    measurementId: "G-X9RZJFLCEX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
