var express = require('express')
var router = express.Router();
var dbo = require("./database")
var bodyParser = require('body-parser')

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
                res.status(400).send("Error fetching listings!");
            } else {
                res.json(result);
            }
        });
})

router.get('/:id', (request, response) => {
    const dbConnect = dbo.getDb();

    dbConnect
        .collection("annunci")
        .findOne({
            _id: request.params['id']
        }).limit(50)
        .toArray(function (err, result) {
            if (err) {
                res.status(400).send("Error fetching listings!");
            } else {
                res.json(result);
            }
        });
})

router.post('/', urlencodedParser, (request, response) => {
    console.log('Got body:', req.body);
    console.log(connection)
    const dbConnect = dbo.getDb();

    const matchDocument = {
        // dati annuncio
    };

    dbConnect
        .collection("matches")
        .insertOne(matchDocument, function (err, result) {
            if (err) {
                response.status(400).send("Error inserting matches!");
            } else {
                console.log(`Added a new match with id ${result.insertedId}`);
                response.status(204).send();
            }
        });
})

router.put('/', (request, response) => {
    const dbConnect = dbo.getDb();
    const listingQuery = {
        _id: req.body.id
    };
    const updates = {
        $inc: {
            likes: 1
        }
    };

    dbConnect
        .collection("listingsAndReviews")
        .updateOne(listingQuery, updates, function (err, _result) {
            if (err) {
                response.status(400).send(`Error updating likes on listing with id ${listingQuery.id}!`);
            } else {
                response.send('updated')
                console.log("1 document updated");
            }
        });
})

router.delete('/:id', (request, response) => {
    const dbConnect = dbo.getDb();
    const listingQuery = {
        // ID
    };

    dbConnect
        .collection("listingsAndReviews")
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