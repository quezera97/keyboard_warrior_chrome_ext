$( document ).ready(function() {
    var audioBackground = new Audio('/assets/intro.mp3');
    plaBackgroundAudio();

    function plaBackgroundAudio() {

        if (localStorage.getItem('audioPosition')) {
          audioBackground.currentTime = parseFloat(localStorage.getItem('audioPosition'));
        }

        audioBackground.loop = true;
        audioBackground.volume = 0.5;
        audioBackground.play();        
    }

    function stopAndSetAudioPos() {
        audioBackground.onpause = audioBackground.onended = null;
        audioBackground.pause();
        localStorage.setItem('audioPosition', audioBackground.currentTime);
    }

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const levelValue = urlParams.get('level');

    let startTime;
    
    let timerInterval;
    let isPaused = false;
  
    checkInternetConnection();

    $("#quoteInput").focus();
    $('#readyIndicator').hide();
    
    function checkInternetConnection() {
        const isOnline = navigator.onLine;
        if (isOnline) {
        fetch('https://api.quotable.io/random')
            .then(response => {
            if (response.ok) {
                getNextQuote();
            } else {
                showSnackBar('No internet connection');
                getOfflineQuote();
            }
            })
            .catch(e => {
                showSnackBar('No internet connection')
                getOfflineQuote();
            });
        } else {
            showSnackBar('No internet connection')
            getOfflineQuote();
        }
    }
    
    async function getOfflineQuote() {
        try {
            const response = await fetch('/assets/offline_quick_start-quotes.json');
            const data = await response.json();
            
            const keys = Object.keys(data);
            const randomKey = keys[Math.floor(Math.random() * keys.length)];
            const quote = data[randomKey];
        
            switch (levelValue) {
                case 'kids':
                    displayQuote(quote);
                    break;
                case 'amateur':
                    displayAmateurQuote(quote);
                    break;
                case 'pro':
                    displayProQuote(quote);
                    break;
                case 'legend':
                    displayLegendQuote(quote);
                    break;

                case 'custom':

                    const numbersValue = urlParams.get('numbers');
                    const specialCharValue = urlParams.get('specialChar');
                    const autoCapitalizeValue = urlParams.get('autoCapitalize');

                    displayCustomQuote(quote, numbersValue, specialCharValue, autoCapitalizeValue);
                    break;
            
                default:
                    displayQuote(quote);
                    break;
            }

        } catch (error) {
            showSnackBar('Error fetching or displaying quote:');
        }
    }
    

    async function getNextQuote() {
        switch (levelValue) {
            case 'kids':
                const kidsQuote = await getKidsQuote();
                displayQuote(kidsQuote);
                break;
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
            case 'custom':

                const numbersValue = urlParams.get('numbers');
                const specialCharValue = urlParams.get('specialChar');
                const autoCapitalizeValue = urlParams.get('autoCapitalize');
                const minLengthValue = urlParams.get('minLength');
                const maxLengthValue = urlParams.get('maxLength');

                const customQuote = await getCustomQuote(minLengthValue, maxLengthValue);
                displayCustomQuote(customQuote, numbersValue, specialCharValue, autoCapitalizeValue);
                break;
        
            default:
                const randomQuote = await getRandomQuote();
                displayQuote(randomQuote);
                break;
        }
    }

    async function getKidsQuote() {
        return fetch("https://api.quotable.io/quotes/random?maxLength=50")
        .then((response) => response.json())
        .then((data) => data[0].content)
        .catch(error => showSnackBar('Error occured. No internet connection'));
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
    async function getCustomQuote(minLength, maxLength) {
        return fetch("https://api.quotable.io/quotes/random?"+minLength+"&maxLength="+maxLength)
        .then((response) => response.json())
        .then((data) => data[0].content)
        .catch(error => showSnackBar('Error occured. No internet connection'));
    }
    async function getRandomQuote() {
        return fetch("https://api.quotable.io/random")
        .then((response) => response.json())
        .then((data) => data.content)
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
    function displayCustomQuote(quote, number, special, capital) {
        $("#quoteDisplay").empty();

        const specialCharacters = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '-', '=', '[', ']', '{', '}', '|', ';', ':', '<', '>', ',', '.', '?', '/'];
    
        quote.split("").forEach((character, index) => {
            if(number == 'true'){
                const randomNumber = Math.floor(Math.random() * 9) + 1;
                const numberSpan = $("<span>")
                    .text(randomNumber)
                    .addClass('random-letter');

                $("#quoteDisplay").append(numberSpan);
            }

            if(capital == 'true'){
                const randomCaseCharacter = Math.random() < 0.5 ? character.toUpperCase() : character;
                const characterSpan = $("<span>")
                    .text(randomCaseCharacter)
                    .addClass('character');
                $("#quoteDisplay").append(characterSpan)
            }
            else{
                const characterSpan = $("<span>")
                .text(character)
                .addClass('character');
                $("#quoteDisplay").append(characterSpan)
            }
            
            
            if(special == 'true'){
                const randomSpecialCharacter = specialCharacters[Math.floor(Math.random() * specialCharacters.length)];
                const specialCharSpan = $("<span>")
                    .text(randomSpecialCharacter)
                    .addClass('special-character');

                $("#quoteDisplay").append(specialCharSpan)
            }
        });
    
        $("#quoteInput").val("").focus();
    
        startTimer();
    }
    
    
    function displayQuote(quote) {
        $("#quoteDisplay").empty();
    
        $.each(quote.split(""), (_, character) => {
            const characterSpan = $("<span>").text(character);
            $("#quoteDisplay").append(characterSpan);
        });
    
        $("#quoteInput").val("").focus();
    
        startTimer();
    }

    function startTimer() {
        $("#timer").text(0);
        startTime = new Date();
    
        timerInterval = setInterval(() => {
            if (!isPaused) {
                $("#timer").text(getTimerTime());
            }
        }, 1000);
    }

    function pauseTimer() {
        if (!isPaused) {
            clearInterval(timerInterval);
            isPaused = true;
        }
    }

    function resetTimer() {
        clearInterval(timerInterval);
        $("#timer").text(0);
        isPaused = false;
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
        if (e.key === 'Tab') {
            e.preventDefault();

            pauseTimer();

            $('#reset').show().focus();
            $('#quoteInput').addClass('overlay');
            $('#quoteInput').attr('disabled', true);
            $('#reset-hint').hide();
        }
        else if (e.key === 'Escape') {
            e.preventDefault();

            pauseTimer();

            $('#escape').show().focus();
            $('#quoteInput').addClass('overlay');
            $('#quoteInput').attr('disabled', true);
            $('#reset-hint').hide();
        }
        else if (e.key === 'Enter') {
            e.preventDefault();
        }
    });

    $('#reset').keydown(function (e) {
        if (e.key === 'Tab') {
            e.preventDefault();

            checkInternetConnection();
            
            $('#reset').hide();
            
            $('#readyIndicator').show();
            
            setTimeout(function() {
                $('#readyIndicator').hide();
                $('#quoteInput').removeClass('overlay');
                $('#quoteInput').attr('disabled', false);
                $('#reset-hint').show();
                $('#quoteInput').focus();

                resetTimer();
                startTimer();
            }, 1000);
        }
        else if (e.key === 'Enter') {
            e.preventDefault();
        }
    });

    $('#escape').keydown(function (e) {
        if (e.key === 'Escape') {
            e.preventDefault();

            if(levelValue == 'custom'){
                stopAndSetAudioPos();

                window.location.href = '../pages/custom_words.html';
            }
            else{
                stopAndSetAudioPos();

                window.location.href = '../dashboard.html';
            }

        }
        else if (e.key === 'Enter') {
            e.preventDefault();
        }
    });

    function fetchResultPage() {
        var wpm = $("#wpm").text();
        var inaccuracy =$("#inaccuracy").text();
        var accuracy =$("#accuracy").text();
        var time = $("#timer").text();

        stopAndSetAudioPos();

        window.location.href = '../pages/result.html' + 
            '?level=' + encodeURIComponent(levelValue) + 
            '&wpm=' + encodeURIComponent(wpm) + 
            '&timer=' + encodeURIComponent(time) + 
            '&accuracy=' + encodeURIComponent(accuracy) +
            '&inaccuracy=' + encodeURIComponent(inaccuracy);
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