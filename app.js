var express = require('express')
var dotenv = require('dotenv') // https://www.npmjs.com/package/dotenv
var app = express()
var cookieParser = require('cookie-parser');
dotenv.config() // Load the .env file
var dbo = require("./api/database")
const { ObjectId } = require('bson');

var mongodb = require('./api/database')
mongodb.connectToServer((err) => {
    if (err)
        console.error(err)
})

const port = 80

app.use(express.static('public')) // Static files (html files, scripts, css)

app.use(express.json())
app.use(cookieParser())

app.use(function (request, response, next) {
    if (request.cookies.user == undefined) {
        console.log('asd')
        const dbConnect = dbo.getDb();
        dbConnect
            .collection("utenti")
            .findOne({
                "_id": new ObjectId('61af97d23685caaaa69438ac')
            }, function (err, result) {
                if (err) {
                    response.status(400).send("Error fetching user!");
                } else {
                    response.cookie('user', result)
                    console.log(response.get('Cookie'))
                }
                next();
            });
    }
    else
        next();
    console.log(request.cookies.user)
})

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