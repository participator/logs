const assert = require('assert'),
dbConnect = require('./dbConnect');

/**
 * Find all documents
 * @param {*} db 
 * @param {Object} document Object containing field:values to search
 * @returns {Promise}
 */
const findDocuments = (db, document) => {
    // Get the documents collection
    const collection = db.collection('Logs');
    
    return collection.find(document).toArray();
};

/**
 * Find all documents in a collection
 * @returns {Documents}
 */
const findAll = () => {
    return dbConnect(findDocuments);
};

/**
 * Find all documents in a collection for a user
 * @param {*} _userId 
 */
const userFindAll = (_userId) => {
    const user = {_userId: _userId};
    console.log('[userFindAll] _id:', user);
    return dbConnect(findDocuments, user);
};

/**
 * Find specific document
 * @param {Object} document - find where field is equal to value e.g. { _userId: 12345 }
 * @returns {undefined}
 */
const findSpecific = (document) => {
    return dbConnect(findDocuments, document);
}

/**
 * Find specific document for a user
 * @param {Object} document - find where field is equal to value e.g. { _userId: 12345 }
 * @param {Object} _userId - find where _userId equals passed in _userId
 * @returns {undefined}
 */
const userFindSpecific = (document, _userId) => {
    const doc = {...document, _userId: _userId};
    return dbConnect(findDocuments, doc);
}

module.exports = {
    all: findAll,
    specific: findSpecific,
    userAll: userFindAll,
    userSpecific:userFindSpecific
};