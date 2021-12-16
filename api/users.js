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

    dbConnect
        .collection("utenti")
        .findOne({"_id": new ObjectId(request.params['id'])}, function (err, result) {
            if (err) {
                response.status(400).send("Error fetching listings!");
            } else {
                response.json(result);
            }
        });
})

router.get('/:id/annuncio/', (request, response) => {
    const dbConnect = dbo.getDb();

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
    const dbConnect = dbo.getDb();

    const userDocument = {
        nome: request.body['nome'],
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
                response.status(204).send();
            }
        });
})

module.exports = router;