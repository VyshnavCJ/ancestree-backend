const express = require('express');
const app = express();
const path = require('path');
const root_dir = __dirname.split('src')[0];
const cors = require('cors');
const morgan = require('morgan');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const fileUpload = require('express-fileupload');
const { corsOptions, cloudOptions } = require('./config');
const cloudinary = require('cloudinary').v2;
require('express-async-errors');
require('dotenv').config({ path: path.join(root_dir, `.env`) });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_API_SECRET
});
app.set('trust proxy', 1);
app.use(express.static('./public'));
app.use(fileUpload({ useTempFiles: true }));
app.use(cors(corsOptions));
app.use(helmet());
app.use(mongoSanitize({ allowDots: true }));
app.use(express.json());
app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: false }));
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60
  })
);

const { errorHandler, notFound } = require('./middlewares');
const userRouter = require('./api/user/user.routes');
const familyRouter = require('./api/family/family.routes');

app.use('/api/v1/user', userRouter);
app.use('/api/v1/family', familyRouter);
app.use(notFound);
app.use(errorHandler);

module.exports = { app };
