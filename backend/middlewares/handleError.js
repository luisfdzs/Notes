module.exports = (error, request, response, next) => {
    switch (error.name) {
        case 'CastError':
            return response.status(400).send({error: 'malformatted id'})
        case 'ValidationError':
            return response.status(400).send({error: error.message})
        default:
            response.status(500).send({error: error.message})            
    }
}