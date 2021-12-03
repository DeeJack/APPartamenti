var express = require('express')
var router = express.Router();
var dbo = require("./database")

router.get('/', (request, response) => {
    const dbConnect = dbo.getDb();

    dbConnect
        .collection("roles")
        .find({}).limit(50)
        .toArray(function (err, result) {
            if (err) {
                response.status(400).send("Error fetching listings!");
            } else {
                response.json(result);
            }
        });
})

module.exports = router;