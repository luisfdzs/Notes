// Dependencies
require('dotenv').config()
require('./mongo')
const express = require('express')
const Note = require('./models/Note')
const {PORT} = process.env

// App Configuration
const app = express()
app.use(express.json())

// Endpoints
app.get('/', (request, response) => {
    response.send('<h1>Welcome to our API</h1>')
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
    const newNote = {
        content: request.body.content,
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
    Note.findByIdAndUpdate(id, newNote, {new: true})
    .then(noteUpdated => response.json(noteUpdated))
    .catch(error => next(error))
})
app.delete('/api/notes/:id', (request, response, next) => {
    const id = request.params.id
    Note.findByIdAndDelete(id)
    .then(() => response.json({success: `Deleted note with ID ${id}`}))
    .catch(error => next(error))
})

// Output
app.listen(PORT, () => console.log(`Server is running at port ${PORT}`))