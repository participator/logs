// npm Packages
const objectId = require('mongodb').ObjectID;

// Custom Packages
const dbCreate = require('./dbCreate'),
routesCreate = require('./routes').routes.create,
matchIdsRegExpString = require('./routes').matchIdsRegExpString,
mime = require('../utils/mime');

/**
 * Call database
 * @param {string} collectionName - name of collection to operate on 
 * @param {string} url - request url from client
 * @param {Object} reqData - data to create in db
 * @returns {Promise} data - data for response or error
 */
const callDB = (collectionName, url, reqData) => {
    /**
     * /create
     */
    if (routesCreate.log.test(url)) {
        console.log('[requestCreateData]', reqData.toString());
        let {userId, data} = JSON.parse(reqData);

        return dbCreate.insertLog(collectionName, data, userId).then(commandResult => {
            const insertedDocuments = commandResult.ops.map(document => {
                document._id = document._id.toString();
                return document;
            });

            return insertedDocuments;
        }).catch(err => {
            throw err;
        });
    }

    /**
     * /create/error
     */
    else if (routesCreate.error.test(url)) {
        const ids = url.match(matchIdsRegExpString);
        const reqObj = JSON.parse(req);
        console.log('[reqObj]', reqObj);
        return dbCreate.userInsert(collectionName, reqData, new objectId(ids[0])).then(results => {
            res.setHeader('Content-Type', mime.mimeTypes.json);
            res.write(JSON.stringify(results));
            res.end();
        }).catch(err => {
            throw err;
        });
    }
    /**
     * Invalid path - display to user not found
     */
    else {
        throw new Error('Not Found');
    }
};

module.exports = {
    callDB,
    /**
     * Checks if route matches any read urls
     * @param {string} url 
     */
    isRouteMatch(url) {
        return routesCreate.log.test(url)
        || routesCreate.error.test(url);
    }
};