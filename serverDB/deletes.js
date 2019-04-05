// npm Packages
const objectId = require('mongodb').ObjectID;

// Custom Packages
const dbDeletes = require('./dbDeletes'),
routesDeletes = require('./routes').routes.deletes,
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
     * /delete/log
     */
    if (routesDeletes.log.test(url)) {
        console.log('[requestDeleteData]', reqData.toString());
        let {userId, id} = JSON.parse(reqData);

        return dbDeletes.deletes(collectionName, userId, id).then(commandResult => {
            const deleted = commandResult.deletedCount > 0;

            return deleted;
        }).catch(err => {
            throw err;
        });
    }

    /**
     * /delete/error
     */
    else if (routesDeletes.error.test(url)) {
        const ids = url.match(matchIdsRegExpString);
        const reqObj = JSON.parse(req);
        console.log('[reqObj]', reqObj);
        return dbDeletes.userInsert(collectionName, reqData, new objectId(ids[0])).then(results => {
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
        return routesDeletes.log.test(url)
        || routesDeletes.error.test(url);
    }
};