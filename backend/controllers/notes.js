const notesRouter = require('express').Router()
const Note = require('../models/Note')

notesRouter.get('/info', (request, response) => {
    const text = `Notes has info for ${Note.length + 1} notes`
    const date = new Date()
    response.send(`<p>${text}</p><p>${date}</p>`)
})
notesRouter.get('/', (request, response, next) => {
    Note.find({})
    .then(notes => response.json(notes))
    .catch(error => next(error))
})
notesRouter.get('/:id', (request, response, next) => {
    const id = request.params.id
    Note.findById(id)
    .then(note => response.json(note))
    .catch(error => next(error))
})
notesRouter.post('/', (request, response, next) => {
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
notesRouter.put('/:id', (request, response, next) => {
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
notesRouter.delete('/:id', (request, response, next) => {
    const id = request.params.id
    Note.findByIdAndDelete(id)
    .then(() => response.json({success: `Deleted note with ID ${id}`}))
    .catch(error => next(error))
})

module.exports = notesRouter