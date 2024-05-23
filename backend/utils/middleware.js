const {info, error} = require('./logger')
const requestLogger = (request, response, next) => {
    info('Method: ', request.method)
    info('Path: ', request.path)
    info('Body: ', request.body)
    info('---')
    next()
}

const unknownEndpoint = (request, response, next) => {
    response.status(404).send({error: 'Unknown endpoint'})
}

const errorHandler = (error, request, response, next) => {
    switch (error.name) {
        case 'CastError':
            return response.status(400).send({error: 'malformatted id'})
        case 'ValidationError':
            return response.status(400).send({error: error.message})
        default:
            response.status(500).send({error: error.message})            
    }
}
module.exports = {requestLogger, unknownEndpoint, errorHandler}