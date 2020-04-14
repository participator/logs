const assert = require('assert'),
dbConnect = require('./dbConnect'),
ObjectId = require('mongodb').ObjectId;

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
    
    return collection.find(document).sort( { modifiedDate: 1 } ).toArray();
};

/**
 * Find all documents in a collection
 * @param {string} collectionName - name of collection to operate on 
 * @returns {Promise} - Promise of documents
 */
const findAll = (collectionName) => {
    return dbConnect(collectionName, findDocuments).then(data => {
        return data.map(log => {
            // Extract createDate from _id
            log.createdDate = ObjectId(log._id).getTimestamp();
            return log;
        });
    })
    .catch(err => {
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
    return dbConnect(collectionName, findDocuments, user).catch(err => {
        throw err;
    });
};

/**
 * Find specific document
 * @param {string} collectionName - name of collection to operate on 
 * @param {Object} document - find where field is equal to value e.g. { _userId: 12345 }
 * @returns {Promise} - Promise of documents
 */
const findSpecific = (collectionName, document) => {
    return dbConnect(collectionName, findDocuments, document).catch(err => {
        throw err;
    });
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
    return dbConnect(collectionName, findDocuments, doc).catch(err => {
        throw err;
    });
}

module.exports = {
    all: findAll,
    specific: findSpecific,
    userAll: userFindAll,
    userSpecific:userFindSpecific
};