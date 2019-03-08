const mongoClient = require('mongodb').mongoClient,
co = require('co'),
assert = require('assert');

co(function*() {
    // Connection URL
    const url = 'mongodb://localhost:27017/logs';
    // Use connect method to connect to the db server
    const db = yield mongoClient.connect(url);
    // Close the connection
    db.close();
}).catch(function(err) {
    console.log(err.stack);
})