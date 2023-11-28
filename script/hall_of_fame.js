$( document ).ready(function() {

    $('#body_hall_of_fame').keydown(function (e) {
        if (e.key === 'Escape') {
            e.preventDefault();
            
            window.location.href = '../dashboard.html';
        }
    });
});