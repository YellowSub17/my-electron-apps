const { app, BrowserWindow } = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 1300,
        height: 900,
        titleBarStyle: 'hiddenInset', // Makes it look like a Mac app
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    win.loadURL('https://docs.google.com/spreadsheets/u/0/');

    win.webContents.on('did-finish-load', () => {
        // We only need to inject the "Drag Handle" so you can move the window
        win.webContents.insertCSS(`
            body::before {
                content: "";
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 35px;
                -webkit-app-region: drag;
                z-index: 999999;
                pointer-events: none;
            }
            
            /* Push the Google UI down slightly so it doesn't 
               sit directly under the Mac traffic light buttons */
            #docs-chrome {
                padding-top: 10px !important;
            }
        `);
    });
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      } else {
        // On Mac, we usually force quit here if we want it to stop the process
        app.quit();
      }
    });

}

app.whenReady().then(createWindow);

// Standard Mac behavior: Quit app when closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
