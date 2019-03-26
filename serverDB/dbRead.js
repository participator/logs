const assert = require('assert'),
dbConnect = require('./dbConnect');

/**
 * Find all documents
 * @param {*} db
 * @param {string} collectionName - name of collection to operate on 
 * @param {Object} document Object containing field:values to search
 * @returns {Promise} - Promise of documents
 */
const findDocuments = (db, collectionName, document) => {
    // Get the documents collection
    const collection = db.collection(collectionName);

    // console.log('[Logs]', collection);
    
    return collection.find(document).toArray();
};

/**
 * Find all documents in a collection
 * @param {string} collectionName - name of collection to operate on 
 * @returns {Promise} - Promise of documents
 */
const findAll = (collectionName) => {
    return dbConnect(findDocuments, collectionName).catch(err => {
        throw err;
    });
};

/**
 * Find all documents in a collection for a user
 * @param {string} collectionName - name of collection to operate on 
 * @param {*} _userId
 * @returns {Promise} - Promise of documents
 */
const userFindAll = (collectionName, _userId) => {
    const user = {_userId: _userId};
    console.log('[userFindAll] _id:', user);
    return dbConnect(findDocuments, collectionName, user);
};

/**
 * Find specific document
 * @param {string} collectionName - name of collection to operate on 
 * @param {Object} document - find where field is equal to value e.g. { _userId: 12345 }
 * @returns {Promise} - Promise of documents
 */
const findSpecific = (collectionName, document) => {
    return dbConnect(findDocuments, collectionName, document);
}

/**
 * Find specific document for a user
 * @param {string} collectionName - name of collection to operate on 
 * @param {Object} document - find where field is equal to value e.g. { _userId: 12345 }
 * @param {Object} _userId - find where _userId equals passed in _userId
 * @returns {Promise} - Promise of documents
 */
const userFindSpecific = (collectionName, document, _userId) => {
    const doc = {...document, _userId: _userId};
    return dbConnect(findDocuments, collectionName, doc);
}

module.exports = {
    all: findAll,
    specific: findSpecific,
    userAll: userFindAll,
    userSpecific:userFindSpecific
};