var express = require('express')
var app = express()

app.use(express.static('public'))

app.get('/', (request, response) => {
    response.redirect('/index.html')
})

app.listen(80, () => {
    console.log('listening')
})
