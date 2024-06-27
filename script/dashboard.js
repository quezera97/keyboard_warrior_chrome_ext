$( document ).ready(function() {
    $('#dummy-container').show();
    showLoadingIndicator();

    let typeOfUser = localStorage.getItem('user');
    if(typeOfUser == 'ghost'){
        setForGhostLogin();
    }

    var audioSparta = new Audio('/assets/intro_sparta.mp3');
    audioSparta.volume = 0.4;
    audioSparta.play();

    var audioBackground = new Audio('/assets/intro.mp3');
    plaBackgroundAudio();

    function plaBackgroundAudio() {

        if (localStorage.getItem('audioPosition')) {
          audioBackground.currentTime = parseFloat(localStorage.getItem('audioPosition'));
        }

        audioBackground.loop = true; 
        audioBackground.play();        
    }

    function stopAndSetAudioPos() {
        audioBackground.onpause = audioBackground.onended = null;
        audioBackground.pause();
        localStorage.setItem('audioPosition', audioBackground.currentTime);
    }

    $('#body').keydown(function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();

            stopAndSetAudioPos();
            
            window.location.href = 'pages/quick_start.html';
        }
    });

    $('#practice-level').click(function () {
        stopAndSetAudioPos();

        window.location.href = 'pages/quick_start.html';
    });

    $('#kids-level').click(function () {
        stopAndSetAudioPos();

        window.location.href = '../pages/quick_start.html' + 
            '?level=kids';
    });

    $('#amateur-level').click(function () {
        stopAndSetAudioPos();

        window.location.href = '../pages/quick_start.html' + 
            '?level=amateur';
    });

    $('#pro-level').click(function () {
        stopAndSetAudioPos();

        window.location.href = '../pages/quick_start.html' + 
            '?level=pro';
    });

    $('#legend-level').click(function () {
        stopAndSetAudioPos();

        window.location.href = '../pages/quick_start.html' + 
            '?level=legend';
    });

    $('#custom-level').click(function () {
       stopAndSetAudioPos();

        window.location.href = '../pages/custom_words.html'
    });

    $('#login-user').click(function () {
        stopAndSetAudioPos();       

        window.location.href = '../pages/login_register.html'
    });

    $('#login-ghost').click(function () {
        localStorage.setItem('user', 'ghost');

        setForGhostLogin();
    });

    function setForGhostLogin(){
        displayStatsLocalStorage('kids');
        displayStatsLocalStorage('amateur');
        displayStatsLocalStorage('pro');
        displayStatsLocalStorage('legend');

        showDivFaction('ghost');

        $('#username').text('Spartan');

        hideLoadingIndicator();
    }

    $('#user-profile').click(function () {
        stopAndSetAudioPos();

        window.location.href = '../pages/user_profile.html'
    });


    $('#hall-of-fame').click(function () {
        stopAndSetAudioPos();

        window.location.href = '../pages/hall_of_fame.html'
    });

    var uid = localStorage.getItem('uid');

    if(typeOfUser == 'ghost'){
        setForGhostLogin();
    }
    else{
        displayStatsLocalStorage('kids');
        displayStatsLocalStorage('amateur');
        displayStatsLocalStorage('pro');
        displayStatsLocalStorage('legend');

        showDivFaction(uid);
    }

    function showDivFaction(uid){
        $('#user-faction-container').show();
        $('#dummy-container').hide();

        if(uid){
            $('#faction-selection-container').hide();
            $('#user-profile-container').show();
        }
        else{
            $('#faction-selection-container').show();
            $('#user-profile-container').hide();
        }

        hideLoadingIndicator();
    }

    function displayStatsLocalStorage(level) {
        var stats = localStorage.getItem(level);
        if (stats) {
            stats = JSON.parse(stats);
    
            $(`#${level}-time-result`).text(stats.time != '' ? stats.time : 0);
            $(`#${level}-wpm-result`).text(stats.wpm != '' ? stats.wpm : 0);
            $(`#${level}-accuracy-result`).text(stats.accuracy != '' ? stats.accuracy : 0);

            var username = localStorage.getItem('username');
            
            $('#username').text(username != '' ? username : 'Spartan');
        }
    }

    var snackbar = $("#snackbar");
    function showSnackBar(message) {
        $('#snackbar-text').text(message);

        snackbar.addClass("show");
        setTimeout(function(){
            snackbar.removeClass("show");
        }, 3000);
    }

    function showLoadingIndicator() {
        $('#loading-overlay').css('display', 'flex');
    }

    function hideLoadingIndicator() {
        $('#loading-overlay').css('display', 'none');
    }
});