const mongoose = require('mongoose');
const { isEmail } = require('validator');

const movieSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: [isEmail, 'Введите корректный email'],
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
});

module.exports = mongoose.model('user', movieSchema);
