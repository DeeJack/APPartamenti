var express = require('express')
var router = express.Router();

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Express API for APPartamenti',
            version: '1.0.0',
            description:
                'This is a REST API application made with Express.',
            license: {
                name: 'Licensed Under MIT',
                url: 'https://spdx.org/licenses/MIT.html',
            },
            contact: {
                name: 'Group47',
                url: 'https://github.com/DeeJack',
            },
           
        },
        servers: [
            {
                url: 'https://localhost/annunci/',
                description: 'server Annunci',
            },
        ],
    },
    apis: ["api/annunci.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

router.use(express.json())

var dbo = require("./database")
var bodyParser = require('body-parser');
const {
    ObjectId
} = require('bson');

var urlencodedParser = bodyParser.urlencoded({
    extended: false
})

/**
 * @swagger
 * components:
 *   schemas:
 *     Annunci:
 *       type: object
 *       required:
 *         - Titolo
 *         - Ubicazione
 *         - Numero di camere
 *         - Prezzo
 *         - Numero di bagni
 *         - Isolamento
 *         - Riscaldamento
 *         - Classe energetica
 *         - Wifi
 *         - Servizi
 *         - foto
 *         - data ultma modifica
 *         - proprietario
 *       properties:
 *         id: 
 *           type: string
 *           description : id annuncio generato automaticamente
 *         Titolo:
 *           type: string
 *           description: Il titolo dell'annuncio
 *         Ubicazione:
 *           type: string
 *           description: L'uicazone dell'appartamento
 *         Numero di camere: 
 *           type: integer
 *           description: Il numero di camere dell'appartamento
 *         Prezzo:
 *           type: double
 *           description: Il prezzo mensile dell'affitto (in €)
 *         Numero di bagni:
 *           type: integer
 *           description: Il numero di bagni dell'appartamento
 *         Isolamento:
 *           type: string
 *           description: Il tipo di isolamento dell'appartamento
 *         Riscaldamento:
 *           type: string
 *           description: Il tipo di riscaldamento dell'appartamento
 *         Classe energetica:
 *           type: string
 *           description: La classe energetica dell'appartamento
 *         Wifi:
 *           type: boolean
 *           description: Presenza del wifi
 *         Servizi:
 *           type: string
 *           description: I servizi nella zona dell'appartamento
 *         Proprietario:
 *           type: array
 *           description: Il proprietario dell'annuncio 
 *         foto:
 *           type: array
 *           description: Foto dell'appartamento
 *         data ultima modifica:
 *           type: string
 *           description: data dell'ultima modifica effettuata sull'annuncio 
 *       example:
 *         id: Ge47h2
 *         Titolo: Stanza singola Urbino Centro
 *         Ubicazione: Urbino
 *         Numero di camere: 1
 *         Prezzo: 290.00
 *         Numero di bagni: 1
 *         Isolamento: cappotto isolante
 *         Riscaldamento: a pavimento
 *         Classe energetica: D
 *         Wifi: true
 *         Servizi: autobus di linea
 *         Proprietario: Giovanni Zeni
 *         foto:
 *         data ultima modifica: 18/12/2021
 */

/**
 * @swagger
 * tags:
 *   name: Annunci
 *   Description: API di gestione annunci
 */

/**
 * @swagger
 * /annunci/:
 *   get:
 *     summary: Recupera una lista di annunci.
 *     tags: [Annunci]
 *     responses:
 *       200:
 *         description: Una lista di 50 annunci.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Annunci'
 */

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

/**
 * @swagger
 * /annunci/{id}:
 *   get:
 *     summary: Recupera un annuncio.
 *     tags: [Annunci]
 *     parameters:
 *      - in: path
 *        name: Annuncio_Id
 *        schema:
 *          type: string
 *        required: true
 *        description: Recupera un annuncio tramite un id.
 *     responses:
 *       200:
 *         description: Cerca annuncio.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Annunci'
 *       400:
 *         description: error fetching listings!
 */        

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

/**
 * @swagger
 * /annunci/:
 *   post:
 *     summary: crea un annuncio.
 *     tags: [Annunci]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Annunci'
 *     responses:
 *       204:
 *         description: eseguito con successo
 *       400:
 *         description: error inserting listings!
*/

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

/**
 * @swagger
 * /annunci/{id}:
 *  put:
 *    summary: aggiorna un annuncio tramite un id
 *    tags: [Annunci]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: id dell'annuncio
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Annunci'
 *    responses:
 *      200:
 *        description: L'annuncioè stato aggiornato
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Annunci'
 *              
 *      400:
 *        description: Si è verificato un errore nell'aggiornamento dell'annuncio  
 */
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

/**
 * @swagger
 * /annunci/{id}:
 *   delete:
 *     summary: Cancella un annuncio.
 *     tags: [Annunci]
 *     parameters:
 *       - in: path
 *         id: id
 *         schema:
 *             type: string
 *         required: true
 *         description: id dell'annuncio
 *     responses:
 *       200:
 *         description: l'annuncio è stato cancellato con successo!
 *       400:
 *         description: errore! cancellazone non avvenuta!
*/

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