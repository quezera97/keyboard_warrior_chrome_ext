$( document ).ready(function() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const levelValue = urlParams.get('level');
    const wpmValue = urlParams.get('wpm');
    const timeValue = urlParams.get('timer');
    const inaccuracyValue = urlParams.get('inaccuracy');
    const accuracyValue = urlParams.get('accuracy');

    let typeOfUser = localStorage.getItem('user');
    
    if( typeOfUser == 'ghost'){
        let storedResults = localStorage.getItem(levelValue + '_profile');
        let results = {};

        if (storedResults) {
            results = JSON.parse(storedResults);
        }

        const newResult  = {
            time: timeValue,
            wpm: wpmValue,
            accuracy: accuracyValue,
            inaccuracy: inaccuracyValue,
        };

        const currentDate = new Date();
        const formattedDate =
        (currentDate.getMonth() + 1) + '/' +
        currentDate.getDate() + '/' +
        currentDate.getFullYear() + ' ' +
        (currentDate.getHours() % 12 || 12) + ':' +
        (currentDate.getMinutes() < 10 ? '0' : '') + currentDate.getMinutes() + ' ' +
        (currentDate.getHours() >= 12 ? 'PM' : 'AM');

        results[formattedDate] = newResult;

        localStorage.setItem(levelValue+'_profile', JSON.stringify(results));
    }
});