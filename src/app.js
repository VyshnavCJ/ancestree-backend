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
require('express-async-errors');
require('dotenv').config({ path: path.join(root_dir, `.env`) });

// cors
const whitelist = [
  'http://127.0.0.1:3000',
  'http://localhost:3000',
  'http://localhost:3000/'
];

app.use(fileUpload({ createParentPath: true }));
const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      // for mobile app and postman client
      return callback(null, true);
    }
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  allowedHeaders: '*',
  'Access-Control-Request-Headers': '*'
};

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60
  })
);
app.use(cors(corsOptions));
app.use(helmet());
app.use(mongoSanitize({ allowDots: true }));
app.use(express.json());
app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: false }));

// Routers
const { errorHandler, notFound } = require('./middlewares');

// const userRouter = require('./api/user');
//
// app.use('/api/v1/user', userRouter);
//
// Error Handlers
app.use(notFound);
app.use(errorHandler);

module.exports = { app };
