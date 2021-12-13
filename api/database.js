const {
    MongoClient
} = require("mongodb");

const connectionString = process.env.ATLAS_URI;
const client = new MongoClient(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let dbConnection;

module.exports = {
    connectToServer: async function (callback) {
        if (!dbConnection) {
            const db = await client.connect();
            dbConnection = db.db("APPartamenti");
        }
        //  .connect(async function (err, db) {
        //     if (err || !db) {
        //         return callback(err);
        //     }


        //     console.log("Successfully connected to MongoDB.");

        //     return callback();
        // });
        return callback();
    },

    getDb: function () {
        return dbConnection;
    },
};