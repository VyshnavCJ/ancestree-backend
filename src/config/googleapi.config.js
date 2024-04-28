const { google } = require('googleapis');
const path = require('path');
const root_dir = __dirname.split('src')[0];
const KEYFILEPATH = path.join(root_dir + 'src/googleCred.json');
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES
});

module.exports = auth;
