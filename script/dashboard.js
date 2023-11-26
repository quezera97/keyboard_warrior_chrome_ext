$( document ).ready(function() {
    var audioSparta = new Audio('/assets/intro_sparta.mp3');
    var audioBackground = new Audio('/assets/intro.mp3');
    
    audioSparta.volume = 0.7;
    audioSparta.play();
    audioBackground.play();

    $('#body').keydown(function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            
            window.location.href = 'pages/quick_start.html';
        }
    });

    $('#quick-start').click(function () {
        window.location.href = 'pages/quick_start.html';
    });

    $('#kids-level').click(function () {
        window.location.href = '../pages/quick_start.html' + 
            '?level=kids';
    });

    $('#amateur-level').click(function () {
        window.location.href = '../pages/quick_start.html' + 
            '?level=amateur';
    });

    $('#pro-level').click(function () {
        window.location.href = '../pages/quick_start.html' + 
            '?level=pro';
    });

    $('#legend-level').click(function () {
        window.location.href = '../pages/quick_start.html' + 
            '?level=legend';
    });

    $('#custom-level').click(function () {
        window.location.href = '../pages/custom_words.html'
    });
});