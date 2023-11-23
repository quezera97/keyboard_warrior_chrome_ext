$('#quick-start').click(function () {
    fetch('/index.html')
    .then(response => response.text())
    .then(content => {
        document.getElementById('body').innerHTML = content;

        const stylesheets = [
            'styles/bootstrap-5.3.2.min.css',
            'styles/styles.css'
        ];

        stylesheets.forEach(stylesheetSrc => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = stylesheetSrc;
            document.head.appendChild(link);
        });

        const scripts = [
            'script/bootstrap-5.3.2.bundle.min.js',
            'script/jquery-3.7.1.min.js',
            'script/main.js',
            'script/fetch-word.js',
            'script/reset-word.js',
        ];

        scripts.forEach(scriptSrc => {
            const script = document.createElement('script');
            script.src = scriptSrc;
            document.body.appendChild(script);
        });
    });
});