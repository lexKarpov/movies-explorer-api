const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { regExpURL } = require('../constants/constants');

const {
  getMovies,
  postMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi
      .string()
      .required(),
    director: Joi
      .string()
      .required(),
    duration: Joi
      .number()
      .required(),
    year: Joi
      .number()
      .required(),
    description: Joi
      .string()
      .required(),
    image: Joi
      .string()
      .required()
      .pattern(new RegExp(regExpURL)),
    trailerLink: Joi
      .string()
      .required()
      .pattern(new RegExp(regExpURL)),
    nameRU: Joi
      .string()
      .required(),
    nameEN: Joi
      .string()
      .required(),
    thumbnail: Joi
      .string()
      .required()
      .pattern(new RegExp(regExpURL)),
    movieId: Joi
      .number()
      .required(),
  }),
}), postMovie);

router.delete('/:_id', celebrate({
  params: Joi
    .object()
    .keys({
      _id: Joi
        .string()
        .required(),
    }),
}), deleteMovie);

module.exports = router;
