const assert = require('assert'),
dbConnect = require('./dbConnect');

/**
 * 
 * @param {Object} db 
 * @param {Object} document - remove where field is equal to value e.g. { _userId: 12345 }
 * @param {Function} callback - function to pass result data to
 * @returns {undefined}
 */
const removeDocument = (db, document, callback) => {
    // Get the doucments collection
    const collection = db.collection('documents');

    // Delete document where a is 3
    // collection.deleteOne({ a: 3}, (err, result) => {
    collection.deleteOne(document, (err, result) => {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log('Removed the document with the field a equal to 3');
        callback(result);
    })
};

/**
 * Remove a single document
 * @param {Object} document - criteria of document to remove
 * @returns {undefined}
 */
const remove = (document) => {
    dbConnect(removeDocument, document)
};

module.exports = {
    remove
};