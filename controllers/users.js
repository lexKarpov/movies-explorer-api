const bcrypt = require('bcryptjs');
const User = require('../models/users');
const Badreq = require('../errors/Error400');
const NotFound = require('../errors/Error404');
const Conflict = require('../errors/Error409');
const Unauthorized = require('../errors/Error401');
const { generateToken } = require('../helpers/jwt');
const { ERROR_DUPLICATE, SALT_ROUNDS } = require('../constants/constants');

function getUser(req, res, next) {
  User.findById(req.user.id)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => (err.name === 'ValidationError' ? next(new Badreq('Некорректные данные.')) : next(err)));
}

function patchUser(req, res, next) {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user.id, { email, name }, { new: true, runValidators: true })
    .then((user) => (!user ? next(new NotFound('Пользователь с таким id не найден')) : res.send(user)));
}

function createUser(req, res, next) {
  const {
    email,
    password,
    name,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return bcrypt
          .hash(password, SALT_ROUNDS)
          .then((hash) => User.create({
            email,
            password: hash,
            name,
          }));
      }
      throw new Conflict(`${user.email} уже занят`);
    })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.code === ERROR_DUPLICATE) {
        next(new Conflict('Данный email уже занят'));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new Badreq('Некорректные данные'));
      } else {
        next(err);
      }
    });
}

function login(req, res, next) {
  const {
    email,
    password,
  } = req.body;
  if (!email || !password) {
    next(new Badreq('Не передан емейл или пароль'));
  }
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new Badreq('Неправильный емейл или пароль');
      } else {
        return Promise.all([
          user,
          bcrypt.compare(password, user.password),
        ]);
      }
    })
    .then(([user, isPasswordCorrect]) => {
      if (!isPasswordCorrect) {
        throw new Unauthorized('Не авторизован');
      } else {
        const token = generateToken({ email: user.email, type: 'admin' });
        res.send({ token });
      }
    })
    .catch(next);
}

module.exports = {
  getUser,
  patchUser,
  createUser,
  login,
};
