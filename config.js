'use strict';

const path = require('path');

const APP_NAME = 'Homey';
const APP_TEAM = 'Athom BV';
const APP_VERSION = require('./package.json').version;

module.exports = {
	AUTO_UPDATE_URL: 'https://nuts.athom.com/update',

	APP_COPYRIGHT: `Copyright © 2016 ${APP_TEAM}`,
	APP_ICON: path.join(__dirname, 'assets', 'app-icon', 'Homey'),
	APP_NAME: APP_NAME,
	APP_TEAM: APP_TEAM,
	APP_VERSION: APP_VERSION,
	APP_WINDOW_TITLE: APP_NAME,

	DMG_BACKGROUND: path.join(__dirname, 'assets', 'img', 'background.png'),
	LOADING_GIF: path.join(__dirname, 'assets', 'img', 'loading.gif'),

	// Wait for components to load
	DELAYED_INIT: 2000,

	GITHUB_URL: 'https://github.com/athombv/node-athom-gui',
	GITHUB_URL_RAW: 'https://raw.githubusercontent.com/athombv/node-athom-gui/master',

	HOME_PAGE_URL: 'https://www.athom.com',

	ROOT_PATH: __dirname,
	OUT_PATH: path.join(__dirname, 'out'),
	ASSETS_PATH: path.join(__dirname, 'assets'),
};
