const {app , BrowserWindow} = require('electron');

function createWindow(){
    let win = new BrowserWindow({
        width: 800, 
        height:600,
        webPreferences: {
            sandbox: true
          }
        });
    win.loadFile('index.html');
    win.on('closed', () => {
        win = null;
    });
}

app.on('ready',createWindow);