// npm Packages
const objectId = require('mongodb').ObjectID,
assert = require('assert'),
dbConnect = require('./dbConnect');

/**
 * 
 * @param {Object} db 
 * @param {Object} document - remove where field is equal to value e.g. { _userId: 12345 }
 * @param {Function} callback - function to pass result data to
 * @returns {undefined}
 */
const deleteDocument = (db, collectionName, document) => {
    
    if (!document) throw new Error('[dbDelete] Nothing provided to delete');

    // Get the doucments collection
    const collection = db.collection(collectionName);

    // Delete document
    return collection.deleteOne(document);
};

/**
 * Remove a single document
 * @param {Object} document - criteria of document to remove
 * @returns {undefined}
 */
const deletes = (collectionName, _userId, _id, document) => {
    const doc = {_userId: new objectId(_userId), _id: new objectId(_id), ...document};
    
    return dbConnect(collectionName, deleteDocument, doc).catch(err => {
        throw err;
    });
};

module.exports = {
    deletes
};