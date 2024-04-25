const path = require('path');
const root_dir = __dirname.split('src')[0];
require('dotenv').config({ path: path.join(root_dir, `.env`) });
const cloudOptions = {
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_API_SECRET
};

module.exports = cloudOptions;
