var express = require('express')
var dotenv = require('dotenv') // https://www.npmjs.com/package/dotenv
var app = express()
dotenv.config() // Load the .env file

var mongodb = require('./api/database')
mongodb.connectToServer((err) => {
    if (err)
        console.error(err)
})

const port = 80

app.use(express.static('public')) // Static files (html files, scripts, css)

app.use(express.json())

app.get('/', (request, response) => {
    response.redirect('/views/index.html')
})

var annunci = require('./api/annunci')
var roles = require('./api/roles')
var users = require('./api/users')

app.use('/annunci/', annunci)
app.use('/roles/', roles)
app.use('/users/', users)

app.listen(port, () => {
    console.log('listening on port:', port)
})