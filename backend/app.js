
const express = require('express')
const cors = require('cors')
const middleware = require('./utils/middleware')
const notesRouter = require('./controllers/notes')
const mongoose = require('mongoose')
const {info, error} = require('./utils/logger')
const {NODE_ENV, MONGO_DB_URI, MONGO_DB_URI_TEST} = require('./utils/config')

mongoose.set('strictQuery', false)
const connectionString = NODE_ENV === 'production'
    ? MONGO_DB_URI
    : MONGO_DB_URI_TEST
mongoose
    .connect(connectionString)
    .then(() => info('Database Connected'))
    .catch(error => error(error))

const app = express()
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use('/api/notes', notesRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app