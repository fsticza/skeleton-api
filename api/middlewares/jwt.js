const jwt = require('koa-jwt')

module.exports = (options) => {
  return jwt({
    ...options,
    secret: process.env.JWT_SECRET,
    key: 'jwtData'
  })
}
