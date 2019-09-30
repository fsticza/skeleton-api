const jwt = require('jsonwebtoken')
const Token = require('../token/model')
const config = require('./config')
const Account = require('../../account/model')
const { throwError } = require('@root/lib/utils')
const expiresIn = config.tokenTTL

exports.create = ({ email, password }) => {
  return Account.findOne({ email }).select('+email +password')
    .then(account => {
      if (!account || !account.isSamePassword(password)) {
        throwError(403)
      }
      const { id } = account
      const token = jwt.sign({ id, debug: process.env.NODE_ENV === 'development' }, process.env.JWT_SECRET, {
        expiresIn
      })
      const authToken = new Token({ accountId: id, token })
      // NOTE: account contains password at this point, DO NOT FORWARD IT
      return authToken.save()
    })
}
exports.destroy = id => {
  // TODO: make id optional
  return Token.findByIdAndRemove(id)
}
exports.update = payload => {
}
