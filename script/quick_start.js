$( document ).ready(function() {
    let startTime;
  
    checkInternetConnection();
    
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
        const response = await fetch('assets/quotes.json');
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
        const quote = await getRandomQuote();
    
        displayQuote(quote);
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
    
    async function getRandomQuote() {
        return fetch("https://api.quotable.io/random")
        .then((response) => response.json())
        .then((data) => data.content)
        .catch(error => console.log(error));
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
        let allWordsCorrect = true;
        let count = 0;
        
        quoteArray.forEach((characterSpan, i) => {
            const character = valueArray[i];
        
            if (character == null) {
                $(characterSpan).removeClass("right wrong");
                allWordsCorrect = false;
            } else if (character === $(characterSpan).text()) {
                $(characterSpan).addClass("right").removeClass("wrong");
                count++;
            } else {
                $(characterSpan).removeClass("right").addClass("wrong");
                allWordsCorrect = false;
            }
        });
        
        let calculateWpm = Math.round(count * 60 / (getTimerTime() * 5) * 10) / 10;
        
        if (isNaN(calculateWpm)) {
            $("#wpm").text("0");
        } else {
            $("#wpm").text(calculateWpm);
        }
        
        if (allWordsCorrect) {
            checkInternetConnection();
            // fetchResultPage();
        }
    });

    $('#quoteInput').keydown(function (e) {
        if (e.key === 'Tab' || e.key === 'Escape') {
            e.preventDefault();
            
            $('#reset').show().focus();
            $('#quoteInput').addClass('overlay');
            $('#quoteInput').attr('disabled', true);
            $('#reset-hint').hide();
        }
    });

    $('#reset').keydown(function (e) {
        if (e.key === 'Tab' || e.key === 'Escape') {
            e.preventDefault();

            checkInternetConnection();

            $('#reset').hide();
            $('#quoteInput').focus();
            $('#quoteInput').removeClass('overlay');
            $('#quoteInput').attr('disabled', false);
            $('#reset-hint').show();
        }
    });

    function fetchResultPage() {
        var wpm = $('#wpm').text();

        fetch('pages/result.html')
        .then(response => response.text())
        .then(content => {
            document.getElementById('body').innerHTML = content;

            $('#time-result').text(getTimerTime());
            $('#wpm-result').text(wpm);
            
            const stylesheets = [
                'styles/styles.css'
            ];

            stylesheets.forEach(stylesheetSrc => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = stylesheetSrc;
                document.head.appendChild(link);
            });

            const scripts = [
                'script/jquery-3.7.1.min.js',
                'script/result.js',
            ];

            scripts.forEach(scriptSrc => {
                const script = document.createElement('script');
                script.src = scriptSrc;
                document.body.appendChild(script);
            });
        });
    }
});