const { RES_OK } = require('../constants/constants');
const NotFound = require('../errors/Error404');
const Badreq = require('../errors/Error400');
const InternalServer = require('../errors/Error500');
const Forbidden = require('../errors/Error403');
const Movie = require('../models/movies');

function getMovies(req, res, next) {
  Movie.find({})
    .then((movies) => (movies ? res.send(movies) : new NotFound('Не найдена')))
    .catch(next);
}

function postMovie(req, res, next) {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  })
    .then((movie) => res.status(RES_OK).send(movie))
    .catch((err) => (err.name === 'ValidationError' ? next(new Badreq('Некорректные данные.')) : next(err)));
}

function deleteMovie(req, res, next) {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        next(new NotFound('Не найдена'));
      }
      if (movie.owner.toString() !== req.user.id.toString()) {
        next(new Forbidden('Нельзя удалить эту карточку'));
        return;
      }
      movie.remove().then(() => res.send(movie));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new Badreq('Некорректные данные'));
      } else {
        next(new InternalServer('Что-то пошло не так'));
      }
    });
}

module.exports = {
  getMovies,
  postMovie,
  deleteMovie,
};
