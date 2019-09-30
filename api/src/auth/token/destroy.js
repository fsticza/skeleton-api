const service = require('./service')

module.exports = async function destroy (ctx) {
  const id = ctx.query.id
  try {
    await service.destroy(id)
    ctx.status = 204
    ctx.body = {}
  } catch (err) {
    ctx.throw(err.status, err.message)
  }
}
