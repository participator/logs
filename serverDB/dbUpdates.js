// npm Packages
const objectId = require('mongodb').ObjectID,
assert = require('assert');

// Custom Packages
const dbConnect = require('./dbConnect');

/**
 * Update a document
 * @param {*} db 
 * @param {string} collectionName - name of the collection to update a document in
 * @param {Object} document - object with new data to add
 * @returns {<Promise>}
 */
const updateDocument = (db, collectionName, document) => {
    
    /**
     * updateOne
     * @param {Object} filter 
     * @param {Object} update
     * @param {Object} options
     */
    const {_userId, _id} = document,
    filter = {_userId, _id},
    update = {
        $set: document,
        $currentDate: {
            modifiedDate: { $type: 'date' }
        }
    },
    // upsert: true - creates a new document when no match is found
    // upsert: false - do not insert a new document when a match is not found
    options = { upsert: false };
    
    // Get the documents collection
    const collection = db.collection(collectionName);
    
    return collection.updateOne(filter, update, options);
}

/**
 * Update a document and returns it
 * @param {*} db 
 * @param {string} collectionName - name of the collection to update a document in
 * @param {Object} document - object with new data to add
 * @returns {<Promise>} document - new log document
 */
const findOneAndUpdateDocument = (db, collectionName, document) => {

    /**
     * updateOne
     * @param {Object} filter 
     * @param {Object} update
     * @param {Object} options
     */
    const {_userId, _id} = document,
    filter = {_userId, _id},
    update = {
        $set: document,
        $currentDate: {
            modifiedDate: { $type: 'date' }
        }
    },
    options = {
        returnOriginal: false
    };
    
    // Get the documents collection
    const collection = db.collection(collectionName);

    return collection.findOneAndUpdate(filter, update, options);
}

/**
 * 
 * @param {*} document - criteria of document to update
 * @returns {<Promise>}
 */
const update = (collectionName, document, userId) => {
    document._userId = new objectId(userId.trim());
    document._id = new objectId(document.id.trim());
    delete document.id;
    return dbConnect(collectionName, findOneAndUpdateDocument, document);
}

module.exports = {
    update
};