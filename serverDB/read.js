// npm Packages
const objectId = require('mongodb').ObjectID;

// Custom Packages
const dbRead = require('./dbRead'),
routes = require('./routes').routes,
matchIdsRegExpString = require('./routes').matchIdsRegExpString,
mime = require('../utils/mime');

/**
 * Call database 
 * @param {Request} req 
 * @param {Response} res 
 */
const callDB = (req, res) => {
    if (routes.read.all.test(req.url)) {
        return dbRead.all().then(results => {
            res.write(JSON.stringify(results));
            console.log('[responseHeaders]', res.getHeaders());
            res.end();
        });
    }
    else if (routes.read.userAll.test(req.url)) {
        const ids = req.url.match(matchIdsRegExpString);
        return dbRead.userAll(new objectId(ids[0])).then(results => {
            res.setHeader('Content-Type', mime.mimeTypes.json);
            res.write(JSON.stringify(results));
            res.end();
        });
    }
    else if (routes.read.specific.test(req.url)) {
        const ids = req.url.match(matchIdsRegExpString);
        return dbRead.specific({'_id': new objectId(ids[0])}).then(results => {
            res.setHeader('Content-Type', mime.mimeTypes.json);
            res.write(JSON.stringify(results));
            res.end();
        });
    }
    else if (routes.read.userSpecific.test(req.url)) {
        const ids = req.url.match(matchIdsRegExpString);
        console.log('[userSpecific] ids', JSON.stringify(ids));
        return dbRead.userSpecific({'_id': new objectId(ids[1])}, new objectId(ids[0])).then(results => {
            res.setHeader('Content-Type', mime.mimeTypes.json);
            res.write(JSON.stringify(results));
            res.end();
        });
    }
};

module.exports = {
    callDB,
    /**
     * Checks if route matches any read urls
     * @param {string} url 
     */
    isRouteMatch(url) {
        return routes.read.all.test(url)
        || routes.read.userAll.test(url)
        || routes.read.specific.test(url)
        || routes.read.userSpecific.test(url);
    }
};