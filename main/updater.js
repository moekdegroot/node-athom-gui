'use strict';

const path = require('path');
const os = require('os');
const cp = require('child_process');

const app = require('electron').app;
const autoUpdater = require('electron').autoUpdater;
const Menu = require('electron').Menu;
const dialog = require('electron').dialog;

let state = 'no-update';
let updateRequest = false;

function initialize() {
	const platform = os.platform();
	const version = app.getVersion();
	const iconPath = path.resolve(__dirname, '../assets', 'app-icon', 'png', '48.png');

	autoUpdater.on('checking-for-update', () => {
		state = 'checking';
		updateMenu();
	});

	autoUpdater.on('update-available', () => {
		state = 'checking';
		updateMenu();
	});

	autoUpdater.on('update-downloaded', () => {
		state = 'installed';
		updateMenu();
		const pressedButton = dialog.showMessageBox({
			type: 'info',
			buttons: ['Cancel', 'Restart'],
			defaultId: 1,
			cancelId: 5,
			icon: iconPath,
			title: 'Homey Desktop updated',
			message: 'Homey Desktop was updated.',
			detail: 'Please restart application for the changes to take effect.',
		});
		if (pressedButton === 1) {
			autoUpdater.quitAndInstall();
		}
	});

	autoUpdater.on('update-not-available', () => {
		state = 'no-update';
		updateMenu();
		if (updateRequest) {
			dialog.showMessageBox({
				type: 'info',
				buttons: ['OK'],
				icon: iconPath,
				title: 'No Update Available',
				message: 'No update available.',
				detail: `Version ${version} is the latest version.`,
			});
			updateRequest = false;
		}
	});

	autoUpdater.on('error', (e, message) => {
		state = 'no-update';
		updateMenu();
		if (updateRequest) {
			dialog.showMessageBox({
				type: 'warning',
				buttons: ['OK'],
				icon: iconPath,
				title: 'Update Error',
				message: 'There was an error checking for updates.',
				detail: message,
			});
		}
	});

	autoUpdater.setFeedURL(`https://nuts.athom.com/update/${platform}/${version}`);

	autoUpdater.checkForUpdates();
}

function updateMenu() {
	const menu = Menu.getApplicationMenu();
	if (!menu) {
		return;
	}

	menu.items.forEach((item) => {
		if (item.submenu) {
			item.submenu.items.forEach((subItem) => {
				switch (subItem.key) {
					case 'checkForUpdate':
						subItem.visible = state === 'no-update';
						break;
					case 'checkingForUpdate':
						subItem.visible = state === 'checking';
						break;
					case 'restartToUpdate':
						subItem.visible = state === 'installed';
						break;
					default :
						break;
				}
			});
		}
	});
}

function createShortcut(callback) {
	spawnUpdate([
		'--createShortcut',
		path.basename(process.execPath),
		'--shortcut-locations',
		'StartMenu',
	], callback);
}

function removeShortcut(callback) {
	spawnUpdate([
		'--removeShortcut',
		path.basename(process.execPath),
	], callback);
}

function spawnUpdate(args, callback) {
	const updateExe = path.resolve(path.dirname(process.execPath), '..', 'Update.exe');
	let stdout = '';
	let spawned = null;

	try {
		spawned = cp.spawn(updateExe, args);
	} catch (error) {
		if (error && error.stdout == null) {
			error.stdout = stdout;
		}
		process.nextTick(() => {
			callback(error);
		});
		return;
	}

	let error = null;

	spawned.stdout.on('data', (data) => {
		stdout += data;
	});

	spawned.on('error', (processError) => {
		if (!error) {
			error = processError;
		}
	});

	spawned.on('close', (code, signal) => {
		if (!error && code !== 0) {
			error = new Error(`Command failed: ${code}, ${signal}`);
		}
		if (error && error.code == null) {
			error.code = code;
		}
		if (error && error.stdout == null) {
			error.stdout = stdout;
		}
		callback(error);
	});
}

function checkForUpdates() {
	updateRequest = true;
	autoUpdater.checkForUpdates();
}

module.exports = {
	initialize,
	updateMenu,
	createShortcut,
	removeShortcut,
	checkForUpdates,
};
