import { initializeApp } from './firebase/firebase-app.js'
import { getAuth, signOut, onAuthStateChanged  } from './firebase/firebase-auth.js'

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

    $('#body_user_profile').keydown(function (e) {
        if (e.key === 'Escape') {
            e.preventDefault();

            stopAndSetAudioPos();

            window.location.href = '../dashboard.html';
        }
    });

    $('#logout-user').click(function () {
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
        
        signOut(auth);

        onAuthStateChanged(auth, (user) => {
            if (!user) {
                localStorage.removeItem("uid");
                localStorage.removeItem("kids");
                localStorage.removeItem("amateur");
                localStorage.removeItem("legend");
                localStorage.removeItem("pro");

                stopAndSetAudioPos();

                window.location.href = '../dashboard.html';
            }
          });
    })
});