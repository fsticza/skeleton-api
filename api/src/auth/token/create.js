const service = require('./service')
const Token = require('./model')
const { logger, validate, spec } = require('@root/lib/utils')

module.exports = async function create (ctx) {
  const { body } = ctx.request
  const validation = validate(spec.components.schemas.Credentials, body)
  if (!validation.isValid) {
    ctx.throw(400, 'Bad request', { errors: validation.errors })
  }
  try {
    const token = await service.create(body)
    ctx.status = 201
    ctx.body = {
      token: new Token(token).toObject({ virtuals: true })
    }
  } catch (err) {
    ctx.throw(err.status, err.message)
  }
}
