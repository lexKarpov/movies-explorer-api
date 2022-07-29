const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/rateLimit');
const { centralErrorsHandler } = require('./middlewares/centralErrorsHandler');

const app = express();

const { PORT = 3000 } = process.env;

const options = {
  origin: [
    'http://localhost:3000',
  ],
  credentials: true,
};

mongoose.connect('mongodb://localhost:27017/moviesdb');
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
