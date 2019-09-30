const service = require('./service')
const Account = require('./model')
const { logger, validate, spec } = require('@root/lib/utils')

const GIFT_AMOUNT = 100

module.exports = async function create (ctx) {
  const { body } = ctx.request
  const validation = validate(spec.components.schemas.Credentials, body)
  if (!validation.isValid) {
    ctx.throw(400, 'Bad request', { errors: validation.errors })
  }
  try {
    const account = await service.create(body)
    ctx.status = 201
    ctx.body = {
      account: new Account(account).toObject({ virtuals: true })
    }
  } catch (err) {
    ctx.throw(err.status, err.message)
  }
}
