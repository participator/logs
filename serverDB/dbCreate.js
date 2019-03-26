const assert = require('assert'),
dbConnect = require('./dbConnect'),
logModel = require('./models/log');

/**
 * Insert many documents
 * @param {*} db 
 * @param {*} callback 
 * @returns { Promise } - object with newly inserted document _id
 */
const insertDocuments = function(db, collectionName, documents) {
    const collection = db.collection(collectionName);
    
    if (documents === undefined) throw new Error('[dbCreate] Nothing provided to create');

    if (documents.length === undefined) {
        return collection.insertOne(documents);
    }
    else if (Array.isArray(documents)) {
        return collection.insertMany(documents);
    }
}

/**
 * Insert document(s) into given collection with for given user
 * @param {string} collectionName 
 * @param {Object|Object[]} documents 
 */
const insertLog = (collectionName, documents, _userId) => {
    const logs = documents.map(document => {
        const log = Object.create(logModel);
        log.init(_userId, document.title);
        log.description = document.description;
        log.helpfulResources = document.helpfulResources;
        log.status = document.status;
        log.type = document.type;
        return log;
    });

    return dbConnect(insertDocuments, collectionName, logs);
};

module.exports = {
    insertLog
};