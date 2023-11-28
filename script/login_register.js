// import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js'
// import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-analytics.js'
// import { getDatabase, ref, set, get } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js';
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js'

import { initializeApp } from './firebase/firebase-app.js';
import { getAnalytics } from './firebase/firebase.analytics.js';
import { getDatabase, ref, set, get } from './firebase/firebase-database.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from './firebase/firebase-auth.js';

$( document ).ready(function() {
    var snackbar = $("#snackbar");

    var audioBackground = new Audio('/assets/intro.mp3');
    audioBackground.play();

    $('#body_login_register').keydown(function (e) {
        if (e.key === 'Escape') {
            e.preventDefault();

            window.location.href = '../dashboard.html';
        }
    });

    const defaultUserData = {
        time: '',
        wpm: '',
        accuracy: '',
    };
    
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
    // const database = getDatabase(app);

    $('#submit_register').click(function () {
        var email = $('#email_register').val();
        var password = $('#password_register').val();

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                const uid = user.uid;

                checkUserExists(uid, 'register')
                .then((userExists) => {
                    if (userExists) {
                        showSnackBar('User already exist');
                    } else {
                        setUserLevelData(uid, 'kids');
                        setUserLevelData(uid, 'amateur');
                        setUserLevelData(uid, 'pro');
                        setUserLevelData(uid, 'legend');

                        signIn(auth, email, password);
                    }
                });
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);

                if (errorMessage.includes('email-already-in-use')) {
                    showSnackBar('Email is already in use');
                } else {
                    showSnackBar('An unexpected error occurred: ' + errorMessage);
                }
            });
    });

    $('#submit_login').click(function () {
        var email = $('#email_login').val();
        var password = $('#password_login').val();

        signIn(auth, email, password);        
    });

    function signIn(auth, email, password) {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                const uid = user.uid;

                const storedUid = localStorage.getItem("uid");

                checkStoredUid(storedUid, uid);

                checkUserExists(uid, 'login')
                .then((userExists) => {
                    if (userExists) {
                        var detailLevels = userExists.records.levels;

                        var detailKid = detailLevels.kids;
                        var detailAmateur = detailLevels.amateur;
                        var detailLegend = detailLevels.legend;
                        var detailPro = detailLevels.pro;

                        localStorage.setItem("kids", JSON.stringify(detailKid));
                        localStorage.setItem("amateur", JSON.stringify(detailAmateur));
                        localStorage.setItem("legend", JSON.stringify(detailLegend));
                        localStorage.setItem("pro", JSON.stringify(detailPro));
                        
                        window.location.href = '../dashboard.html';

                    } else {
                        showSnackBar('User not found. Please register');
                    }
                });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Login error:', errorMessage);
    
                if (errorCode === 'auth/user-not-found') {
                    console.log('User not found. Please register.');
                } else if (errorCode === 'auth/wrong-password') {
                    showSnackBar('Incorrect password. Please try again');
                } else {
                    showSnackBar('An unexpected error occurred: ' + errorMessage);
                }
            });

        showSnackBar('Logged in');
    }

    function checkStoredUid(storedUid, firebaseUid) {
        if (!storedUid) {
            localStorage.setItem("uid", firebaseUid);
        } else if (storedUid !== firebaseUid) {
            localStorage.removeItem("uid");
            localStorage.removeItem("kids");
            localStorage.removeItem("amateur");
            localStorage.removeItem("legend");
            localStorage.removeItem("pro");
            localStorage.setItem("uid", firebaseUid);
        }
    }

    function checkUserExists(uid, typeOfCheck) {
        const userRef = ref(database, `${uid}/`);
        
        return get(userRef)
            .then((snapshot) => {
                const userData = snapshot.val();

                return typeOfCheck == 'register' ? !!userData : userData;
            })
            .catch((error) => {
                showSnackBar('Error checking user existence: '+ error.message);
                return false;
            });
    }

    function setUserLevelData(uid, level) {
        const userRecordsRef = ref(database, uid+'/records/levels/'+level);
        set(userRecordsRef, defaultUserData)            
            .catch((error) => {
                showSnackBar('Unexpected error occured: '+ error.message);
            });
    }

    function showSnackBar(message) {
        $('#snackbar-text').text(message);

        snackbar.addClass("show");
        setTimeout(function(){
            snackbar.removeClass("show");
        }, 3000);
    }
});
// admin@gmail.com
