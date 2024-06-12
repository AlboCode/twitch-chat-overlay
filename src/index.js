const { app, BrowserWindow, screen } = require('electron');
const path = require('node:path');
const {
  Worker
} = require('node:worker_threads');
const {
  WebSocket
} = require('ws');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const displays = screen.getAllDisplays()
  const externalDisplay = displays.find((display) => {
    return display.bounds.x !== 0 || display.bounds.y !== 0
  })
  const mainWindow = new BrowserWindow({
    width: 500,
    height: 600,
    transparent: true,
    frame: false,
    x: externalDisplay.bounds.x + externalDisplay.bounds.width - 520,
    y: externalDisplay.bounds.y + externalDisplay.bounds.height - 620,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  mainWindow.setIgnoreMouseEvents(true)
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  return mainWindow;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  const mainWindow = createWindow();
  const websocket = new WebSocket("wss://irc-ws.chat.twitch.tv/");
  websocket.addEventListener('open', () => {
    websocket.send("CAP REQ :twitch.tv/tags twitch.tv/commands")
    websocket.send("NICK justinfan66881")
    websocket.send("USER justinfan66881 8 * :justinfan66881")
    websocket.send("JOIN #agent00") //todo: parameterize account.
  });
  websocket.addEventListener('close', () => {
  });
  websocket.addEventListener('message', (msg) => {
    console.log(msg.data);
    if (msg.data.includes('PING')) {
      websocket.send('PONG');
      return;
    }
    mainWindow.webContents.send('update-chat', msg.data)

  });

  websocket.addEventListener('ping', (code) => {
    console.log("Ping", code);
  })

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();

    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
