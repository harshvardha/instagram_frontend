// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC1pSLi-_j-0rx67R7LTdlydrFbMGxWOzQ",
    authDomain: "instagram-clone-4d121.firebaseapp.com",
    databaseURL: "https://instagram-clone-4d121-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "instagram-clone-4d121",
    storageBucket: "instagram-clone-4d121.appspot.com",
    messagingSenderId: "635530533958",
    appId: "1:635530533958:web:723199ff81244d11ecbe47"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;