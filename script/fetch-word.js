
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
          console.error('Device might not have an internet connection');
          getOfflineQuote();
        }
      })
      .catch(error => {
        console.error('Error occurred. Device might not have an internet connection');
        getOfflineQuote();
      });
  } else {
    console.error('Device is reported as offline by the browser');
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

function getRandomQuote() {
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