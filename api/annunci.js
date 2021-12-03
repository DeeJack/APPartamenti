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
    console.log(request)
    response.json({
        id: request.params["id"]
    })
})

router.post('/', urlencodedParser, (request, response) => {
    console.log('Got body:', req.body);
    console.log(connection)
})

module.exports = router;