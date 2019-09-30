const service = require('./service')

module.exports = async function destroy (ctx) {
  try {
    const { params } = ctx
    await service.destroy(params.id)
    ctx.status = 204
    ctx.body = {}
  } catch (err) {
    ctx.throw(err.status, err.message)
  }
}
