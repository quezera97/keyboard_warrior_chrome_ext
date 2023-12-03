import { initializeApp } from './firebase/firebase-app.js'
import { getDatabase, ref, set, get } from './firebase/firebase-database.js';
import { getAuth, signOut, onAuthStateChanged  } from './firebase/firebase-auth.js'

$( document ).ready(function() {
    $('#dummy-container').show();

    var audioSparta = new Audio('/assets/intro_sparta.mp3');
    audioSparta.volume = 0.4;
    audioSparta.play();

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

    $('#body').keydown(function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();

            stopAndSetAudioPos();
            
            window.location.href = 'pages/quick_start.html';
        }
    });

    $('#practice-level').click(function () {
        stopAndSetAudioPos();

        window.location.href = 'pages/quick_start.html';
    });

    $('#kids-level').click(function () {
        stopAndSetAudioPos();

        window.location.href = '../pages/quick_start.html' + 
            '?level=kids';
    });

    $('#amateur-level').click(function () {
        stopAndSetAudioPos();

        window.location.href = '../pages/quick_start.html' + 
            '?level=amateur';
    });

    $('#pro-level').click(function () {
        stopAndSetAudioPos();

        window.location.href = '../pages/quick_start.html' + 
            '?level=pro';
    });

    $('#legend-level').click(function () {
        stopAndSetAudioPos();

        window.location.href = '../pages/quick_start.html' + 
            '?level=legend';
    });

    $('#custom-level').click(function () {
       stopAndSetAudioPos();

        window.location.href = '../pages/custom_words.html'
    });

    $('#login-user').click(function () {
        stopAndSetAudioPos();

        window.location.href = '../pages/login_register.html'
    });

    $('#user-profile').click(function () {
        stopAndSetAudioPos();

        window.location.href = '../pages/user_profile.html'
    });

    $('#pvp').click(function () {
        stopAndSetAudioPos();

        window.location.href = '../pages/pvp.html'
    });

    $('#hall-of-fame').click(function () {
        stopAndSetAudioPos();

        window.location.href = '../pages/hall_of_fame.html'
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
    var uid = localStorage.getItem('uid');
    
    onAuthStateChanged(auth, (user) => {
        if (user) {
            if (user.emailVerified) {
                uid = user.uid;
                
                if(uid){
                    setUserResults(uid, 'kids');
                    setUserResults(uid, 'amateur');
                    setUserResults(uid, 'pro');
                    setUserResults(uid, 'legend');
                }
            }
            else{
                showSnackBar('User email is not verified');
            }
        }
        else {
            displayStatsLocalStorage('kids');
            displayStatsLocalStorage('amateur');
            displayStatsLocalStorage('pro');
            displayStatsLocalStorage('legend');
        }

        showDivFaction(uid);
    });

    function showDivFaction(uid){
        $('#user-faction-container').show();
        $('#dummy-container').hide();

        if(uid){
            $('#faction-selection-container').hide();
            $('#user-profile-container').show();
        }
        else{
            $('#faction-selection-container').show();
            $('#user-profile-container').hide();
        }
    }


    function setUserResults(uid, level) {
        const usernameRef = ref(database, uid+'/username');
        get(usernameRef)
            .then((snapshot) => {
                const username = snapshot.val();

                $('#username').text(username != '' ? username : 'Spartan');

                localStorage.setItem('username', username ?? 'Guest');
        });

        const userRecordsRef = ref(database, uid+'/records/levels/'+level);
        
        get(userRecordsRef)
            .then((snapshot) => {
                const resultsFromFirebase = snapshot.val();

                $(`#${level}-time-result`).text(resultsFromFirebase.time != '' ? resultsFromFirebase.time : 0);
                $(`#${level}-wpm-result`).text(resultsFromFirebase.wpm != '' ? resultsFromFirebase.wpm : 0);
                $(`#${level}-accuracy-result`).text(resultsFromFirebase.accuracy != '' ? resultsFromFirebase.accuracy : 0);

                const results = {
                    time: resultsFromFirebase.time != '' ? resultsFromFirebase.time : 0,
                    wpm: resultsFromFirebase.wpm != '' ? resultsFromFirebase.wpm : 0,
                    accuracy: resultsFromFirebase.accuracy != '' ? resultsFromFirebase.accuracy : 0,
                };

                localStorage.setItem(level, JSON.stringify(results));

                return results;
            })
            .catch((error) => {
                console.error('Error checking user existence:', error.message);
                return false;
            });
    }

    function displayStatsLocalStorage(level) {
        var stats = localStorage.getItem(level);
        if (stats) {
            stats = JSON.parse(stats);
    
            $(`#${level}-time-result`).text(stats.time != '' ? stats.time : 0);
            $(`#${level}-wpm-result`).text(stats.wpm != '' ? stats.wpm : 0);
            $(`#${level}-accuracy-result`).text(stats.accuracy != '' ? stats.accuracy : 0);
        }
    }

    var snackbar = $("#snackbar");
    function showSnackBar(message) {
        $('#snackbar-text').text(message);

        snackbar.addClass("show");
        setTimeout(function(){
            snackbar.removeClass("show");
        }, 3000);
    }
});