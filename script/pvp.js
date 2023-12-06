import { initializeApp } from './firebase/firebase-app.js'
import { getDatabase, ref, set, get } from './firebase/firebase-database.js';

$( document ).ready(function() {
    var audioBackground = new Audio('/assets/intro.mp3');
    plaBackgroundAudio();

    function plaBackgroundAudio() {

        if (localStorage.getItem('audioPosition')) {
          audioBackground.currentTime = parseFloat(localStorage.getItem('audioPosition'));
        }

        audioBackground.loop = true;
        audioBackground.play();        
    }

    function stopAndSetAudioPos() {
        audioBackground.onpause = audioBackground.onended = null;
        audioBackground.pause();
        localStorage.setItem('audioPosition', audioBackground.currentTime);
    }

    $('.select2').select2();

    $('#body_pvp').keydown(function (e) {
        if (e.key === 'Escape') {
            e.preventDefault();

            stopAndSetAudioPos();
            
            window.location.href = '../dashboard.html';
        }
    });

    $('#escape-button').click(function (e) {
        stopAndSetAudioPos();

        window.location.href = '../dashboard.html';
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

    const getUsername = ref(database, 'username');
    get(getUsername).then((snapshot) => {
        if(snapshot.val()){
            let usernameData = snapshot.val();

            $("#list-username").select2({
                data: usernameData,
            });
        }
        else{ showSnackBar('Error getting information'); }
    })
    .catch((error) => {
        showSnackBar('Error getting information');
    });

    const getGlobalPvp = ref(database, 'pvp');
    
    get(getGlobalPvp).then((snapshot) => {
        if(snapshot.val()){
            let pvpData = snapshot.val();            
        }
        else{ showSnackBar('Error getting information'); }
    })
    .catch((error) => {
        showSnackBar('Error getting information');
    });


    var snackbar = $("#snackbar");
    function showSnackBar(message) {
        $('#snackbar-text').text(message);

        snackbar.addClass("show");
        setTimeout(function(){
            snackbar.removeClass("show");
        }, 3000);
    }
});

// const defaultPvp = {
//     from: username, //username
//     to: '', //username
//     date: '',
//     word: '',
//     time: '',
//     wpm: '',
//     accuracy: '',
//     isComplete: false,
//     champion: '',
// };