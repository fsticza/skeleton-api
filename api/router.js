const Router = require('koa-router')
const account = require('./src/account')
const token = require('./src/auth/token')

const router = new Router({
  prefix: '/v1'
})

router.get('/', async (ctx) => { ctx.body = 'OK' })

router.use('/auth/token', token.router.routes())

router.use('/accounts', account.router.routes())

module.exports = router
