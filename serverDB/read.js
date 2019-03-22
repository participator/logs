// npm Packages
const objectId = require('mongodb').ObjectID;

// Custom Packages
const dbRead = require('./dbRead'),
routesRead = require('./routes').routes.read,
matchIdsRegExpString = require('./routes').matchIdsRegExpString,
mime = require('../utils/mime');

/**
 * Call database 
 * @param {Request} req 
 * @param {Response} res 
 */
const callDB = (req, res) => {
    /**
     * /read/all
     */
    if (routesRead.all.test(req.url)) {
        return dbRead.all().then(results => {
            res.write(JSON.stringify(results));
            console.log('[responseHeaders]', res.getHeaders());
            res.end();
        }).catch(err => {
            console.log('[read.all catch]')
            res.writeHead(500, 'The server has encountered a situation it doesn\'t know how to handle.');
            res.end();
        });
    }
    /**
     * /read/{_userId}
     * /read/xxxxxxxxxxxxxxxxxxxxxxxx
     */
    else if (routesRead.userAll.test(req.url)) {
        const ids = req.url.match(matchIdsRegExpString);
        return dbRead.userAll(new objectId(ids[0])).then(results => {
            res.setHeader('Content-Type', mime.mimeTypes.json);
            res.write(JSON.stringify(results));
            res.end();
        });
    }    
    /**
     * /read/log/{_logId}
     * /read/log/xxxxxxxxxxxxxxxxxxxxxxxx
     */
    else if (routesRead.specific.test(req.url)) {
        const ids = req.url.match(matchIdsRegExpString);
        return dbRead.specific({'_id': new objectId(ids[0])}).then(results => {
            res.setHeader('Content-Type', mime.mimeTypes.json);
            res.write(JSON.stringify(results));
            res.end();
        });
    }    
    /**
     * /read/{_userId}/log/{_logId}
     * /read/xxxxxxxxxxxxxxxxxxxxxxxx/log/xxxxxxxxxxxxxxxxxxxxxxxx
     */
    else if (routesRead.userSpecific.test(req.url)) {
        const ids = req.url.match(matchIdsRegExpString);
        console.log('[userSpecific] ids', JSON.stringify(ids));
        return dbRead.userSpecific({'_id': new objectId(ids[1])}, new objectId(ids[0])).then(results => {
            res.setHeader('Content-Type', mime.mimeTypes.json);
            res.write(JSON.stringify(results));
            res.end();
        });
    }
    /**
     * Invalid path - display to user not found
     */
    else {
        res.setHeader('Content-Type', mime.mimeTypes.html);
        res.writeHead(404, 'Not Found');
        res.end();
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