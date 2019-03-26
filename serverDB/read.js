// npm Packages
const objectId = require('mongodb').ObjectID;

// Custom Packages
const dbRead = require('./dbRead'),
routesRead = require('./routes').routes.read,
matchIdsRegExpString = require('./routes').matchIdsRegExpString,
mime = require('../utils/mime');

/**
 * Call database
 * @param {string} collectionName - name of collection to operate on 
 * @param {string} url - request url from client
 * @returns {Promise} data - data for response or error
 */
const callDB = (collectionName, url) => {
    /**
     * /read/all
     */
    if (routesRead.all.test(url)) {
        console.log('[read all]', url);
        return dbRead.all(collectionName)
        .catch(err => {
            throw err;
        });
    }
    /**
     * /read/{_userId}
     * /read/xxxxxxxxxxxxxxxxxxxxxxxx
     */
    else if (routesRead.userAll.test(url)) {
        const ids = url.match(matchIdsRegExpString);
        return dbRead.userAll(collectionName, new objectId(ids[0]))
        .catch(err => {
            throw err;
        });
    }    
    /**
     * /read/log/{_logId}
     * /read/log/xxxxxxxxxxxxxxxxxxxxxxxx
     */
    else if (routesRead.specific.test(req.url)) {
        const ids = req.url.match(matchIdsRegExpString);
        return dbRead.specific(collectionName, {'_id': new objectId(ids[0])})
        .catch(err => {
            throw err;
        });
    }    
    /**
     * /read/{_userId}/log/{_logId}
     * /read/xxxxxxxxxxxxxxxxxxxxxxxx/log/xxxxxxxxxxxxxxxxxxxxxxxx
     */
    else if (routesRead.userSpecific.test(req.url)) {
        const ids = req.url.match(matchIdsRegExpString);
        console.log('[userSpecific] ids', JSON.stringify(ids));
        return dbRead.userSpecific(collectionName, {'_id': new objectId(ids[1])}, new objectId(ids[0]))
        .catch(err => {
            return err;
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
        return routesRead.all.test(url)
        || routesRead.userAll.test(url)
        || routesRead.specific.test(url)
        || routesRead.userSpecific.test(url);
    }
};