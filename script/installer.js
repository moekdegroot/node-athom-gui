#!/usr/bin/env node
'use strict';

const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller;
const createDMG = require('electron-installer-dmg');
const path = require('path');
const rimraf = require('rimraf');
const config = require('../config');

deleteOutputFolder()
	.then(createOSXInstaller)
	.then(getInstallerConfig)
	.then(createWindowsInstaller)
	.catch((error) => {
		console.error(error.message || error);
		process.exit(1);
	});

function getInstallerConfig() {
	const iconPath = `${config.APP_ICON}.ico`;
	console.log('Building windows installer...');
	return Promise.resolve({
		appDirectory: path.join(config.OUT_PATH, 'Homey-win32-ia32'),
		authors: config.APP_TEAM,
		description: config.APP_NAME,
		exe: `${config.APP_NAME}.exe`,
		iconUrl: `${config.GITHUB_URL_RAW}/assets/app-icon/${config.APP_NAME}.ico`,
		loadingGif: config.LOADING_GIF,
		noMsi: true,
		outputDirectory: path.join(config.OUT_PATH, 'windows-installer'),
		productName: config.APP_NAME,
		remoteReleases: config.GITHUB_URL,
		setupExe: `${config.APP_NAME}Setup-v${config.APP_VERSION}.exe`,
		setupIcon: iconPath,
		title: config.APP_NAME,
		skipUpdateIcon: true,
	});
}

function createOSXInstaller() {
	return new Promise((resolve, reject) => {
		const appPath = path.join(config.OUT_PATH, 'Homey-darwin-x64', 'Homey.app');
		const opts = {
			appPath: appPath,
			name: 'Homey',
			out: config.OUT_PATH,
			'icon-size': 70,
			icon: `${config.APP_ICON}.icns`,
			background: config.DMG_BACKGROUND,
			overwrite: true,
			contents: [
				{
					x: 350,
					y: 140,
					type: 'link',
					path: '/Applications',
				},
				{
					x: 150,
					y: 140,
					type: 'file',
					path: appPath,
				},
			],
		};
		console.log('Building OSX installer...');
		createDMG(opts, (error) => {
			error ? reject(error) : resolve();
		});
	});
}

function deleteOutputFolder() {
	return new Promise((resolve, reject) => {
		rimraf(path.join(__dirname, '..', 'out', 'windows-installer'), (error) => {
			error ? reject(error) : resolve();
		});
	});
}
