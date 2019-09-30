const accountService = require('@root/src/account/service')
const { throwError } = require('@root/lib/utils')

const rules = {
  async isSignedIn (ctx, next) {
    const { id } = ctx.state.jwtData
    if (!id) {
      throwError(401)
    }
    const reqAccount = await accountService.show({ id })
    if (!reqAccount) {
      throwError(401)
    }
    ctx.state.reqAccount = reqAccount
  },
  async isAdmin (ctx, next) {
    const { reqAccount } = ctx.state
    if (!reqAccount.roles.includes('ADMIN')) {
      throwError(403)
    }
  }
}

const ACL = (checkRules = []) => async (ctx, next) => {
  try {
    for (const rule of checkRules) { // @NOTE: async vs forEach
      await rules[rule](ctx, next)
    }
    await next()
  }
  catch (err) {
    ctx.throw(err.status, err.message)
  }
}

module.exports = ACL
