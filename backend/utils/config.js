require('dotenv').config()
const {PORT, MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV} = process.env
module.exports = {PORT, MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV}
