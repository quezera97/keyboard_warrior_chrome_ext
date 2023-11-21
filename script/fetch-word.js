getNextQuote();

function getRandomQuote() {
    return fetch("https://api.quotable.io/random")
      .then((response) => response.json())
      .then((data) => data.content)
      .catch(error => console.log(error));
  }
  
  async function getNextQuote() {
    const quote = await getRandomQuote();
    $("#quoteDisplay").empty();

    $.each(quote.split(""), (_, character) => {
      const characterSpan = $("<span>").text(character);
      $("#quoteDisplay").append(characterSpan);
    });

    $("#quoteInput").val("").focus();


    startTimer();
  }
  
  let startTime;
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