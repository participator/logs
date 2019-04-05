// npm Packages
const objectId = require('mongodb').ObjectID,
assert = require('assert');

// Custom Packages
const dbConnect = require('./dbConnect'),
logModel = require('./models/log');

/**
 * Insert many documents
 * @param {*} db 
 * @param {*} callback 
 * @returns { Promise } - object with newly inserted document _id
 */
const insertDocuments = function(db, collectionName, documents) {
    const collection = db.collection(collectionName);
    
    if (!documents) throw new Error('[dbCreate] Nothing provided to create');

    if (documents.length === undefined) {
        return collection.insertOne(documents);
    }
    else if (Array.isArray(documents)) {
        return collection.insertMany(documents);
    }
}

/**
 * Insert documents into given collection with for given user
 * @param {string} collectionName 
 * @param {Object[]} documents 
 */
const insertLogs = (collectionName, documents, _userId) => {
    const logs = documents.map(document => {
        const log = Object.create(logModel);
        log.init(new objectId(_userId), document.title);
        log.description = document.description;
        log.helpfulResources = document.helpfulResources;
        log.status = document.status;
        log.type = document.type;
        return log;
    });

    return dbConnect(collectionName, insertDocuments, logs).catch(err => {
        throw err;
    });
};

module.exports = {
    insertLogs
};