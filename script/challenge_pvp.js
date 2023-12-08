import { getDatabase, ref, set, get, push} from './firebase/firebase-database.js';
import { app, auth, database } from "./firebase/firebase-init.js";

$( document ).ready(function() {
    var audioBackground = new Audio('/assets/intro.mp3');
    plaBackgroundAudio();

    function plaBackgroundAudio() {

        if (localStorage.getItem('audioPosition')) {
          audioBackground.currentTime = parseFloat(localStorage.getItem('audioPosition'));
        }z

        audioBackground.loop = true;
        audioBackground.volume = 0.5;
        audioBackground.play();        
    }

    function stopAndSetAudioPos() {
        audioBackground.onpause = audioBackground.onended = null;
        audioBackground.pause();
        localStorage.setItem('audioPosition', audioBackground.currentTime);
    }

    $('#body_challenge_pvp').keydown(function (e) {
        if (e.key === 'Escape' || e.key === 'Tab') {
            e.preventDefault();
        }
    });

    let startTime;
    let isPaused = false;

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const fromUsername = urlParams.get('fromUsername');
    const toUsername = urlParams.get('toUsername');
    const date = urlParams.get('date');
    const level = urlParams.get('level');
    let isComplete = urlParams.get('isComplete');

    checkInternetConnection();

    $("#quoteInput").focus();
    
    function checkInternetConnection() {
        const isOnline = navigator.onLine;
        if (isOnline) {
        fetch('https://api.quotable.io/random')
            .then(response => {
                if (response.ok) {
                    getNextQuote();
                } else {
                    showSnackBar('No internet connection');
                }
            })
            .catch(e => {
                showSnackBar('No internet connection')
            });
        } else {
            showSnackBar('No internet connection')
        }
    }

    async function getNextQuote() {
        switch (level) {
            case 'amateur':
                const amateurQuote = await getAmateurQuote();
                displayAmateurQuote(amateurQuote);
                break;
            case 'pro':
                const proQuote = await getProQuote();
                displayProQuote(proQuote);
                break;
            case 'legend':
                const legendQuote = await getLegendQuote();
                displayLegendQuote(legendQuote);
                break;
            default:
                break;
        }
    }

    async function getAmateurQuote() {
        return fetch("https://api.quotable.io/quotes/random?maxLength=150")
        .then((response) => response.json())
        .then((data) => data[0].content)
        .catch(error => showSnackBar('Error occured. No internet connection'));
    }
    async function getProQuote() {
        return fetch("https://api.quotable.io/quotes/random?minLength=100&maxLength=110")
        .then((response) => response.json())
        .then((data) => data[0].content)
        .catch(error => showSnackBar('Error occured. No internet connection'));
    }
    async function getLegendQuote() {
        return fetch("https://api.quotable.io/quotes/random?minLength=100&maxLength=110")
        .then((response) => response.json())
        .then((data) => data[0].content)
        .catch(error => showSnackBar('Error occured. No internet connection'));
    }

    function displayAmateurQuote(quote) {
        $("#quoteDisplay").empty();
    
        quote.split("").forEach((character, index) => {
            const randomCaseCharacter = Math.random() < 0.5 ? character.toUpperCase() : character;
            
            const characterSpan = $("<span>")
                .text(randomCaseCharacter)
                .addClass('character');
            
            $("#quoteDisplay").append(characterSpan);
        });
            
        $("#quoteInput").val("").focus();
    
        startTimer();
    }

    function displayProQuote(quote) {
        $("#quoteDisplay").empty();
    
        quote.split("").forEach((character, index) => {
            const randomNumber = Math.floor(Math.random() * 9) + 1;
            const randomCaseCharacter = Math.random() < 0.5 ? character.toUpperCase() : character;

            const characterSpan = $("<span>")
                .text(randomCaseCharacter)
                .addClass('character');
        
            const numberSpan = $("<span>")
                .text(randomNumber)
                .addClass('random-letter');

            $("#quoteDisplay").append(numberSpan).append(characterSpan).append(numberSpan);
        });
    
        $("#quoteInput").val("").focus();
    
        startTimer();
    }

    function displayLegendQuote(quote) {
        $("#quoteDisplay").empty();
        const specialCharacters = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '-', '=', '[', ']', '{', '}', '|', ';', ':', '<', '>', ',', '.', '?', '/'];
    
        quote.split("").forEach((character, index) => {
            const randomNumber = Math.floor(Math.random() * 9) + 1;
            const randomSpecialCharacter = specialCharacters[Math.floor(Math.random() * specialCharacters.length)];
            const randomCaseCharacter = Math.random() < 0.5 ? character.toUpperCase() : character;
            
            const characterSpan = $("<span>")
                .text(randomCaseCharacter)
                .addClass('character');

            const specialCharSpan = $("<span>")
                .text(randomSpecialCharacter)
                .addClass('special-character');
        
            const numberSpan = $("<span>")
                .text(randomNumber)
                .addClass('random-letter');

            $("#quoteDisplay").append(numberSpan).append(characterSpan).append(specialCharSpan);
        });
    
        $("#quoteInput").val("").focus();
    
        startTimer();
    }

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
    
    $('#quoteInput').keydown(function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    });

    function fetchResultPage() {
        var wpm = $("#wpm").text();
        var inaccuracy = $("#inaccuracy").text();
        var accuracy = $("#accuracy").text();
        var time = $("#timer").text();
        var word = $("#quoteDisplay").text();

        stopAndSetAudioPos();

        const resultPVP = {
            from: fromUsername,
            to: toUsername,
            date: date,
            word: word,
            time: time,
            level: level,
            wpm: wpm,
            accuracy: accuracy,
            inaccuracy: inaccuracy,
            isComplete: 'false',
            champion: '',
        };

        const getGlobalPvp = ref(database, 'pvp');
        get(getGlobalPvp)
        .then(() => {
            set(getGlobalPvp, resultPVP);
            window.location.href = '../dashboard.html';
        })
    }

    $('#quoteDisplay').on('copy', function(e) {
        e.preventDefault();
    });

    $('#quoteDisplay').on('contextmenu', function(e) {
        e.preventDefault(); 
    });

    $('#quoteInput').on('paste', function(e) {
        e.preventDefault();
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