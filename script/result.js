import { initializeApp } from './firebase/firebase-app.js'
import { getDatabase, ref, set, get } from './firebase/firebase-database.js';
import { getAuth, signOut, onAuthStateChanged  } from './firebase/firebase-auth.js'

$( document ).ready(function() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const levelValue = urlParams.get('level');
    const wpmValue = urlParams.get('wpm');
    const timeValue = urlParams.get('timer');
    const inaccuracyValue = urlParams.get('inaccuracy');
    const accuracyValue = urlParams.get('accuracy');

    $('#time-result').text(timeValue);
    $('#wpm-result').text(wpmValue);
    $('#inaccuracy-result').text(inaccuracyValue);
    $('#accuracy-result').text(accuracyValue);

    const results = {
        time: timeValue,
        wpm: wpmValue,
        accuracy: accuracyValue,
    };

    localStorage.setItem(levelValue, JSON.stringify(results));

    $('#result-body').keydown(function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();

            window.location.href = '../pages/quick_start.html' +
            '?level=' + levelValue;
        }
        else if (e.key === 'Escape') {
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
    const auth = getAuth(app);
    const database = getDatabase(app, "https://keyboardwarrior-c0a0b-default-rtdb.asia-southeast1.firebasedatabase.app");
    
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            
            if(uid){
                setUserLevelData(uid, levelValue)
            }
        }
    });

    function setUserLevelData(uid, level) {
        const userRecordsRef = ref(database, uid+'/records/levels/'+level);
        console.log(userRecordsRef);
        set(userRecordsRef, results)
            .then(() => {
                console.log(`Child record created for the "${level}" level.`);
            })
            .catch((error) => {
                console.error(`Error creating child record for the "${level}" level:`, error.message);
            });
    }
});