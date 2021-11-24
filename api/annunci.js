var express = require('express')
var router = express.Router();

router.get('/', (request, response) => {
    response.json({ annunci: [{id: 1}, {id: 2}] })
})

module.exports = router;