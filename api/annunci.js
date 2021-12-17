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
                url: 'https://github.com/GioZeni',
                url: 'https://github.com/DeeJack',
                url: 'https://github.com/eprovvedini',
            },
        },
        servers: [
            {
                url: 'https://localhost/annunci/',
                description: 'server Annunci',
            },
        ],
    },
    apis: ["annunci.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
 * /annunci/:
 *   get:
 *     summary: Recupera una lista di annunci.
 *     description: Recupera una lista di annunci dal server.
 *     responses:
 *       200:
 *         description: Una lista di 50 annunci.
 *         content:
 *           application/json:
 *             schema:
 *               type: oggetto
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       Titolo:
 *                         type: string
 *                         description: Il titolo dell'annuncio
 *                         example: Stanza singola Urbino Centro
 *                       Ubicazione:
 *                         type: string
 *                         description: L'uicazone dell'appartamento
 *                         example: Urbino
 *                       Numero di camere: 
 *                         type: integer
 *                         description: Il numero di camere dell'appartamento
 *                         example: 1
 *                       Prezzo:
 *                         type: double
 *                         description: Il prezzo mensile dell'affitto (in €)
 *                         example: 290.00
 *                       Numero di bagni:
 *                          type: integer
 *                          description: Il numero di bagni dell'appartamento
 *                          example: 1
 *                       Isolamento:
 *                          type: string
 *                          description: Il tipo di isolamento dell'appartamento
 *                          example: cappotto isolante 
 *                       Riscaldamento:
 *                          type: string
 *                          description: Il tipo di riscaldamento dell'appartamento
 *                          example: a pavimento
 *                       Classe energetica:
 *                          type: string
 *                          description: La classe energetica dell'appartamento
 *                          example: D
 *                       Wifi:
 *                          type: boolean
 *                          description: Presenza del wifi
 *                          example: true
 *                       Servizi:
 *                          type: string
 *                          description: I servizi nella zona dell'appartamento
 *                          example: autobus di linea
 *                       Inquilini:
 *                          type: array
 *                          description: Gli inquilini dell'appartamento 
 *                          example: Giovanni Zeni
 *                       foto:
 *                          type: array
 *                          description: Foto dell'appartamento
 *                          example: 
 *       400:
 *         description: error fetching listings!
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
 * /annunci/:id:
 *   get:
 *     summary: Recupera un annuncio.
 *     parameters :
 *      - name: AnnuncioId
 *        in: path
 *        required: true
 *     description: Recupera un annuncio tramite un id.
 *     responses:
 *       200:
 *         description: Cerca annuncio.
 *         content:
 *           application/json:
 *             schema:
 *               type: oggetto
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       Titolo:
 *                         type: string
 *                         description: Il titolo dell'annuncio
 *                         example: Stanza singola Roma Nord
 *                       Ubicazione:
 *                         type: string
 *                         description: L'uicazone dell'appartamento
 *                         example: Roma Nord
 *                       Numero di camere: 
 *                         type: integer
 *                         description: Il numero di camere dell'appartamento
 *                         example: 2
 *                       prezzo massimo:
 *                          type: double
 *                          description: Prezzo dell'affitto (in €)
 *                          example: 450.00
 *                       Isolamento:
 *                          type: string
 *                          description: Il tipo di isolamento dell'appartamento
 *                          example: cappotto isolante 
 *                       Riscaldamento:
 *                          type: string
 *                          description: Il tipo di riscaldamento dell'appartamento
 *                          example: a pavimento
 *                       Classe energetica:
 *                          type: string
 *                          description: La classe energetica dell'appartamento
 *                          example: D
 *                       Wifi:
 *                          type: boolean
 *                          description: Presenza del wifi
 *                          example: true
 *                       Servizi:
 *                          type: string
 *                          description: I servizi nella zona dell'appartamento
 *                          example: metropolitana
 *                       Inquilini:
 *                          type: array
 *                          description: Gli inquilini dell'appartamento 
 *                          example: Giovanni Zeni
 *                       foto:
 *                          type: array
 *                          description: Foto dell'appartamento
 *                          example:  
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Titolo:
 *                  type: array
 *                  description: Titolo dell'annuncio
 *                  example: Camera in doppia a Milano
 *               Ubicazione:
 *                  type: string
 *                  description: Ubicazione dell'appartamento
 *                  example: Milano
 *               Numero di camere: 
 *                  type: integer
 *                  description: Numero di camere dell'appartamento
 *                  example: 2
 *               Prezzo:
 *                  type: double
 *                  description: Prezzo dell'affitto (in €)
 *                  example: 400 
 *               Numero di bagni:
 *                  type: integer
 *                  description: Numero di bagni 
 *                  example: 1
 *               Isolamento:
 *                  type: string
 *                  description: Tipo di isolamento
 *                  example: cappotto isolante
 *               Riscaldamento:
 *                  type: string
 *                  description: Tipo di riscaldamento
 *                  example: riscaldamento ad aria
 *               Classe energetica:
 *                  type: string
 *                  description: Classe energetica dell'appartamento
 *                  example: C
 *               Wifi:
 *                  type: boolean
 *                  description: Presenza del Wi-fi
 *                  example: true
 *               Servizi:
 *                  type: string
 *                  description: Servizi pubblici vicini all'appartamento
 *                  example: Metropolitana, autobus di linea
 *               foto:
 *                  type: array
 *                  description: Foto dell'appartamento
 *                  example: 
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