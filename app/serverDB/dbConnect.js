const MongoClient = require('mongodb').MongoClient,
assert = require('assert');

// Localhost Connection URL
const url_localhost = 'mongodb://localhost:27017/logs';

// Atlas Connection Url
const url_atlas = 'mongodb+srv://app:logsDBaccess@logs-bjvtl.gcp.mongodb.net/test?retryWrites=true';

const url_current = url_localhost;

// Database Name
const dbName = 'Log';

/**
 * Create Log Database
 */

// Use connect method to connect to the db server
/**
 * dbConnect
 * @param { Object } operationCallback - CRUD operation callback
 * @returns { Promise }
 */
const dbConnect = (collectionName, operationCallback, data) => {
    return MongoClient.connect(url_current, { useNewUrlParser: true }).then((client) => {
        // assert.equal(null, err);
        console.log('Connected successfully to db server with url', url_current);
    
        const db = client.db(dbName);
        
        return operationCallback(db, collectionName, data).then(commandResult => {
            client.close();
            return commandResult;
        });
    }, err => {
        throw err;
    })
};

module.exports = dbConnect;