$( document ).ready(function() {
    $('#quick-start').click(function () {
        fetch('pages/quick_start.html')
        .then(response => response.text())
        .then(content => {
            document.getElementById('body').innerHTML = content;

            const stylesheets = [
                'styles/styles.css'
            ];

            stylesheets.forEach(stylesheetSrc => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = stylesheetSrc;
                document.head.appendChild(link);
            });

            const scripts = [
                'script/jquery-3.7.1.min.js',
                'script/quick_start.js',
            ];

            scripts.forEach(scriptSrc => {
                const script = document.createElement('script');
                script.src = scriptSrc;
                document.body.appendChild(script);
            });
        });
    });
});