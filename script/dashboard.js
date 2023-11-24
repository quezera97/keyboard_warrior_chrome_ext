$( document ).ready(function() {
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
});