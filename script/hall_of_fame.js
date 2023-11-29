import { initializeApp } from './firebase/firebase-app.js';
import { getDatabase, ref, set, get } from './firebase/firebase-database.js';

$( document ).ready(function() {

    $('#body_hall_of_fame').keydown(function (e) {
        if (e.key === 'Escape') {
            e.preventDefault();
            
            window.location.href = '../dashboard.html';
        }
    });

    const firebaseConfig = {
        apiKey: "AIzaSyBYtSkWCVLBDWkR_UmL_ojguW1C6gZVPFw",
        authDomain: "keyboardwarrior-c0a0b.firebaseapp.com",
        projectId: "keyboardwarrior-c0a0b",
        storageBucket: "keyboardwarrior-c0a0b.appspot.com",
        messagingSenderId: "838198639101",
        appId: "1:838198639101:web:cfe0a3eecc334ace418194",
        measurementId: "G-ZC2XJ3JLGJ"
    };

    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app, "https://keyboardwarrior-c0a0b-default-rtdb.asia-southeast1.firebasedatabase.app");

    const hallOfFame = ref(database, 'hall_of_fame/kids');
});