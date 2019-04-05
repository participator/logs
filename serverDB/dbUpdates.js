const assert = require('assert'),
dbConnect = require('./dbConnect');

// Use connect method to connect to the db server
dbConnect.connect(updateDocument);

/**
 * Update a document
 * @param {*} db 
 * @param {*} document - update where field is equal to value e.g. { _userId: 12345 }
 * @param {Function} callback 
 * @returns {undefined}
 */
const updateDocument = (db, document, callback) => {

    // Get the documents collection
    const collection = db.collection('documents');

    // Update document where a is 2, set b equal to 1
    collection.updateOne({ a: 2}, { $set: { b: 1 } }, (err, result) => {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log('Updated the document with the field a equal to 2');
        callback(result);
    });
};

/**
 * 
 * @param {*} document - criteria of document to update
 * @returns {undefined}
 */
const update = (document) => {
    dbConnect(updateDocument, document);
}

module.exports = {
    update
};