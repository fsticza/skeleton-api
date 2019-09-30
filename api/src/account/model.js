const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { hashPassword } = require('./utils')
const { roles } = require('./const')

const schema = new Schema({
  title: String,
  firstName: {
    type: String,
    default: '',
    trim: true
  },
  lastName: {
    type: String,
    default: '',
    trim: true
  },
  email: {
    type: String,
    unique: true,
    index: true,
    lowercase: true,
    trim: true,
    select: false
  },
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: (v) => /^[\+\-\.\(\)\/\d\s]{6,16}$/.test(v),
      message: props => `${props.value} is not a valid phone number!`
    },
  },
  password: {
    type: String,
    trim: true,
    select: false
  },
  roles: { type: [String], enum: roles }
}, {
  collection: 'accounts',
  versionKey: 'v',
  toObject: {
    transform: function (doc, ret) {
      ret.id = ret.id || ret._id
      delete ret._id
    }
  },
  timestamps: true
})

schema.methods = {
  isSamePassword (password) {
    return hashPassword(password) === this.password
  }
}

schema.virtual('fullName').get(function () {
  return [this.title, this.firstName, this.lastName].join(' ').trim()
})

schema.virtual('id').get(function () {
  return this._id
})

module.exports = mongoose.model('Account', schema)
