// npm Packages
const ObjectId = require('mongodb').ObjectID,
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
 * Insert document into given collection with for given user
 * @param {string} collectionName 
 * @param {Object} document
 */
const insertLog = (collectionName, document, userId) => {
    const log = Object.create(logModel);
    log.init(new ObjectId(userId), document.title);
    log.description = document.description;
    document.helpfulResources ? log.helpfulResources = document.helpfulResources : delete log.helpfulResources;
    log.helpfulResources.forEach(resource => resource.url = new URL(resource.url).href);
    log.status = document.status;
    log.type = document.type;

    return dbConnect(collectionName, insertDocuments, log).then(log => {
        log.ops[0].createdDate = ObjectId(log.insertedId.id).getTimestamp();
        return log;
    }).catch(err => {
        throw err;
    });
};

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
        document.helpfulResources ? log.helpfulResources = document.helpfulResources : delete log.helpfulResources;
        log.helpfulResources.forEach(resource => resource.url = new URL(resource.url).href);
        log.status = document.status;
        log.type = document.type;
        return log;
    });

    return dbConnect(collectionName, insertDocuments, logs).catch(err => {
        throw err;
    });
};

module.exports = {
    insertLog
};