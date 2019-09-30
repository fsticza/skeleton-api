const Router = require('koa-router')
const actions = require('./actions')
const jwt = require('@root/middlewares/jwt')
const ACL = require('@root/middlewares/ACL')
const router = new Router()

router.get('/', jwt(), ACL(['isSignedIn', 'isAdmin']), actions.list)
  .post('/', jwt(), ACL(['isSignedIn', 'isAdmin']), actions.create)
  .get('/:id', jwt(), ACL(['isSignedIn']), actions.show)
  .patch('/:id', jwt(), ACL(['isSignedIn']), actions.update)
  .delete('/:id', jwt(), ACL(['isSignedIn', 'isAdmin']), actions.destroy)

module.exports = router
