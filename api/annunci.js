var express = require('express')
var router = express.Router();

router.use(express.json())

var dbo = require("./database")
var bodyParser = require('body-parser');
const {
    ObjectId
} = require('bson');

var urlencodedParser = bodyParser.urlencoded({
    extended: false
})


router.get('/', (request, response) => {
    const dbConnect = dbo.getDb(); // Ottiene la connessione al database

    dbConnect
        .collection("annunci")
        .find({}).limit(50) // Cerca 50 annunci dalla collezione annunci
        .toArray(function (err, result) {
            if (err) {
                response.status(400).send("Error fetching listings!");
            } else {
                response.json(result);
            }
        });
})

router.get('/:id', (request, response) => {
    const dbConnect = dbo.getDb(); // Ottiene la connessione al database

    dbConnect
        .collection("annunci")
        .findOne({ // Cerca un annuncio con un certo ID
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
    const dbConnect = dbo.getDb(); // Ottiene la connessione al database

    const matchDocument = { // Crea un oggetto prendendo le informazioni dal body
        titolo: request.body['titolo'],
        ubicazione: request.body['ubicazione'],
        numCamere: request.body['numCamere'],
        prezzo: request.body['prezzo'],
        numBagni: request.body['numBagni'],
        isolamento: request.body['isolamento'],
        riscaldamento: request.body['riscaldamento'],
        wifi: request.body['wifi'],
        servizi: request.body['servizi'],
        classeEnergetica: request.body['classeEnergetica'],
        foto: request.body['foto'],
        proprietario: request.cookies.user, // Prende l'utente dai cookies
    };
    matchDocument.proprietario._id = new ObjectId(matchDocument.proprietario._id)

    dbConnect
        .collection("annunci")
        .insertOne(matchDocument, function (err, result) { // Inserisce l'annuncio
            if (err) {
                response.status(400).send("Error inserting listings!");
            } else {
                response.status(204).send();
            }
        });
})

router.put('/', (request, response) => {
    const dbConnect = dbo.getDb(); // Ottiene la connessione al database
    const listingQuery = {
        _id: new ObjectId(request.body['_id']) // Prende l'ID dell'annuncio da modificare
    };
    const updates = {
        $set: {
            titolo: request.body['titolo'],
            ubicazione: request.body['ubicazione'],
            numCamere: request.body['numCamere'],
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

    dbConnect
        .collection("annunci")
        .updateOne(listingQuery, updates, function (err, _result) { // Aggiorna l'annuncio
            if (err) {
                response.status(400).send(`Error updating likes on listing with id ${listingQuery.id}!`);
            } else {
                response.send('Updated')
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
            }
        });
})

module.exports = router;