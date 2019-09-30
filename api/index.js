require('module-alias/register')
require('dotenv').config()

const Koa = require('koa')
const requestLogger = require('koa-logger')
const bodyParser = require('koa-body')
const json = require('koa-json')
const helmet = require('koa-helmet')
const cors = require('@koa/cors')

const router = require('./router')
const db = require('./db')
const seed = require('./seed')
const { logger } = require('./lib/utils')
const app = new Koa()
const PORT = process.env.PORT || 3001

app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)
})

app.use((ctx, next) => {
  return next().catch((err) => {
    if (err.status === 401) {
      ctx.status = 401
      ctx.body = {
        error: err.originalError ? err.originalError.message : err.message
      }
    } else {
      throw err
    }
  })
})

app.use(helmet())

app.use(requestLogger())

app.use(json())

app.use(cors())

app.use(bodyParser({
  multipart: true
}))

app.use(router.routes())

app.use(router.allowedMethods())

app.on('error', (err, ctx) => {
  logger.error(`server error ${err} ${ctx}`)
})

if (!module.parent) {
  db.connect()
    .then(() => {
      logger.info('Connected to DB')
      seed()
    })
    .catch(err => {
      logger.error('Failed to connect to DB')
      logger.error(err.message)
      process.exit(1)
    })

  app.listen(PORT, () => logger.info(`Listening on ${PORT}`))
}

module.exports = app
