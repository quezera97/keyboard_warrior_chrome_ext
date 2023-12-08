import { getDatabase, ref, set, get } from './firebase/firebase-database.js';
import { getAuth, signOut, onAuthStateChanged  } from './firebase/firebase-auth.js'
import { app, auth, database } from "./firebase/firebase-init.js";

$( document ).ready(function() {
    $('#pvp-challenge, #pvp-top-container').hide();

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

    $('#body_notification').keydown(function (e) {
        if (e.key === 'Escape' || e.key === 'Tab') {
            e.preventDefault();
        }
    });

    $('#escape-button').click(function (e) {
        stopAndSetAudioPos();

        window.location.href = '../dashboard.html';
    });

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let username = urlParams.get('username');

    const getGlobalPvp = ref(database, 'pvp');

    let challengeQuote = '';
    let startTime;
    let isPaused = false;
    let pvpData;
    
    onAuthStateChanged(auth, (user) => {
        if (user) {
            if (user.emailVerified) {
                get(getGlobalPvp).then((snapshot) => {
                    if(snapshot.val()){
                        pvpData = snapshot.val();
            
                        $('#word-pvp').text(pvpData.word);
                        $('#challenger-pvp').text(pvpData.from);
            
                        challengeQuote = pvpData.word;
            
                        if(pvpData.to != username || pvpData.isComplete == 'false'){
                            $('#begin-battle').hide();
                            $('#notification-text').text('You have no challenges');
                        }
                        else{
                            $('#begin-battle').show();
                        }
                    }
                    else{ showSnackBar('Error getting information'); }
                })
                .catch((error) => {
                    showSnackBar('Error getting information');
                });
            }
            else{
                $('#notification-text').text('Warrior need to be recognised to be challenged');
                showSnackBar('User email is not verified');
            }
        }
        else{
            $('#notification-text').text('Warrior not registered');
            showSnackBar('User not found');
        }
    });
    

    $('#begin-battle').click(function (e) {
        $('#notification-challenge, #notification-top-container').hide();
        $('#pvp-challenge, #pvp-top-container').show();

        $("#quoteInput").focus();

        displayChallengeQuote();
    });

    function displayChallengeQuote() {
        $("#quoteDisplay").empty();

        setTimeout(function() {
            $.each(challengeQuote.split(""), (_, character) => {
                const characterSpan = $("<span>").text(character);
                $("#quoteDisplay").append(characterSpan);
            });
            $('#reset-hint').show();
            $('#quoteInput').focus();

            startTimer();
        }, 1000);
    }

    $('#quoteInput').on("input", () => {
        const quoteArray = $("#quoteDisplay").find("span").toArray();
        const valueArray = $("#quoteInput").val().split("");
        let correctCharsCount = 0;
        let wrongCharsCount = 0;
        let totalCharsCount = 0;
        
        quoteArray.forEach((characterSpan, i) => {
            const character = valueArray[i];
    
            if (character == null) {
                $(characterSpan).removeClass("right wrong");
            } else if (character === $(characterSpan).text()) {
                $(characterSpan).addClass("right").removeClass("wrong");
                correctCharsCount++;
            } else {
                $(characterSpan).removeClass("right").addClass("wrong");
                wrongCharsCount++;
            }
    
            totalCharsCount++;
        });

        $('#quoteInput').focus();
    
        const calculateWpm = Math.round(correctCharsCount * 60 / (getTimerTime() * 5) * 10) / 10;
    
        if (isNaN(calculateWpm) || calculateWpm < 0) {
            $("#wpm").text("0");
        } else {
            $("#wpm").text(calculateWpm);
        }
    
        const inAccuracyPercentage = (wrongCharsCount / totalCharsCount) * 100;
        $("#inaccuracy").text(inAccuracyPercentage.toFixed(2));

        const accuracyPercentage = (correctCharsCount / totalCharsCount) * 100;
        $("#accuracy").text(accuracyPercentage.toFixed(2));
    
        if (valueArray.length === totalCharsCount) {
            fetchResultPage();
        }
    });

    function fetchResultPage() {
        var wpm = $("#wpm").text();
        var inaccuracy = $("#inaccuracy").text();
        var accuracy = $("#accuracy").text();
        var time = $("#timer").text();

        stopAndSetAudioPos();

        let resultPvp = {
            from: pvpData.from,
            to: pvpData.to,
            date: pvpData.date,
            word: pvpData.word,
            time: time,
            level: pvpData.level,
            wpm: wpm,
            accuracy: accuracy,
            inaccuracy: inaccuracy,
            isComplete: 'false',
            champion: '',
        }

        if(pvpData.accuracy == accuracy && pvpData.wpm == wpm){
            //draw
            resultPvp.isComplete = 'true';
            resultPvp.champion = 'Draw';
        }
        else if(pvpData.accuracy == accuracy ){
            if(wpm < pvpData.wpm){
                //chalenger won
                resultPvp.isComplete = 'true';
                resultPvp.champion = pvpData.from;
            }
            else{
                //opponent won
                resultPvp.time = time;
                resultPvp.wpm = wpm;
                resultPvp.accuracy = accuracy;
                resultPvp.inaccuracy = inaccuracy;
                resultPvp.isComplete = 'true';
                resultPvp.champion = username;
            }
        }
        else if(accuracy < pvpData.accuracy){
            //challenger won
            resultPvp.isComplete = 'true';
            resultPvp.champion = pvpData.from;
        }
        else if(accuracy > pvpData.accuracy){
            //opponent won
            resultPvp.time = time;
            resultPvp.wpm = wpm;
            resultPvp.accuracy = accuracy;
            resultPvp.inaccuracy = inaccuracy;
            resultPvp.isComplete = 'true';
            resultPvp.champion = username;
        }

        updateResultPvp(resultPvp);
    }
    
    function updateResultPvp(resultPvp) {
        const getGlobalPvp = ref(database, 'pvp');
        get(getGlobalPvp)
        .then(() => {
            set(getGlobalPvp, resultPvp);
            window.location.href = '../dashboard.html';
        });
    }
    
    $('#quoteInput').keydown(function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    });

    function startTimer() {
        $("#timer").text(0);
        startTime = new Date();
    
        setInterval(() => {
            if (!isPaused) {
                $("#timer").text(getTimerTime());
            }
        }, 1000);
    }

    function getTimerTime() {
        let currentTime = new Date() - startTime;
        let seconds = Math.floor(currentTime / 1000);
        return seconds;
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