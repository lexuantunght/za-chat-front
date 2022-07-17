const remote = require('@electron/remote');

/* handle window controls event */

const win = remote.getCurrentWindow();
document.onreadystatechange = (event) => {
    if (document.readyState == 'complete') {
        handleWindowControls();
    }
};

window.onbeforeunload = (event) => {
    win.removeAllListeners();
};

function handleWindowControls() {
    const btnMin = document.getElementById('window-button-min');
    const btnMax = document.getElementById('window-button-max');
    const btnRestore = document.getElementById('window-button-restore');
    const btnClose = document.getElementById('window-button-close');
    btnMin.addEventListener('click', (event) => {
        win.minimize();
    });
    if (win.isMaximizable()) {
        btnMax.addEventListener('click', (event) => {
            win.maximize();
        });
    } else {
        btnMax.classList.add('window-button-disabled');
    }
    btnRestore.addEventListener('click', (event) => {
        win.unmaximize();
    });
    btnClose.addEventListener('click', (event) => {
        win.close();
    });

    toggleMaxRestoreButtons();
    win.on('maximize', toggleMaxRestoreButtons);
    win.on('unmaximize', toggleMaxRestoreButtons);

    function toggleMaxRestoreButtons() {
        if (win.isMaximized()) {
            document.body.classList.add('maximized');
        } else {
            document.body.classList.remove('maximized');
        }
    }
}
