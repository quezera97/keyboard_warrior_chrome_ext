import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js'
import { getDatabase, ref, set, get } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js';

$( document ).ready(function() {
    var audioSparta = new Audio('/assets/intro_sparta.mp3');
    var audioBackground = new Audio('/assets/intro.mp3');
    
    audioSparta.volume = 0.7;
    audioSparta.play();
    audioBackground.play();

    $('#body').keydown(function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            
            window.location.href = 'pages/quick_start.html';
        }
    });

    $('#quick-start').click(function () {
        window.location.href = 'pages/quick_start.html';
    });

    $('#kids-level').click(function () {
        window.location.href = '../pages/quick_start.html' + 
            '?level=kids';
    });

    $('#amateur-level').click(function () {
        window.location.href = '../pages/quick_start.html' + 
            '?level=amateur';
    });

    $('#pro-level').click(function () {
        window.location.href = '../pages/quick_start.html' + 
            '?level=pro';
    });

    $('#legend-level').click(function () {
        window.location.href = '../pages/quick_start.html' + 
            '?level=legend';
    });

    $('#custom-level').click(function () {
        window.location.href = '../pages/custom_words.html'
    });

    $('#login-user').click(function () {
        window.location.href = '../pages/login_register.html'
    });

    $('#user-profile').click(function () {
        window.location.href = '../pages/user_profile.html'
    });

    const uid = localStorage.getItem('uid');
    
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

    if(uid){
        $('#faction-selection-container').hide();
        $('#user-profile-container').show();

        setUserResults(uid, 'kids');
        setUserResults(uid, 'amateur');
        setUserResults(uid, 'pro');
        setUserResults(uid, 'legend');
    }
    else{
        $('#faction-selection-container').show();
        $('#user-profile-container').hide();
    }

    function setUserResults(uid, level) {
        const userRecordsRef = ref(database, uid+'/records/levels/'+level);
        
        get(userRecordsRef)
            .then((snapshot) => {
                const results = snapshot.val();

                $(`#${level}-time-result`).text(results.time != '' ? results.time : 0);
                $(`#${level}-wpm-result`).text(results.wpm != '' ? results.wpm : 0);
                $(`#${level}-accuracy-result`).text(results.accuracy != '' ? results.accuracy : 0);

                return results;
            })
            .catch((error) => {
                console.error('Error checking user existence:', error.message);
                return false;
            });
    }

    displayStatsLocalStorage('kids');
    displayStatsLocalStorage('amateur');
    displayStatsLocalStorage('pro');
    displayStatsLocalStorage('legend');

    function displayStatsLocalStorage(level) {
        var stats = localStorage.getItem(level);
        if (stats) {
            stats = JSON.parse(stats);
    
            $(`#${level}-time-result`).text(stats.time != '' ? stats.time : 0);
            $(`#${level}-wpm-result`).text(stats.wpm != '' ? stats.wpm : 0);
            $(`#${level}-accuracy-result`).text(stats.accuracy != '' ? stats.accuracy : 0);
        }
    }

});