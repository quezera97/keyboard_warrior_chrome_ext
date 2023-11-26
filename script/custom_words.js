$( document ).ready(function() {
    var customNumbers = false;
    var customSpecialChars = false;
    var customAutoCapitalize = false;
    var customMinLength = 0;
    var customMaxLength = 100;

    $('#body_custom_words').keydown(function (e) {
        if (e.key === 'Escape') {
            e.preventDefault();

            window.location.href = '../dashboard.html';
        }
    });

    var sliderMin = $("#custom-min-length");
    var outputMin = $("#min-length-value");

    outputMin.text(sliderMin.val());

    sliderMin.on("input", function() {
    var minVal = parseInt($(this).val());
    var maxVal = parseInt($("#custom-max-length").val());

    if (minVal >= maxVal) {
        $("#custom-max-length").val(minVal + 50);
        $("#max-length-value").text(minVal + 50);
    }

    outputMin.text(minVal);
    customMinLength = minVal;
    });

    var sliderMax = $("#custom-max-length");
    var outputMax = $("#max-length-value");

    outputMax.text(sliderMax.val());

    sliderMax.on("input", function() {
    var maxVal = parseInt($(this).val());
    var minVal = parseInt($("#custom-min-length").val());

    if (maxVal <= minVal) {
        $("#custom-min-length").val(maxVal - 50);
        $("#min-length-value").text(maxVal - 50);
    }

    outputMax.text(maxVal);
    customMaxLength = maxVal;
    });


    $('#custom-numbers').change(function() {
        if ($(this).is(':checked')) {
            customNumbers = true;
        } else {
            customNumbers = false;
        }
    });

    $('#custom-special-chars').change(function() {
        if ($(this).is(':checked')) {
            customSpecialChars = true;
        } else {
            customSpecialChars = false;
        }
    });

    $('#custom-auto-capitalize').change(function() {
        if ($(this).is(':checked')) {
            customAutoCapitalize = true;
        } else {
            customAutoCapitalize = false;
        }
    });

    $('#generate-custom').click(function () {
        window.location.href = '../pages/quick_start.html' + 
            '?level=custom' +
            '&numbers=' + encodeURIComponent(customNumbers) +
            '&specialChar=' + encodeURIComponent(customSpecialChars) +
            '&autoCapitalize=' + encodeURIComponent(customAutoCapitalize) +
            '&minLength=' + encodeURIComponent(customMinLength) +
            '&maxLength=' + encodeURIComponent(customMaxLength);
    })

});

