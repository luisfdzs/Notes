const {Schema, model} = require('mongoose')

const noteSchema = new Schema({
    content: {
        type: String,
        required: true,
        minLength: 5
    }, 
    date: String,
    important: Boolean
})

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Note = model('Note', noteSchema)

module.exports = Note