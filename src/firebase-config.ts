// src/app/firebase-config.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCSje9yAA8mf0XWZiGBTEuEvX-_jauujsI",
    authDomain: "agilepoker-a96d4.firebaseapp.com",
    projectId: "agilepoker-a96d4",
    storageBucket: "agilepoker-a96d4.appspot.com",
    messagingSenderId: "729359633064",
    appId: "1:729359633064:web:4c6881b81bbcbb6434509d",
    measurementId: "G-M9T850WS5T"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
