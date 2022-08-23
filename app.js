const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/rateLimit');
const { centralErrorsHandler } = require('./middlewares/centralErrorsHandler');

const app = express();

const { PORT = 3001 } = process.env;

const options = {
  origin: [
    'http://localhost:3000',
  ],
  credentials: true,
};
const mongoUrl = process.env.DATABASE_URL ? process.env.DATABASE_URL : 'mongodb://localhost:27017/moviesdb';

mongoose.connect(mongoUrl);

app.use('*', cors(options));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(requestLogger);
app.use(limiter);

app.use(require('./routes/index'));

app.use(errorLogger);

app.use(errors());

app.use(centralErrorsHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
