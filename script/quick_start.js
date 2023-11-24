$( document ).ready(function() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const levelValue = urlParams.get('level');

    let startTime;
  
    checkInternetConnection();

    $("#quoteInput").focus();
    
    function checkInternetConnection() {
        const isOnline = navigator.onLine;
        if (isOnline) {
        fetch('https://api.quotable.io/random')
            .then(response => {
            if (response.ok) {
                console.log('Device is connected to the internet');
                getNextQuote();
            } else {
                console.log('Device might not have an internet connection');
                getOfflineQuote();
            }
            })
            .catch(error => {
            console.log('Error occurred. Device might not have an internet connection');
            getOfflineQuote();
            });
        } else {
        console.log('Device is reported as offline by the browser');
        getOfflineQuote();
        }
    }
    
    async function getOfflineQuote() {
        try {
        const response = await fetch('assets/offline_quick_start-quotes.json');
        const data = await response.json();
        
        const keys = Object.keys(data);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const quote = data[randomKey];
    
        displayQuote(quote);
        
        } catch (error) {
        console.error('Error fetching or displaying quote:', error);
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
        .catch(error => console.log(error));
    }
    async function getAmateurQuote() {
        return fetch("https://api.quotable.io/quotes/random?maxLength=150")
        .then((response) => response.json())
        .then((data) => data[0].content)
        .catch(error => console.log(error));
    }
    async function getProQuote() {
        return fetch("https://api.quotable.io/quotes/random?minLength=100&maxLength=110")
        .then((response) => response.json())
        .then((data) => data[0].content)
        .catch(error => console.log(error));
    }
    async function getLegendQuote() {
        return fetch("https://api.quotable.io/quotes/random?minLength=100&maxLength=110")
        .then((response) => response.json())
        .then((data) => data[0].content)
        .catch(error => console.log(error));
    }
    async function getRandomQuote() {
        return fetch("https://api.quotable.io/random")
        .then((response) => response.json())
        .then((data) => data.content)
        .catch(error => console.log(error));
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
            setInterval(() => {
            $("#timer").text(getTimerTime());
        }, 1000);
    }
    
    function getTimerTime() {
        return Math.floor((new Date() - startTime) / 1000);
    }

    $('#quoteInput').on("input", () => {
        const quoteArray = $("#quoteDisplay").find("span").toArray();
        const valueArray = $("#quoteInput").val().split("");
        let correctCharsCount = 0;
        let wrongCharsCount = 0;
        let totalCharsCount = 0;
        
        quoteArray.forEach((characterSpan, i) => {
            const character = valueArray[i];
            console.log(character);
    
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
    
        const calculateWpm = Math.round(correctCharsCount * 60 / (getTimerTime() * 5) * 10) / 10;
    
        if (isNaN(calculateWpm) || calculateWpm < 0) {
            $("#wpm").text("0");
        } else {
            $("#wpm").text(calculateWpm);
        }
    
        const inAccuracyPercentage = (wrongCharsCount / totalCharsCount) * 100;
        $("#inaccuracy").text(inAccuracyPercentage.toFixed(2) + "%");

        const accuracyPercentage = (correctCharsCount / totalCharsCount) * 100;
        $("#accuracy").text(accuracyPercentage.toFixed(2) + "%");
    
        if (valueArray.length === totalCharsCount) {
            fetchResultPage();
        }
    });
    
    $('#quoteInput').keydown(function (e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            
            $('#reset').show().focus();
            $('#quoteInput').addClass('overlay');
            $('#quoteInput').attr('disabled', true);
            $('#reset-hint').hide();
        }
        else  if (e.key === 'Escape') {
            e.preventDefault();

            $('#escape').show().focus();
            $('#quoteInput').addClass('overlay');
            $('#quoteInput').attr('disabled', true);
            $('#reset-hint').hide();
        }
    });

    $('#reset').keydown(function (e) {
        if (e.key === 'Tab') {
            e.preventDefault();

            checkInternetConnection();

            $('#reset').hide();
            $('#quoteInput').focus();
            $('#quoteInput').removeClass('overlay');
            $('#quoteInput').attr('disabled', false);
            $('#reset-hint').show();
        }
    });

    $('#escape').keydown(function (e) {
        if (e.key === 'Escape') {
            e.preventDefault();

            window.location.href = '../dashboard.html';
        }
    });

    function fetchResultPage() {
        var wpm = $("#wpm").text();
        var inaccuracy =$("#inaccuracy").text();
        var accuracy =$("#accuracy").text();
        var time = $("#timer").text();
        window.location.href = '../pages/result.html' + 
            '?level=' + encodeURIComponent(levelValue) + 
            '&wpm=' + encodeURIComponent(wpm) + 
            '&timer=' + encodeURIComponent(time) + 
            '&accuracy=' + encodeURIComponent(accuracy) +
            '&inaccuracy=' + encodeURIComponent(inaccuracy);
    }
});