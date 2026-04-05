const { app, BrowserWindow } = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        show: false, // 1. Start hidden to prevent the "flicker"
        backgroundColor: '#1e1e1e', // Matches dark mode so the "reveal" is seamless
        titleBarStyle: 'hiddenInset',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    win.loadURL('https://www.facebook.com/messages/t/');

    win.webContents.on('did-finish-load', () => {

        // 1. CSS Injection (Your working code)
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

            div[role="banner"] {
                display: none !important;
            }

            :root {
                --header-height: 0px !important;
            }

            div[aria-label="Chats"] {
                padding-top: 25px !important;
            }
        `);

        // 2. JS Injection (Your working code)
        const hideBannerJS = `
            const nuke = () => {
                const banner = document.querySelector('div[role="banner"]');
                if (banner) {
                    banner.style.display = 'none';
                }
                document.documentElement.style.setProperty('--header-height', '0px', 'important');
            };
            nuke();
            setInterval(nuke, 1000);
        `;

        win.webContents.executeJavaScript(hideBannerJS);

        // 3. THE REVEAL: Only show the window once the script has had a moment to run
        // We use a small delay to ensure the "Skeleton" screen is gone
        setTimeout(() => {
            win.show();
        }, 600); 
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
