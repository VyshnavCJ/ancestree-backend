const { auth } = require('../config');
const { google } = require('googleapis');

const drive = google.drive({ version: 'v3', auth: auth });

module.exports = drive;
