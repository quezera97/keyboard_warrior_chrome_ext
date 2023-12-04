import { initializeApp } from './firebase/firebase-app.js'
import { getDatabase, ref, set, get, push} from './firebase/firebase-database.js';
import { getAuth, signOut, onAuthStateChanged  } from './firebase/firebase-auth.js'

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

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const levelValue = urlParams.get('level');
    const wpmValue = urlParams.get('wpm');
    const timeValue = urlParams.get('timer');
    const inaccuracyValue = urlParams.get('inaccuracy');
    const accuracyValue = urlParams.get('accuracy');

    $('#time-result').text(timeValue);
    $('#wpm-result').text(wpmValue);
    $('#inaccuracy-result').text(inaccuracyValue);
    $('#accuracy-result').text(accuracyValue);

    const results = {
        time: timeValue,
        wpm: wpmValue,
        accuracy: accuracyValue,
    };

    localStorage.setItem(levelValue, JSON.stringify(results));

    $('#result-body').keydown(function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();

            stopAndSetAudioPos();

            window.location.href = '../pages/quick_start.html' +
            '?level=' + levelValue;
        }
        else if (e.key === 'Escape') {
            e.preventDefault();

            stopAndSetAudioPos();

            window.location.href = '../dashboard.html';
        }
    });

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
    var hallOfFameResults = {};
    var profileResults = {};

    onAuthStateChanged(auth, (user) => {
        if(user && user.emailVerified){
            const uid = user.uid;

            const usernameRef = ref(database, uid+'/username');
            get(usernameRef)
                .then((snapshot) => {
                    const usernameValue = snapshot.val();

                    hallOfFameResults = {
                        username: [usernameValue] ?? ['Guest'],
                        time: timeValue,
                        wpm: wpmValue,
                        accuracy: accuracyValue,
                    };

                    var newDate = new Date();
                    var formattedDateTime = newDate.toLocaleString();
                    profileResults  = {
                        time: timeValue,
                        wpm: wpmValue,
                        accuracy: accuracyValue,
                        inaccuracy: inaccuracyValue,
                        dateTime: formattedDateTime,
                    };

                    if(uid){
                        setUserLevelData(uid, levelValue);
                        setProfileResults(uid, levelValue);
                    }
            });            
        }
        else{
            showSnackBar('User email is not verified');
        }
    });

    function setProfileResults(uid, level) {
        const profileResultRef = ref(database, uid+'/records/profile_results/'+level);

        get(profileResultRef).then((snapshot) => {
            if ((snapshot.val())) {
                compareProfileResult(uid, level, profileResultRef, profileResults);
            } else {
                push(profileResultRef, profileResults)
                    .catch((error) => {
                    console.error('Error creating hall of fame record:', error);
                });
            }
        });
    }

    function compareProfileResult(uid, level, profileResultRef, profileResults, limit = 15) {
        get(profileResultRef)
            .then((snapshot) => {
                const currentKidsEntries = snapshot.val() || {}; 
    
                const entriesArray = Object.keys(currentKidsEntries).map(key => ({
                    key,
                    ...currentKidsEntries[key]
                }));
    
                // Check if not reaching the limit, then push new entry
                if (entriesArray.length < limit) {
                    push(profileResultRef, profileResults)
                        .catch((error) => {
                            console.error('Error adding new entry to hall of fame:', error);
                        });
                }
                else{
                    let oldestEntryKey = entriesArray[0].key;
                    let oldestDateTime = new Date(entriesArray[0].dateTime);

                    for (let i = 1; i < entriesArray.length; i++) {
                        const currentDateTime = new Date(entriesArray[i].dateTime);
                        if (currentDateTime < oldestDateTime) {
                            oldestDateTime = currentDateTime;
                            oldestEntryKey = entriesArray[i].key;
                        }
                    }

                    const newDateTime = new Date(profileResults.dateTime);
                    if (newDateTime > oldestDateTime) {
                        set(ref(database, uid + '/records/profile_results/' + level + '/' + oldestEntryKey), null)
                            .then(() => {
                                // Push the new entry
                                push(ref(database, uid + '/records/profile_results/' + level), profileResults)
                                    .catch((error) => {
                                        console.error('Error adding new entry to profile results:', error);
                                    });
                            })
                            .catch((error) => {
                                console.error('Error deleting oldest entry:', error);
                            });
                    }
                }
            })
            .catch((error) => {
                console.error('Error fetching results:', error);
            });
    }
    

    function setUserLevelData(uid, level) {

        const hallOfFame = ref(database, 'hall_of_fame/'+level);

        get(hallOfFame).then((snapshot) => {
            if ((snapshot.val())) {
                compareHallOfFame(hallOfFame, hallOfFameResults);
            } else {
                push(hallOfFame, hallOfFameResults)
                    .catch((error) => {
                    console.error('Error creating hall of fame record:', error);
                });
            }
        });

        const userRecordsRef = ref(database, uid+'/records/levels/'+level);
        set(userRecordsRef, results)
            .catch((error) => {
                console.error(`Error creating child record for the "${level}" level`);
            });
    }

    function compareHallOfFame(hallOfFameRef, hallOfFameResults, limit = 20) {
        get(hallOfFameRef)
            .then((snapshot) => {
                const currentKidsEntries = snapshot.val();
                const entriesArray = Object.keys(currentKidsEntries).map(key => ({
                    key,
                    ...currentKidsEntries[key]
                }));
    
                const newAccuracy = parseFloat(hallOfFameResults.accuracy);
                const newWPM = parseFloat(hallOfFameResults.wpm);
    
                const matchingEntry = entriesArray.find(entry =>
                    parseFloat(entry.accuracy) === newAccuracy && parseFloat(entry.wpm) === newWPM
                );
    
                if (matchingEntry) {
                    // Update the username if accuracy and wpm match
                    if (!matchingEntry.username.includes(hallOfFameResults.username[0])) {
                        matchingEntry.username.push(hallOfFameResults.username[0]);
                        set(ref(database, `hall_of_fame/kids/${matchingEntry.key}/username`), matchingEntry.username)
                            .catch((error) => {
                                console.error('Error updating username in hall of fame record:', error);
                            });
                    }
                } else {
                    entriesArray.sort((a, b) => {
                        if (parseFloat(a.accuracy) !== parseFloat(b.accuracy)) {
                            return parseFloat(b.accuracy) - parseFloat(a.accuracy);
                        } else {
                            return parseFloat(b.wpm) - parseFloat(a.wpm);
                        }
                    });
    
                    if (entriesArray.length < limit) {
                        // Add new entry if not reaching the limit
                        push(hallOfFameRef, hallOfFameResults)
                            .catch((error) => {
                                console.error('Error adding new entry to hall of fame:', error);
                            });
                    } else {
                        const lowestEntry = entriesArray[entriesArray.length - 1];
                        const lowestAccuracy = parseFloat(lowestEntry.accuracy);
                        const lowestWPM = parseFloat(lowestEntry.wpm);
    
                        // Update the lowest entry with new details
                        if ((hallOfFameResults.accuracy >= lowestAccuracy && hallOfFameResults.wpm >= lowestWPM) || (hallOfFameResults.accuracy == lowestAccuracy && hallOfFameResults.wpm >= lowestWPM)) {
                        set(ref(database, `hall_of_fame/kids/${lowestEntry.key}`), hallOfFameResults)
                            .catch((error) => {
                                console.error('Error updating lowest entry in hall of fame record:', error);
                        });
                    }
                    }
                }
            })
            .catch((error) => {
                console.error('Error fetching hall of fame data:', error);
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