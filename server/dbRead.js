const assert = require('assert'),
dbConnect = require('./dbConnect');

/**
 * Find all documents
 * @param {*} db 
 * @param {*} callback 
 * @returns {Promise}
 */
const findDocuments = (db, document, callback) => {
    // Get the documents collection
    const collection = db.collection('Logs');

    // Find specific documents
    // collection.find({'a': 3}).toArray((err, docs) => {

    // Find some documents    
    // collection.find(document).toArray((err, docs) => {
    //     assert.equal(err, null);
    //     console.log('Found the following documents');
    //     // console.log(docs);
    //     return callback(docs);
    // });
    
    return collection.find(document).toArray();
};

/**
 * Find all documents in a collection
 * @returns {Documents}
 */
const findAll = () => {
    return dbConnect(findDocuments, {});
};


/**
 * Find specific document
 * @param {Object} document - find where field is equal to value e.g. { _userId: 12345 }
 * @returns {undefined}
 */
const findSpecific = (document) => {
    return dbConnect(findDocuments, document);
}

module.exports = {
    all: findAll,
    specific: findSpecific
};