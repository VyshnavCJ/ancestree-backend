const corsOptions = require('./cors.config');
const cloudOptions = require('./cloudinary.config');
const auth = require('./googleapi.config');
const transposter = require('./email.config');
module.exports = { corsOptions, cloudOptions, auth, transposter };
