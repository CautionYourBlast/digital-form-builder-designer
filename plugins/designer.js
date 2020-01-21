const shortid = require('shortid')
const schema = require('digital-form-builder-engine/schema')
const Wreck = require('@hapi/wreck')
const pkg = require('./../package.json')
const joi = require('joi')

const publish = async function (id, configuration) {
  return await Wreck.post('http://localhost:3009/publish', {
    payload: JSON.stringify({id, configuration})
  })
};


const designerPlugin = {
  plugin: {
    name: pkg.name,
    version: pkg.version,
    multiple: true,
    dependencies: 'vision',
    register: (server) => {

      server.route({
        method: 'get',
        path: `/`,
        options: {
          handler: (request, h) => {
            return h.redirect(`/${shortid.generate()}`)
          }
        }
      })

      // DESIGNER
      server.route({
        method: 'get',
        path: `/{id}`,
        options: {
          handler: (request, h) => {
            let { id } = request.params
            return h.view('designer', { id })
          }
        }
      })

      // GET DATA
      server.route({
        method: 'GET',
        path: `/{id}/api/data`,
        options: {
          handler: (request, h) => {
            return h.response(require('./../new-form')).type('application/json')
          },
        }
      })

      // SAVE DATA
      server.route({
        method: 'PUT',
        path: `/{id}/api/data`,
        options: {
          handler: async (request, h) => {
            let { id } = request.params
            try {
              const result = joi.validate(request.payload, schema, { abortEarly: false })

              if (result.error) {
                console.log(result.error)
                throw new Error('Schema validation failed')

              }
              await publish(id, result.value)
              return h.response({ok: true}).code(204)

            } catch (err) {
              return h.response({ ok: false, err: 'Write file failed' }).code(401)
            }
          },
          validate: {
            payload: joi.object().required()
          },
        }
      })
    }
  }
}

module.exports = {
  designerPlugin
}
