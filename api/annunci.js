var express = require('express')
var router = express.Router();
var dbo = require("./database")
var bodyParser = require('body-parser');
const {
    ObjectId
} = require('bson');

var urlencodedParser = bodyParser.urlencoded({
    extended: false
})


router.get('/', (request, response) => {
    const dbConnect = dbo.getDb();

    dbConnect
        .collection("annunci")
        .find({}).limit(50)
        .toArray(function (err, result) {
            if (err) {
                response.status(400).send("Error fetching listings!");
            } else {
                response.json(result);
            }
        });
})

router.get('/:id', (request, response) => {
    const dbConnect = dbo.getDb();

    dbConnect
        .collection("annunci")
        .findOne({
            _id: new ObjectId(request.params['id'])
        }, function (err, result) {
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

    const matchDocument = {
        titolo: request.body['titolo'],
        ubicazione: request.body['ubicazione'],
        prezzo: request.body['prezzo'],
        numBagni: request.body['numBagni'],
        isolamento: request.body['isolamento'],
        riscaldamento: request.body['riscaldamento'],
        wifi: request.body['wifi'],
        servizi: request.body['servizi'],
        classeEnergetica: request.body['classeEnergetica'],
        foto: request.body['foto'],
        proprietario: request.cookies.user,
    };
    matchDocument.proprietario._id = new ObjectId(matchDocument.proprietario._id)
    console.log(matchDocument)

    dbConnect
        .collection("annunci")
        .insertOne(matchDocument, function (err, result) {
            if (err) {
                response.status(400).send("Error inserting listings!");
            } else {
                console.log(`Added a new match with id ${result.insertedId}`);
                response.status(204).send();
            }
        });
})

router.put('/', (request, response) => {
    const dbConnect = dbo.getDb();
    const listingQuery = {
        _id: new ObjectId(request.body['_id'])
    };
    const updates = {
        $set: {
            titolo: request.body['titolo'],
            ubicazione: request.body['ubicazione'],
            prezzo: request.body['prezzo'],
            numBagni: request.body['numBagni'],
            isolamento: request.body['isolamento'],
            riscaldamento: request.body['riscaldamento'],
            wifi: request.body['wifi'],
            servizi: request.body['servizi'],
            classeEnergetica: request.body['classeEnergetica'],
            foto: request.body['foto'],
            proprietario: request.cookies.user,
        }
    };
    updates.$set.proprietario._id = new ObjectId(updates.$set.proprietario._id)
    console.log(updates)

    dbConnect
        .collection("annunci")
        .updateOne(listingQuery, updates, function (err, _result) {
            if (err) {
                response.status(400).send(`Error updating likes on listing with id ${listingQuery.id}!`);
            } else {
                console.log(_result)
                response.send('Updated')
                console.log("1 document updated");
            }
        });
})

router.delete('/:id', (request, response) => {
    const dbConnect = dbo.getDb();
    const listingQuery = {
        _id: new ObjectId(request.params['id'])
    };

    dbConnect
        .collection("annunci")
        .deleteOne(listingQuery, function (err, _result) {
            if (err) {
                response.status(400).send(`Error deleting listing with id ${listingQuery.listing_id}!`);
            } else {
                response.redirect('/')
                console.log("1 document deleted");
            }
        });
})

module.exports = router;