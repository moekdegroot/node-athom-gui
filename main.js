'use strict';

const electron = require('electron');
const app = electron.app;
const main = require('./main/');
const autoUpdater = main.updater;
const windows = main.window;
const mainWindow = windows.main;
const config = require('./config');

function initialize() {
	const shouldQuit = app.makeSingleInstance(() => {
		if (mainWindow.window) {
			if (mainWindow.window.isMinimized()) {
				mainWindow.window.restore();
			}
			mainWindow.window.focus();
		}
	});

	if (shouldQuit) {
		app.quit();
		return;
	}

	// App is ready and windows can be loaded
	let isReady = false;
	app.isQuitting = false;

	// Let the updater wait to speed startup
	setTimeout(delayedIntialization, config.DELAYED_INIT);

	app.on('ready', () => {
		isReady = true;
		mainWindow.initialize();
		autoUpdater.initialize();
	});

	app.on('window-all-closed', () => {
		if (process.platform !== 'darwin') {
			app.quit();
		}
	});

	app.on('before-quit', () => {
		if (app.isQuitting) {
			return;
		}

		app.isQuitting = true;
	});

	app.on('activate', () => {
		if (isReady) {
			mainWindow.show();
		}
	});
}

function delayedIntialization() {
	autoUpdater.updateMenu();
}

// Handle Squirrel on Windows startup events
switch (process.argv[1]) {
	case '--squirrel-install':
		autoUpdater.createShortcut(setTimeout(() => {
			app.quit();
		}, 3000));
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

