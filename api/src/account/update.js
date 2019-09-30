const service = require('./service')
const Account = require('./model')
const { throwError } = require('@root/lib/utils')

module.exports = async function update (ctx) {
  const { params } = ctx
  const { body } = ctx.request
  try {
    const { reqAccount, jwtData } = ctx.state
    if (jwtData.id && params.id === 'me') {
      params.id = id
    }
    const isAdmin = reqAccount.roles.includes('ADMIN')
    const isOwn = jwtData.id === params.id
    const canAccess = isAdmin || isOwn
    if (!canAccess) {
      throwError(403)
    }
    const account = await service.update(params.id, body)
    ctx.status = 200
    ctx.body = {
      account: new Account(account).toObject({ virtuals: true })
    }
  } catch (err) {
    ctx.throw(err.status, err.message)
  }
}
