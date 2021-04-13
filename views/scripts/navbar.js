(function () {

    const { BrowserWindow } = require('@electron/remote')

    function init() {
        document.getElementById("reduce_container").addEventListener("click", function (e) {
            var window = BrowserWindow.getFocusedWindow();
            window.minimize();
        });

        document.getElementById("fullsize_container").addEventListener("click", function (e) {
            var window = BrowserWindow.getFocusedWindow();
            window.maximize();
        });

        document.getElementById("close_container").addEventListener("click", function (e) {
            var window = BrowserWindow.getFocusedWindow();
            window.close();
        });
    };

    document.onreadystatechange = function () {
        if (document.readyState == "complete") {
            init();
        }
    };

})();