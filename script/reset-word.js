$('#quoteInput').keydown(function (e) {
    if (e.key === 'Tab' || e.key === 'Escape') {
        e.preventDefault();
        
        $('#reset').show().focus();
        $('#quoteInput').addClass('overlay');
        $('#quoteInput').attr('disabled', true);
    }
});

$('#reset').keydown(function (e) {
    if (e.key === 'Tab' || e.key === 'Escape') {
        e.preventDefault();

        getNextQuote();

        $('#reset').hide();
        $('#quoteInput').focus();
        $('#quoteInput').removeClass('overlay');
        $('#quoteInput').attr('disabled', false);
    }
});