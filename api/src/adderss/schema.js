const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  street: {
    type: String,
    trim: true,
    required: true
  },
  additional: {
    type: String,
    trim: true
  },
  region: {
    type: String,
    trim: true
  },
  locality: {
    type: String,
    trim: true,
    required: true
  },
  postalCode: {
    type: String,
    trim: true,
    required: true
  },
  countryCode: {
    type: String,
    trim: true,
    required: true
  }
})

module.exports = schema
