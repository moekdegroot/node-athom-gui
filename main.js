'use strict';

// Ensure that essential app components exist
require('./main');

const electron = require('electron');
const autoUpdater = require('./main/updater.js');
const windows = require('./main/windows');

const app = electron.app;
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

	console.log(autoUpdater);
	console.log(mainWindow);
	autoUpdater.updateMenu();

	app.on('ready', () => {
		console.log(autoUpdater);
		console.log(mainWindow);
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
