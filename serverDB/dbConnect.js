const MongoClient = require('mongodb').MongoClient,
assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017/logs';

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
const dbConnect = (operationCallback, collectionName, data) => {
    return MongoClient.connect(url, { useNewUrlParser: true }).then((client) => {
        // assert.equal(null, err);
        console.log('Connected successfully to db server');
    
        const db = client.db(dbName);
        
        return operationCallback(db, collectionName, data).then(data => {
            client.close();
            return data;
        });
    }, err => {
        throw err;
    }).catch(err => {
        throw err;
    });
};

module.exports = dbConnect;