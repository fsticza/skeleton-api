const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const config = require('./config')

module.exports = mongoose.model('AuthToken', new Schema({
  accountId: {
    type: ObjectId,
    required: true,
    ref: 'Account'
  },
  createdAt: {
    type: Date,
    expires: config.tokenTTL,
    default: new Date().toISOString()
  },
  token: {
    type: String,
    index: true,
    required: true
  }
}, {
  collection: 'authtokens',
  versionKey: 'v',
  toObject: {
    transform: function (doc, ret) {
      delete ret._id
    }
  }
}))
