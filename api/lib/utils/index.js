const crypto = require('crypto')
const { promisify } = require('util')
const winston = require('winston')
const Ajv = require('ajv')
const randomBytesAsync = promisify(crypto.randomBytes)

const spec = require('@root/openapi.json')
const specParser = require('../spec-parser')

const ajv = new Ajv({
  allErrors: true,
  $data: true,
  format: 'full'
})
ajv.addFormat('password', /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,64}$/)

const validate = (schema, data) => {
  return {
    isValid: ajv.validate(schema, data),
    errors: ajv.errors || []
  }
}

const validateField = (schema, data, name) => {
  const formValidation = validate(schema, data)
  const errors = formValidation.errors
    ? formValidation.errors.filter(err => err.dataPath === `.${name}`)
    : []
  return {
    isValid: !errors.length,
    errors
  }
}

const genRandomString = length => {
  return randomBytesAsync(Math.ceil(length / 2))
    .then(bytes => bytes.toString('hex').slice(0, length))
}

const logger = winston.createLogger({
  level: 'info',
  levels: winston.config.npm.levels,
  format: winston.format.json(),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}

const errors = {
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  500: 'Internal Server Error'
}

const throwError = status => {
  const err = new Error(errors[status])
  err.status = status
  throw err
}

exports.throwError = throwError
exports.validate = validate
exports.validateField = validateField
exports.logger = logger
exports.spec = spec
exports.parseSpec = specParser(spec)
exports.genRandomString = genRandomString
