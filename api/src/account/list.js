const service = require('./service')
const Account = require('./model')

module.exports = async function list (ctx) {
  try {
    const accounts = await service.list({}, ctx.query)
    ctx.status = 200
    ctx.body = {
      accounts: accounts.map(account => {
        return new Account(account).toObject({ virtuals: true })
      }),
      ...ctx.query.limit ? { totalCount : await service.count(ctx.query) } : {}
    }
  } catch (err) {
    ctx.throw(err.status, err.message)
  }
}
