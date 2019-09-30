const Account = require('./model')
const { hashPassword } = require('./utils')
const { throwError } = require('@root/lib/utils')

exports.count = (filter) => {
  /* TODO: refactor to filter by any field */
  return Account.find({
    ...filter.search ? {
      balance: { $eq: parseInt(filter.search, 10) }
    } : {}
  }).countDocuments()
}

exports.create = payload => {
  return Account.findOne({
    email: payload.email
  })
    .then(existingAccount => {
      if (existingAccount) {
        throwError(409)
      }
    })
    .then(() => {
      const { password } = payload
      payload.password = hashPassword(password)
      const account = new Account(payload)
      return account.save()
    })
}

exports.list = (params = {}, filter, fields = []) => {
  const $limit = parseInt(params.limit || filter.limit || 25, 10)
  const $skip = parseInt(params.skip || filter.skip || 0, 10)
  let sortBy = params.sortBy || filter.sortBy || null
  const order = parseInt(filter.order, 10)

  /* TODO: refactor to filter by any field */
  const filterObject = {
    ...filter.search ? {
      balance: { $eq: parseInt(filter.search, 10) }
    } : {}
  }

  let sortObject = { _id: 1 }
  if (sortBy) {
    if (sortBy === 'id') {
      sortBy = '_id'
    } else {
      delete sortObject._id
    }
    sortObject[sortBy] = order
  }

  return Account
    .find(filterObject, fields.join(' ').trim())
    .sort(sortObject)
    .limit(parseInt($limit, 10))
    .skip(parseInt($skip, 10))
}

exports.show = params => {
  if (params.id) {
    return Account.findById(params.id)
  }
  return Account.findOne(params)
}

exports.destroy = id => {
  return Account.findByIdAndRemove(id)
}

exports.update = (id, payload) => {
  return Account.updateOne({ _id: id }, { $set: payload })
}
