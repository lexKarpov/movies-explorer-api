const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const {limiter} = require('./middlewares/rateLimit');
const app = express();

const NotFound = require('./errors/Error404');

const { PORT = 3000 } = process.env;

const options = {
  origin: [
    'http://localhost:3000',
  ],
  credentials: true,
};
 
mongoose.connect('mongodb://localhost:27017/moviesdb');
app.use('*', cors(options));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(requestLogger);
app.use(limiter)
app.use('/', require('./routes/index'));

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
