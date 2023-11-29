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

    const hallOfFameRef = ref(database, 'hall_of_fame/kids');

    get(hallOfFameRef)
    .then((snapshot) => {
        const currentKidsEntries = snapshot.val();

        var ranking = 0;

        $.each(currentKidsEntries, function(key, entry) {
            const accuracy = parseFloat(entry.accuracy);
            const wpm = parseFloat(entry.wpm);
            const time = parseFloat(entry.time);
            const username = entry.username;
        
            const newRow = $('<tr></tr>');
        
            const rankingCell = $('<td></td>');
            rankingCell.text(ranking += 1);
            newRow.append(rankingCell);
        
            const usernameCell = $('<td></td>');
            usernameCell.text(username);
            newRow.append(usernameCell);
        
            const accuracyCell = $('<td></td>');
            accuracyCell.text(accuracy);
            newRow.append(accuracyCell);
        
            const wpmCell = $('<td></td>');
            wpmCell.text(wpm);
            newRow.append(wpmCell);
        
            const timeCell = $('<td></td>');
            timeCell.text(time);
            newRow.append(timeCell);
        
            $('#tableBody').append(newRow);
        });
    })
});