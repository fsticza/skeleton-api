const service = require('./service')
const Account = require('./model')
const { throwError } = require('@root/lib/utils')

module.exports = async function show (ctx) {
  const { query, params } = ctx
  try {
    const { reqAccount, jwtData } = ctx.state
    if (jwtData.id && params.id === 'me') {
      params.id = id
    }
    const isAdmin = reqAccount.roles.includes('ADMIN')
    const isOwn = jwtData.id === params.id || params.id === 'me'
    const canAccess = isAdmin || isOwn
    if (!canAccess) {
      throwError(403)
    }
    const account = isOwn ? reqAccount : await service.show(Object.assign({}, query, params))
    if (!account) {
      throwError(404)
    }
    ctx.status = 200
    ctx.body = {
      account: new Account(account).toObject({ virtuals: true })
    }
  } catch (err) {
    ctx.throw(err.status, err.message)
  }
}
