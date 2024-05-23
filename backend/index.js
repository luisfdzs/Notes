const app = require('./app')
const {info} = require('./utils/logger')
const {PORT} = require('./utils/config')

app.listen(PORT, () => 
    info(`Server is running at port ${PORT}`)
)