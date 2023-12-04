import { initializeApp } from './firebase/firebase-app.js'
import { getAuth, signOut, onAuthStateChanged  } from './firebase/firebase-auth.js'
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
    const auth = getAuth(app);
    const database = getDatabase(app, "https://keyboardwarrior-c0a0b-default-rtdb.asia-southeast1.firebasedatabase.app");
    let uid = null;

    let initialLevel = 'kids_profile';
    let myChart;

    if(typeOfUser == 'ghost'){
        getLevelResultProfile(initialLevel);
    }
    else{
        onAuthStateChanged(auth, async (user) => {
            if(user && user.emailVerified){
                uid = user.uid;
                await getProfileResults(uid, initialLevel);          
            }
            else{
                showSnackBar('User email is not verified');
            }
        });
    }


    $('#logout-user').click(function () {
        localStorage.removeItem('user');

        signOut(auth);

        onAuthStateChanged(auth, (user) => {
            if (!user) {
                localStorage.removeItem("uid");

                stopAndSetAudioPos();

                window.location.href = '../dashboard.html';
            }
        });
    });

    $('.nav-level a').click(async function () {
        $('.nav-level a').removeClass('active');
        $(this).addClass('active');

        var selectedLevel = $(this).attr('value');

        if(typeOfUser == 'ghost')
            getLevelResultProfile(selectedLevel);
        else{
            await getProfileResults(uid, selectedLevel);
        }
    });

    async function getProfileResults(uid, selectedLevel) {
        try {
            const level = getLevel(selectedLevel);
            const profileResultsRef = ref(database, `${uid}/records/profile_results/${level}`);
            const snapshot = await get(profileResultsRef);
    
            if (snapshot.exists()) {
                const levelEntries = snapshot.val();
                const entriesArray = Object.keys(levelEntries).map(key => ({
                    key,
                    ...levelEntries[key]
                }));
    
                const labels = entriesArray.map(entry => entry.key);
                const wpmData = entriesArray.map(entry => parseFloat(entry.wpm));
                const accuracyData = entriesArray.map(entry => parseFloat(entry.accuracy));
                const inaccuracyData = entriesArray.map(entry => parseFloat(entry.inaccuracy));
                renderChart(labels, wpmData, accuracyData, inaccuracyData);
            }
            else{
                const data = {};
                const labels = Object.keys(data);
                const wpmData = labels.map(key => data[key].wpm);
                const accuracyData = labels.map(key => data[key].accuracy);
                const inaccuracyData = labels.map(key => data[key].inaccuracy);

                renderChart(labels, wpmData, accuracyData, inaccuracyData);  
            }
        } catch (error) {
            console.error('Error fetching results:', error);
        }
    }

    function getLevel(selectedLevel) {
        switch (selectedLevel) {
            case 'kids_profile':
                return 'kids';
            case 'amateur_profile':
                return 'amateur';
            case 'legend_profile':
                return 'legend';
            case 'pro_profile':
                return 'pro';
            default:
                return 'kids';
        }
    }

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
        const ctx = $('#myChart');

        if (myChart) {
            myChart.data.labels = labels;
            myChart.data.datasets[0].data = wpmData;
            myChart.data.datasets[1].data = accuracyData;
            myChart.data.datasets[2].data = inaccuracyData;
            myChart.update();
        } else {
            myChart = new Chart(ctx, {
                type: 'bar',
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
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }
});