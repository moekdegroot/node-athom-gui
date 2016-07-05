'use strict';

const path = require('path');
const electron = require('electron');
const config = require('../../config');

const app = electron.app;

let updateWindowTitleTimeout;
const main = {
	initialize,
	setTitle,
	show,
	window: null,
};

function initialize() {
	if (main.window) {
		return main.window.show();
	}

	const screenSize = electron.screen.getPrimaryDisplay().workAreaSize;
	const userAgent = ['Athom', app.getVersion(), process.platform, process.arch].join('|');
	const windowOptions = {
		show: false,
		title: 'Athom',
		width: Math.round(0.9 * screenSize.width),
		height: Math.round(0.9 * screenSize.height),
		minWidth: 680,
		webPreferences: {
			nodeIntegration: false,
			partition: 'persist:homey',
		},
	};

	if (process.platform === 'linux') {
		windowOptions.icon = path.join(config.ASSETS_PATH, '/app-icon/png/512.png');
	}

	const window = new electron.BrowserWindow(windowOptions);
	window.loadURL('https://my.athom.com', {
		userAgent: userAgent,
	});

	// debounce the title to prevent redirect uglyness
	window.on('page-title-updated', e => {
		const isMyAthom = window.webContents.getURL().includes('my.athom.com');
		const title = isMyAthom ? 'My Athom' : window.webContents.getTitle();

		if (updateWindowTitleTimeout) {
			clearTimeout(updateWindowTitleTimeout);
		}
		updateWindowTitleTimeout = setTimeout(() => {
			window.setTitle(title);
		}, 350);

		e.preventDefault();
	});

	window.on('close', (e) => {
		console.log(app.isQuitting);
		if (process.platform !== 'darwin') {
			app.quit();
		} else if (!app.isQuitting) {
			e.preventDefault();
			window.hide();
		}
	});

	window.webContents
	// on new window
		.on('new-window', (e, url, frameName) => {
			if (frameName !== 'homey_dialog') {
				e.preventDefault();
				electron.shell.openExternal(url);
			}
		})
		// show window on load
		.on('did-finish-load', () => window.show());

	main.window = window;
}

function setTitle(title) {
	if (!main.window) {
		return;
	}
	main.win.setTitle(title);
}

function show() {
	if (!main.window) {
		return;
	}
	main.window.show();
}

module.exports = main;
