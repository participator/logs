// npm Packages
const objectId = require('mongodb').ObjectID;

// Custom Packages
const dbReads = require('./dbReads'),
routesReads = require('./routes').routes.reads,
matchIdsRegExpString = require('./routes').matchIdsRegExpString;

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
    if (routesReads.logs.test(url)) {
        console.log('[read all] from ' + collectionName, url);
        return dbReads.all(collectionName)
        .catch(err => {
            throw err;
        });
    }
    /**
     * /read/{_userId}
     * /read/xxxxxxxxxxxxxxxxxxxxxxxx
     */
    else if (routesReads.userLogs.test(url)) {
        const ids = url.match(matchIdsRegExpString);
        return dbReads.userAll(collectionName, new objectId(ids[0]))
        .catch(err => {
            throw err;
        });
    }    
    /**
     * /read/log/{_logId}
     * /read/log/xxxxxxxxxxxxxxxxxxxxxxxx
     */
    else if (routesReads.specific.test(url)) {
        const ids = url.match(matchIdsRegExpString);
        return dbReads.specific(collectionName, {'_id': new objectId(ids[0])})
        .catch(err => {
            throw err;
        });
    }    
    /**
     * /read/{_userId}/log/{_logId}
     * /read/xxxxxxxxxxxxxxxxxxxxxxxx/log/xxxxxxxxxxxxxxxxxxxxxxxx
     */
    else if (routesReads.userLog.test(url)) {
        const ids = url.match(matchIdsRegExpString);
        console.log('[userSpecific] ids', JSON.stringify(ids));
        return dbReads.userSpecific(collectionName, {'_id': new objectId(ids[1])}, new objectId(ids[0]))
        .catch(err => {
            return err;
        });
    }
    /**
     * /read/task
     */
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
        return routesReads.logs.test(url)
        || routesReads.userLogs.test(url)
        || routesReads.specific.test(url)
        || routesReads.userLog.test(url);
    }
};