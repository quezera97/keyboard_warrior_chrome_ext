$( document ).ready(function() {
    var audioBackground = new Audio('/assets/intro.mp3');
    playBackgroundAudio();

    function playBackgroundAudio() {

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

    $('#body_user_profile').keydown(function (e) {
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

    var typeOfUser = localStorage.getItem('user');

    let uid = null;

    let initialLevel = 'kids_profile';
    let profileChart;

    if(typeOfUser == 'ghost'){
        getLevelResultProfile(initialLevel);
    }

    $('#logout-user').click(function () {
        localStorage.removeItem('user');

        window.location.href = '../dashboard.html';
    });

    $('.nav-level a').click(async function () {
        $('.nav-level a').removeClass('active');
        $(this).addClass('active');

        var selectedLevel = $(this).attr('value');

        if(typeOfUser == 'ghost')
            getLevelResultProfile(selectedLevel);
    });

    function getLevelResultProfile(level_profile) {
        const storedData = localStorage.getItem(level_profile);
        const data = storedData ? JSON.parse(storedData) : {};
    
        const labels = Object.keys(data);
        const wpmData = labels.map(key => data[key].wpm);
        const accuracyData = labels.map(key => data[key].accuracy);
        const inaccuracyData = labels.map(key => data[key].inaccuracy);

        renderChart(labels, wpmData, accuracyData, inaccuracyData);        
    }

    function renderChart(labels, wpmData, accuracyData, inaccuracyData) {
        const ctx = $('#profileChart');

        if (profileChart) {
            profileChart.data.labels = labels;
            profileChart.data.datasets[0].data = wpmData;
            profileChart.data.datasets[1].data = accuracyData;
            profileChart.data.datasets[2].data = inaccuracyData;
            profileChart.update();
        } else {
            profileChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'WPM',
                            data: wpmData,
                            backgroundColor: 'rgba(54, 162, 235, 0.5)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Accuracy',
                            data: accuracyData,
                            backgroundColor: 'rgba(255, 215, 0, 0.5)',
                            borderColor: 'rgba(255, 215, 0, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Inaccuracy',
                            data: inaccuracyData,
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    scales: {
                        x: {
                            ticks: {
                                autoSkip: false,
                                maxRotation: 90,
                                minRotation: 90
                            }
                        },
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
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
});