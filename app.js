var express = require('express')
var app = express()

var annunci = require('./api/annunci')

app.use(express.static('public'))

app.get('/', (request, response) => {
    response.redirect('/index.html')
})

app.use('/annunci/', annunci)

app.listen(80, () => {
    console.log('listening')
})
