import { getDatabase, ref, set, get } from './firebase/firebase-database.js';
import { app, auth, database } from "./firebase/firebase-init.js";

$( document ).ready(async function() {
    console.log(app);
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

    let initialLevel = 'kids';   

    $('.nav-level a').click(async function () {
        $('.nav-level a').removeClass('active');
        $(this).addClass('active');

        var selectedLevel = $(this).attr('value');

        await getHallOfFame(selectedLevel);
    })

    $('#body_hall_of_fame').keydown(function (e) {
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

    await getHallOfFame(initialLevel);

    async function getHallOfFame(level) {
        const hallOfFameRef = ref(database, 'hall_of_fame/'+level);
    
        get(hallOfFameRef)
        .then((snapshot) => {

            if ((snapshot.val())) {

                const levelEntries = snapshot.val();
                const entriesArray = Object.values(levelEntries);
        
                // Sort the entries based on accuracy and then by WPM
                entriesArray.sort((a, b) => {
                    if (parseFloat(a.accuracy) !== parseFloat(b.accuracy)) {
                        return parseFloat(b.accuracy) - parseFloat(a.accuracy);
                    } else {
                        return parseFloat(b.wpm) - parseFloat(a.wpm);
                    }
                });
        
                const tableBody = $('#tableBody');
                tableBody.empty();

                entriesArray.forEach((entry, index) => {
                    const accuracy = parseFloat(entry.accuracy);
                    const wpm = parseFloat(entry.wpm);
                    const time = parseFloat(entry.time);
                    const username = entry.username;
        
                    const newRow = $('<tr></tr>');
        
                    const rankingCell = $('<td></td>');
                    if (index === 0) {
                        rankingCell.text('1st');
                    } else if (index === 1) {
                        rankingCell.text('2nd');
                    } else if (index === 2) {
                        rankingCell.text('3rd');
                    } else {
                        rankingCell.text(`${index + 1}th`);
                    }
                    newRow.append(rankingCell);
        
                    const usernameCell = $('<td></td>');
                    const usernameText = username.join('<br>');
                    usernameCell.html(usernameText);
                    newRow.append(usernameCell);
        
                    const accuracyCell = $('<td></td>');
                    accuracyCell.text(accuracy);
                    newRow.append(accuracyCell);
        
                    const wpmCell = $('<td></td>');
                    wpmCell.text(wpm);
                    newRow.append(wpmCell);
        
                    const timeCell = $('<td></td>');
                    timeCell.text(time);
                    newRow.append(timeCell);
        
                    tableBody.append(newRow);
                });
        
                // Check if the content height exceeds a threshold and add scroll if necessary
                const tableWrapper = $('.table-wrapper');
                const tableBodyHeight = tableWrapper.innerHeight();
                const tableBodyScrollHeight = tableWrapper[0].scrollHeight;
        
                if (tableBodyScrollHeight > tableBodyHeight) {
                    tableWrapper.addClass('scrollable');
                }

            } else {
                const tableBody = $('#tableBody');
                tableBody.empty();

                const emptyRow = $('<tr><td style="text-align: center;" colspan="5">No entries found</td></tr>');
                tableBody.append(emptyRow);
            }
        })
        .catch((error) => {
            showSnackBar('Error fetching hall of fame data:');
        });
    }

    var snackbar = $("#snackbar");
    function showSnackBar(message) {
        $('#snackbar-text').text(message);

        snackbar.addClass("show");
        setTimeout(function(){
            snackbar.removeClass("show");
        }, 3000);
    }
});