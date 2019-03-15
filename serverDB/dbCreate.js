const assert = require('assert'),
dbConnect = require('./dbConnect');

/**
 * Insert many documents
 * @param {*} db 
 * @param {*} callback 
 * @returns { undefined }
 */
const insertDocuments = function(db, documents, callback) {
    // Get the documents collection
    const collection = db.collection('documents');

    // Insert some documents
    // collection.insertMany([
    //     {a: 1}, {a: 2}, {a: 3}
    // ], function(err, result) {
    collection.insertMany(documents, function(err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into the collection");
        callback(result);
    });
}

/**
 * Add many documents
 * @param { Object } documents 
 * @returns { undefined }
 */
const insertMany = (documents) => {
    dbConnect(insertDocuments, documents);
};

module.exports = {
    insertMany
};