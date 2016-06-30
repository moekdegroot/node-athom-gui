var electron = require('electron');
var app = electron.app;

/**
 * Display string in dock badging area. (OS X)
 */
function setBadge (text) {
  if (!app.dock) return;
  app.dock.setBadge(String(text));
}

module.exports = {
  setBadge
};