require('dotenv').config()
const accountSeed = require('./src/account/seed')
const { logger } = require('./lib/utils')

module.exports = () => {
  return accountSeed()
    .then(() => {
      logger.info('account seed done')
    })
    .catch(err => {
      if (err.status !== 409) {
        logger.error(err)
      }
    })
}
