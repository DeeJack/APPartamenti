var express = require('express')
var dotenv = require('dotenv') // https://www.npmjs.com/package/dotenv
var app = express()
const {
    MongoClient
} = require("mongodb");

const connectionString = process.env.ATLAS_URI;
const client = new MongoClient(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

client.connect(function (err, db) {
    if (err || !db) {
        console.error(err);
    }

    dbConnection = db.db("sample_airbnb");
    console.log("Successfully connected to MongoDB.");
});


var annunci = require('./api/annunci')

app.use(express.static('public'))

app.get('/', (request, response) => {
    response.redirect('/index.html')
})

app.use('/annunci/', annunci)

app.listen(80, () => {
    console.log('listening')
})