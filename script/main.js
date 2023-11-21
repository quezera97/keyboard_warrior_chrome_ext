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
    
    if (allWordsCorrect) getNextQuote();
});