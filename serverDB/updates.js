// Custom Packages
const dbUpdates = require('./dbUpdates'),
routesUpdates = require('./routes').routes.updates,
matchIdsRegExpString = require('./routes').matchIdsRegExpString;

/**
 * Call database
 * @param {string} collectionName - name of collection to operate on 
 * @param {string} url - request url from client
 * @param {Object} reqData - data to create in db
 * @returns {Promise} data - data for response or error
 */
const callDB = (collectionName, url, reqData) => {
    /**
     * /update/log
     */
    if (routesUpdates.log.test(url)) {
        console.log('[requestCreatesData]', reqData.toString());
        let {userId, data} = JSON.parse(reqData);

        return dbUpdates.update(collectionName, data, userId).then(commandResult => {
            const {matchedCount, modifiedCount} = commandResult;

            return matchedCount === modifiedCount;
        })
    }

    /**
     * /update/error
     */
    else if (routesUpdates.error.test(url)) {
        const ids = url.match(matchIdsRegExpString);
        const reqObj = JSON.parse(req);
        console.log('[reqObj]', reqObj);
        return dbUpdates.userInsert(collectionName, reqData, ids[0])
        .then(results => results)
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
        return routesUpdates.log.test(url)
        || routesUpdates.error.test(url);
    }
};