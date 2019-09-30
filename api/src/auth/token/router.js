const Router = require('koa-router')
const actions = require('./actions')
const jwt = require('@root/middlewares/jwt')
const router = new Router()

router
  .post('/', actions.create)
  .delete('/', jwt(), actions.destroy)

module.exports = router
