

import { getAnalytics } from './firebase/firebase.analytics.js';
import { getDatabase, ref, set, get, push } from './firebase/firebase-database.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, fetchSignInMethodsForEmail  } from './firebase/firebase-auth.js';
import { app, auth, database } from "./firebase/firebase-init.js";

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

    $('#body_login_register').keydown(function (e) {
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
    
    var username = '';

    var emailRegister = null;
    var passwordRegister = null;

    var modal = $("#captcha-modal");
    var span = $(".close").eq(0);

    span.on("click", function() {
        modal.css("display", "none");
    });
    
    $(window).on("click", function(event) {
        if ($(event.target).is(modal)) {
            modal.css("display", "none");
        }
    });

    $('#submit_register').click(function () {
        var email = $('#email_register').val();
        var password = $('#password_register').val();
        var repeatPassword = $('#repeat_password_register').val();
        username = $('#username_register').val() ?? 'Guest';

        emailRegister = email;
        passwordRegister = password;

        if (!isValidEmail(email)) {
            showSnackBar('Email address format is incorrect');
        } else {
            if(email == ''){
                showSnackBar('Please key-in your email address');
            }
            else if(password == ''){
                showSnackBar('Please key-in your password');
            }
            else{
                if(password !== repeatPassword){
                    showSnackBar('Password must be same');
                }
                else{
                    const collectionUsernameRef = ref(database, 'username');

                    get(collectionUsernameRef)
                        .then((snapshot) => {
                        if (snapshot.exists()) {
                            let usernamesArray = snapshot.val();

                            if(!usernamesArray.includes(username)){                                
                                modal.css("display", "block");
                            }
                            else{
                                showSnackBar('Username already taken');
                            }

                        } else {
                            modal.css("display", "block");
                        }
                    });
                }
            }
        }
    });

    async function registerIntoFirebase() {
        try {
            const methods = await fetchSignInMethodsForEmail(auth, emailRegister);
            
            if (methods && methods.length > 0) {
                showSnackBar('Email address is already in use');
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, emailRegister, passwordRegister);
                const user = userCredential.user;
                const uid = user.uid;
    
                const userExists = await checkUserExists(uid, 'register');
                if (userExists) {
                    showSnackBar('User already exists');
                } else {
                    await sendEmailVerification(auth.currentUser);
                    showSnackBar('Email verification sent successfully');
    
                    const collectionUsernameRef = ref(database, 'username');
                    const snapshot = await get(collectionUsernameRef);
    
                    if (snapshot.exists()) {
                        let usernamesArray = snapshot.val();
                        usernamesArray.push(username);
                        await set(collectionUsernameRef, usernamesArray);
                    } else {
                        await set(collectionUsernameRef, [username]);
                    }
    
                    // Setting user level data
                    setUserLevelData(uid, 'kids');
                    setUserLevelData(uid, 'amateur');
                    setUserLevelData(uid, 'pro');
                    setUserLevelData(uid, 'legend');

                    stopAndSetAudioPos();
    
                    window.location.href = './login_register.html';
                }
            }
        } catch (error) {
            const errorMessage = error.message;
    
            if (errorMessage.includes('email-already-in-use')) {
                showSnackBar('Email is already in use');
                modal.css("display", "none");
            } else {
                showSnackBar('Invalid credentials');
                modal.css("display", "none");
            }
        }
    }

    $('#submit_login').click(function () {
        var email = $('#email_login').val();
        var password = $('#password_login').val();

        if (!isValidEmail(email)) {
            showSnackBar('Email address format is incorrect');
        } else {
            if(email == ''){
                showSnackBar('Please key-in your email address');
            }
            else if(password == ''){
                showSnackBar('Please key-in your password');
            }
            else{
                signIn(auth, email, password);
            }
        }
    });

    function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    function signIn(auth, email, password) {
        showLoadingIndicator();

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                const uid = user.uid;

                if(user.emailVerified){
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

                            stopAndSetAudioPos();

                            localStorage.setItem('user', 'spartan');
                            
                            window.location.href = '../dashboard.html';

                            showSnackBar('Logged in');

                        } else {
                            hideLoadingIndicator();
                            showSnackBar('User not found. Please register');
                        }
                    });
                }
                else{
                    hideLoadingIndicator();
                    showSnackBar('Email not verified. Please verify your email.');
                }
            })
            .catch((e) => {
                hideLoadingIndicator();
                showSnackBar('Incorrect login credentials');
            });        
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
                showSnackBar('Error checking user existence');
                return false;
            });
    }

    function setUserLevelData(uid, level) {               
        const usernameRef = ref(database, uid+'/username');
        set(usernameRef, username)
            .catch((error) => {
                showSnackBar('Unexpected error occured: '+ error.message);
            });

        const defaultUserData = {
            time: '',
            wpm: '',
            accuracy: '',
        };
            
        const userRecordsRef = ref(database, uid+'/records/levels/'+level);
        set(userRecordsRef, defaultUserData)            
            .catch((error) => {
                showSnackBar('Unexpected error occured: '+ error.message);
            });
    }

    var snackbar = $("#snackbar");    
    function showSnackBar(message) {
        $('#snackbar-text').text(message);

        snackbar.addClass("show");
        setTimeout(function(){
            snackbar.removeClass("show");
        }, 3000);
    }
    
    let captcha = generateCaptcha();
    let captcha2 = generateCaptcha2();
    let isCaptcha1Verified = false;
    let isCaptcha2Verified = false;

    function checkCaptchasAndRegister() {
        if (isCaptcha1Verified && isCaptcha2Verified) {
            registerIntoFirebase();
        }
    }

    function generateCaptcha() {
        const chars = 'ABCDEFGHIJKMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz023456789~!@#$%^&*()-_=+[{]};:,<.>/?';
        let captchaCode = '';
        for (let i = 0; i < 5; i++) {
            captchaCode += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return captchaCode;
    }

    function generateCaptcha2() {
        const operators = ['+', '-', '*'];
        const num1 = Math.floor(Math.random() * 10);
        const num2 = Math.floor(Math.random() * 10);
        const operator = operators[Math.floor(Math.random() * operators.length)];
    
        let result;
        let captcha;
    
        switch (operator) {
            case '+':
                result = num1 + num2;
                captcha = `${num1} ${operator} ${num2}`;
                break;
            case '-':
                result = num1 - num2;
                captcha = `${num1} ${operator} ${num2}`;
                break;
            case '*':
                result = num1 * num2;
                captcha = `${num1} ${operator} ${num2}`;
                break;
            default:
                break;
        }
    
        return {
            captcha: captcha,
            result: result.toString()
        };
    }
    
    $('#captcha-code').text(captcha);
    $('#captcha-code-2').text(captcha2.captcha);

    $('#verify-captcha').click(function() {
        
        const userInput = $('#user-input').val().trim();

        if (userInput === captcha) {
            $('#message').text('Captcha verification successful!').css('color', 'green');

            isCaptcha1Verified = true;
            checkCaptchasAndRegister();
        } else {
            $('#message').text('Incorrect Captcha! Please try again.').css('color', 'red');
            checkCaptchasAndRegister();
            isCaptcha1Verified = false;
            captcha = generateCaptcha();

            $('#captcha-code').text(captcha);
        }
    });

    $('#verify-captcha-2').click(function() {
        const userInput = $('#user-input-2').val();

        if (userInput == captcha2.result) {
            $('#message-2').text('Captcha verification successful!').css('color', 'green');

            isCaptcha2Verified = true;
            checkCaptchasAndRegister();
        } else {
            $('#message-2').text('Incorrect Captcha! Please try again.').css('color', 'red');

            isCaptcha2Verified = false;
            captcha2 = generateCaptcha2();

            $('#captcha-code-2').text(captcha2.captcha);
        }
    });

    function showLoadingIndicator() {
        $('#loading-overlay').css('display', 'flex');
    }

    function hideLoadingIndicator() {
        $('#loading-overlay').css('display', 'none');
    }
});