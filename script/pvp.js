$( document ).ready(function() {

    $('#body_pvp').keydown(function (e) {
        if (e.key === 'Escape') {
            e.preventDefault();
            
            window.location.href = '../dashboard.html';
        }
    });
});