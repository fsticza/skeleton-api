const refParser = require('json-schema-ref-parser')

const parser = async (spec) => {
  const derefedSpec = await refParser.dereference(spec)
  const { info, servers, components } = derefedSpec
  return Object.keys(derefedSpec.paths).reduce((parsedSpec, path) => {
    Object.keys(derefedSpec.paths[path]).reduce((methods, method) => {
      const action = derefedSpec.paths[path][method]
      action.tags.forEach(tag => {
        const { description, parameters, requestBody } = action
        parsedSpec[tag] = parsedSpec[tag] || {}
        parsedSpec[tag][action.operationId] = {
          description,
          path,
          method,
          security: action.security || spec.security,
          parameters,
          requestBody
        }
      })
      return methods
    }, {})
    return parsedSpec
  }, { info, servers, components })
}

module.exports = parser
