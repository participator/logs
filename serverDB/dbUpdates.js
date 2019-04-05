// npm Packages
const objectId = require('mongodb').ObjectID,
assert = require('assert');

// Custom Packages
const dbConnect = require('./dbConnect');

/**
 * Update a document
 * @param {*} db 
 * @param {*} document - update where field is equal to value e.g. { _userId: 12345 }
 * @param {Function} callback 
 * @returns {undefined}
 */
const updateDocument = (db, collectionName, document) => {
    
    /**
     * updateOne
     * @param {Object} filter 
     * @param {Object} update
     * @param {Object} options
     */
    const {userId, id} = document,
    filter = {_userId: new objectId(userId), _id: new object(id)},
    update = {
        $setOnInsert: document,
        $currentDate: {
            lastModified: true,
            modifiedDate: { $type: "timestamp" }
        }
    }
    options = { upsert: false };
    
    // Get the documents collection
    const collection = db.collection(collectionName);
    
    return collection.updateOne(filter, update, options);
};

/**
 * 
 * @param {*} document - criteria of document to update
 * @returns {undefined}
 */
const update = (collectionName, document, userId) => {
    document.userId = userId;
    dbConnect(collectionName, updateDocument, document);
}

module.exports = {
    update
};