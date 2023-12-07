import { initializeApp } from './firebase/firebase-app.js'
import { getDatabase, ref, set, get } from './firebase/firebase-database.js';

$( document ).ready(function() {
    
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

    $('.select2').select2();

    $('#body_pvp').keydown(function (e) {
        if (e.key === 'Escape') {
            e.preventDefault();

            stopAndSetAudioPos();
            
            window.location.href = '../dashboard.html';
        }
    });

    $('#escape-button').click(function (e) {
        stopAndSetAudioPos();

        window.location.href = '../dashboard.html';
    });

    $('#global-pvp, #challenge-pvp').hide();

    $('.nav-level a').click(async function () {
        $('.nav-level a').removeClass('active');
        $(this).addClass('active');
    
        var selectedPvp = $(this).attr('value');
    
        switch (selectedPvp) {
            case 'ongoing':
                $('#ongoing-pvp').show();
                $('#global-pvp, #challenge-pvp').hide();
                break;
            case 'global':
                $('#ongoing-pvp, #challenge-pvp').hide();
                $('#global-pvp').show();
                break;
            case 'challenge':
                $('#ongoing-pvp, #global-pvp').hide();
                $('#challenge-pvp').show();
                break;
            default:
                break;
        }
    });
    

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let fromUsername = urlParams.get('username');

    let toUsername = '';
    let level = '';

    let showUsername = false;

    const firebaseConfig = {
        apiKey: "AIzaSyBYtSkWCVLBDWkR_UmL_ojguW1C6gZVPFw",
        authDomain: "keyboardwarrior-c0a0b.firebaseapp.com",
        projectId: "keyboardwarrior-c0a0b",
        storageBucket: "keyboardwarrior-c0a0b.appspot.com",
        messagingSenderId: "838198639101",
        appId: "1:838198639101:web:cfe0a3eecc334ace418194",
        measurementId: "G-ZC2XJ3JLGJ"
    };
    
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app, "https://keyboardwarrior-c0a0b-default-rtdb.asia-southeast1.firebasedatabase.app");

    const getGlobalPvp = ref(database, 'pvp');
    
    get(getGlobalPvp).then((snapshot) => {
        if(snapshot.val()){
            let pvpData = snapshot.val();

            var level = getLevelName(pvpData.level)
            var status = pvpData.isComplete == false ? 'Ongoing Battle' : 'End Of Battle';

            if(status == 'Ongoing Battle'){
                $('#begin-battle').hide();

                showUsername = false;
            }
            else{
                showUsername = true;
            }
            

            getUsername(showUsername)
            
            $('#date-pvp').text(pvpData.date);
            $('#challenger-pvp').text(pvpData.from)
            $('#opponent-pvp').text(pvpData.to)
            $('#level-pvp').text(level)
            $('#time-pvp').text(pvpData.time)
            $('#wpm-pvp').text(pvpData.wpm)
            $('#accuracy-pvp').text(pvpData.accuracy)
            $('#inaccuracy-pvp').text(pvpData.inaccuracy)
            $('#status-pvp').text(status)
        }
        else{ showSnackBar('Error getting information'); }
    })
    .catch((error) => {
        showSnackBar('Error getting information');
    });

    function getUsername(showUsername) {
        if(showUsername == true){
            const getUsername = ref(database, 'username');
            get(getUsername).then((snapshot) => {
                if(snapshot.val()){
                    let usernameData = snapshot.val();
        
                    $("#list-username").select2({
                        data: usernameData,
                    });
                }
                else{ showSnackBar('Error getting information'); }
            })
            .catch((error) => {
                showSnackBar('Error getting information');
            });
        }
    }

    function getLevelName(level) {
        switch (level) {
            case 'amateur':
                return 'Perioikoi';
            case 'pro':
                return 'Spartan';
            case 'legend':
                return 'Gods';
            default:
                break;
        }
    }

    $('#list-username').on('select2:select', function (e) {
        var data = e.params.data;
        toUsername = data.id;
    });

    $('#list-level').on('select2:select', function (e) {
        var data = e.params.data;
        level = data.id;
    });

    $('#begin-battle').click(function (e) {
        if(toUsername == '' || level == ''){
            showSnackBar('Choose your opponent');
        }
        else if (level == ''){
            showSnackBar('Choose the level');
        }
        else{
            const date = new Date();
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            
            const formattedDate = `${day}/${month}/${year}`;

            stopAndSetAudioPos();

            window.location.href = '../pages/challenge_pvp.html' + 
                '?fromUsername=' + encodeURIComponent(fromUsername) + 
                '&toUsername=' + encodeURIComponent(toUsername) + 
                '&date=' + formattedDate + 
                '&level=' + encodeURIComponent(level) +
                '&isComplete=' + encodeURIComponent('false');
        }
    })

    var snackbar = $("#snackbar");
    function showSnackBar(message) {
        $('#snackbar-text').text(message);

        snackbar.addClass("show");
        setTimeout(function(){
            snackbar.removeClass("show");
        }, 3000);
    }
});
