const whitelist = [
  'http://127.0.0.1:3000',
  'http://localhost:3000',
  'http://localhost:3000/',
  'http://127.0.0.1:5173',
  'http://localhost:5173',
  'http://localhost:5173/',
  'https://ancestree.vercel.app/',
  'https://ancestree.vercel.app'
];

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
  'Access-Control-Request-Headers': '*',
  'Access-Control-Max-Age': 1000
};

module.exports = corsOptions;
