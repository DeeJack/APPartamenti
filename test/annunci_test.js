const test = require('tape')
const request = require('supertest')
const app = require('../app')
const dbo = require('../api/database')


dbo.connectToServer(() => {}).then(() => { // Connect to the database
    /**
     * Test for list of announcements!
     */
    test('Correct announcements list returned', (assert) => {
        request(app)
            .get('/annunci/')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((error, response) => {
                const expectedAnnouncement = JSON.parse(`[{"_id":"61ae374fe252cc9bb15e765f","titolo":"Appartamento 1","ubicazione":"Povo","prezzo":400,"numBagni":5,"isolamento":"D","riscaldamento":"3","wifi":true,"servizi":[],"classeEnergetica":"A","foto":[],"dataModifica":"2020-01-15","proprietario":{"_id":"61ae3697e252cc9bb15e765c","name":"asd","email":"monty@gmail.com","password":"belloalgoritmi","eta":30,"hobby":["calcio","ballo"],"facolta":"Informatica","genere":"M","descrizione":"Bello algoritmi","recensioni":[],"role":"admin","preferiti":[""]},"numCamere":1},{"_id":"61af9acaf02b4b284504f14b","titolo":"Appartamento test","ubicazione":"Povo","prezzo":400,"numBagni":5,"isolamento":"D","riscaldamento":"3","wifi":true,"servizi":[],"classeEnergetica":"A","foto":[],"proprietario":{"_id":"61af97d23685caaaa69438ac","name":"test","email":"test@test.test","password":"test123","eta":"18","hobby":"bere, mangiare","facolta":"Università di Trento","genere":"M","descrizione":"Ciao come va","recensioni":[],"role":"user"},"numCamere":2}]`)

                assert.error(error, 'No error')
                assert.same(response.body, expectedAnnouncement, 'Announcements as expected')
                assert.end()
            })
    })

    /**
     * Test for specific announcement!
     */
    test('Correct specific announcement returned', (assert) => {
        request(app)
            .get('/annunci/61ae374fe252cc9bb15e765f')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((error, response) => {
                const expectedAnnouncement = JSON.parse(`{"_id":"61ae374fe252cc9bb15e765f","titolo":"Appartamento 1","ubicazione":"Povo","prezzo":400,"numBagni":5,"isolamento":"D","riscaldamento":"3","wifi":true,"servizi":[],"classeEnergetica":"A","foto":[],"dataModifica":"2020-01-15","proprietario":{"_id":"61ae3697e252cc9bb15e765c","name":"asd","email":"monty@gmail.com","password":"belloalgoritmi","eta":30,"hobby":["calcio","ballo"],"facolta":"Informatica","genere":"M","descrizione":"Bello algoritmi","recensioni":[],"role":"admin","preferiti":[""]},"numCamere":1}`)

                assert.error(error, 'No error')
                assert.same(response.body, expectedAnnouncement, 'Specific announcement as expected')
                assert.end()
            })
    })

    /**
     * Update an announcement!
     */
    test('Update announcement', (assert) => {
        request(app)
            .put('/annunci/')
            .send({
                "_id": "61b1d0eec011423a3eb7d811",
                "titolo": "Appartamento 777",
                "numCamere": 5,
                "ubicazione": "Povo",
                "prezzo": 400,
                "numBagni": 5,
                "isolamento": "D",
                "riscaldamento": "3",
                "wifi": true,
                "servizi": [],
                "classeEnergetica": "A",
                "foto": [],
                "dataModifica": "2020-01-15",   
                "proprietario": {
                    "_id": "61ae3697e252cc9bb15e765c",
                    "name": "asd",
                    "email": "monty@gmail.com",
                    "password": "belloalgoritmi",
                    "eta": 30,
                    "hobby": [
                        "calcio",
                        "ballo"
                    ],
                    "facolta": "Informatica",
                    "genere": "M",
                    "descrizione": "Bello algoritmi",
                    "recensioni": [],
                    "role": "admin",
                    "preferiti": [
                        ""
                    ]
                }
            })
            .set('Cookie', 'user=j%3A%7B%22_id%22%3A%2261af97d23685caaaa69438ac%22%2C%22name%22%3A%22test%22%2C%22email%22%3A%22test%40test.test%22%2C%22password%22%3A%22test123%22%2C%22eta%22%3A%2218%22%2C%22hobby%22%3A%22bere%2C%20mangiare%22%2C%22facolta%22%3A%22Universit%C3%A0%20di%20Trento%22%2C%22genere%22%3A%22M%22%2C%22descrizione%22%3A%22Ciao%20come%20va%22%2C%22recensioni%22%3A%5B%5D%2C%22role%22%3A%22user%22%2C%22preferiti%22%3A%5B%22%22%5D%7D')
            .expect(200)
            .end((error, response) => {
                assert.error(error, 'No error')
                assert.isEqual('Updated', response.text, 'Updated successfully')
                assert.end()
            })
    })

    /**
     * Delete an announcement
     */
    test('Delete announcement', (assert) => {
        request(app)
            .delete('/annunci/61b77031c8c0a473ce346fb9')
            .expect(302)
            .end((error, response) => {
                assert.error(error, 'No error')
                assert.end()
            })
    })

    /**
     * Test for user list
     */
    test('Correct announcement given the owner', (assert) => {
        request(app)
            .get('/users/61af97d23685caaaa69438ac/annuncio')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((error, response) => {
                const expectedAnnouncement = JSON.parse(`{"_id":"61af9acaf02b4b284504f14b","titolo":"Appartamento test","ubicazione":"Povo","prezzo":400,"numBagni":5,"isolamento":"D","riscaldamento":"3","wifi":true,"servizi":[],"classeEnergetica":"A","foto":[],"proprietario":{"_id":"61af97d23685caaaa69438ac","name":"test","email":"test@test.test","password":"test123","eta":"18","hobby":"bere, mangiare","facolta":"Università di Trento","genere":"M","descrizione":"Ciao come va","recensioni":[],"role":"user"},"numCamere":2}`)

                assert.error(error, 'No error')
                assert.same(response.body, expectedAnnouncement, 'Announcement from owner as expected')
                assert.end()
                process.kill(process.pid, 'SIGTERM')
            })
    })
})