'use strict';

const electron = require('electron');
const app = electron.app;
const ipcMain = electron.ipcMain;
const main = require('./main/');
const autoUpdater = main.updater;
const windows = main.window;
const mainWindow = windows.main;

function initialize() {
	const shouldQuit = app.makeSingleInstance(() => {
		if (mainWindow) {
			if (mainWindow.isMinimized()) {
				mainWindow.restore();
			}
			mainWindow.focus();
		}
	});

	if (shouldQuit) {
		app.quit();
		return;
	}

	autoUpdater.updateMenu();

	app.on('ready', () => {
		mainWindow.initialize();
		autoUpdater.initialize();
	});

	app.on('window-all-closed', () => {
		if (process.platform !== 'darwin') {
			app.quit();
		}
	});

	app.on('activate', () => {
		if (mainWindow === null) {
			mainWindow.init();
		}
	});
}

// Handle Squirrel on Windows startup events
switch (process.argv[1]) {
	case '--squirrel-install':
	case '--squirrel-updated':
		autoUpdater.createShortcut(() => app.quit());
		break;
	case '--squirrel-uninstall':
		autoUpdater.removeShortcut(() => app.quit());
		break;
	case '--squirrel-obsolete':
		app.quit();
		break;
	default:
		initialize();
}
