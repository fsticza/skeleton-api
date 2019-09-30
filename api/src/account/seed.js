const accountService = require('./service')
const { logger } = require('@root/lib/utils')

module.exports = () => {
  logger.info('creating admin account...')
  return accountService.create({
    firstName: 'Admin',
    lastName: 'Skeleton',
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PW,
    roles: ['USER', 'ADMIN']
  }).then(res => {
    logger.info('admin account created')
    return res
  })
}
