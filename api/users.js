var express = require('express')
var router = express.Router();
var dbo = require("./database")
var bodyParser = require('body-parser');
const { ObjectId } = require('bson');

var urlencodedParser = bodyParser.urlencoded({
    extended: false
})

router.get('/', (request, response) => {
    const dbConnect = dbo.getDb();

    dbConnect
        .collection("utenti")
        .find({}).limit(50)
        .toArray(function (err, result) {
            if (err) {
                response.status(400).send("Error fetching listings!");
            } else {
                response.json(result);
            }
        });
})

router.get('/:id/', (request, response) => {
    const dbConnect = dbo.getDb();
    console.log(request.params['id'])

    dbConnect
        .collection("annunci")
        .findOne({"proprietario._id": new ObjectId(request.params['id'])}, function (err, result) {
            if (err) {
                response.status(400).send("Error fetching listings!");
            } else {
                response.json(result);
            }
        });
})

router.post('/', urlencodedParser, (request, response) => {
    console.log('Got body:', request.body);
    const dbConnect = dbo.getDb();

    const userDocument = {
        name: request.body['name'],
        email: request.body['email'],
        password: request.body['password'],
        eta: request.body['eta'],
        hobby: request.body['hobby'],
        facolta: request.body['facolta'],
        genere: request.body['genere'],
        descrizione: request.body['descrizione'],
        recensioni: [],
        role: 'user'
    };

    dbConnect
        .collection("utenti")
        .insertOne(userDocument, function (err, result) {
            if (err) {
                response.status(400).send("Error inserting user!");
            } else {
                console.log(`Added a new match with id ${result.insertedId}`);
                response.status(204).send();
            }
        });
})

module.exports = router;