// Dependencies
require('dotenv').config()
require('./mongo')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const handleError = require('./middlewares/handleError')
const notFound = require('./middlewares/notFound')
const Note = require('./models/Note')
const {PORT} = process.env

// App Configuration
morgan.token('req-body', (req) => JSON.stringify(req.body))
const app = express()
app.use(express.json())
app.use(cors())
app.use(morgan((tokens, req, res) => {
    const logArray = [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), 
      '-', 
      tokens['response-time'](req, res), 
      'ms'
    ];
    if (req.method === 'POST') {
      logArray.push(tokens['req-body'](req, res));
    }
  
    return logArray.join(' ');
}));
app.use(express.static('dist'))

// Endpoints
app.get('/', (request, response) => {
    const text = `Notes has info for ${Note.length + 1} notes`
    const date = new Date()
    response.send(`<p>${text}</p><p>${date}</p>`)
})
app.get('/api/notes', (request, response, next) => {
    Note.find({})
    .then(notes => response.json(notes))
    .catch(error => next(error))
})
app.get('/api/notes/:id', (request, response, next) => {
    const id = request.params.id
    Note.findById(id)
    .then(note => response.json(note))
    .catch(error => next(error))
})
app.post('/api/notes', (request, response, next) => {
    const content = request.body.content
    if (content === undefined) return response.status(400).json({error: 'Content missing'})
    const newNote = {
        content: content,
        date: request.body.date,
        important: request.body.important
    }
    new Note(newNote).save()
    .then(noteSaved => response.json(noteSaved))
    .catch(error => next(error))
})
app.put('/api/notes/:id', (request, response, next) => {
    const id = request.params.id
    const newNote = {
        content: request.body.content,
        date: request.body.date,
        important: request.body.important
    }
    Note.findByIdAndUpdate(id, newNote, {new: true, runValidators: true, context: 'query'})
    .then(noteUpdated => response.json(noteUpdated))
    .catch(error => next(error))
})
app.delete('/api/notes/:id', (request, response, next) => {
    const id = request.params.id
    Note.findByIdAndDelete(id)
    .then(() => response.json({success: `Deleted note with ID ${id}`}))
    .catch(error => next(error))
})

// Middlewares for handling errors
app.use(notFound)
app.use(handleError)

// Output
app.listen(PORT, () => console.log(`Server is running at port ${PORT}`))