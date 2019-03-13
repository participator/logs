const objectId = require('mongodb').ObjectID;

const dbRead = require('./dbRead');

/**
 * Regex string to match db object ids
 */
const matchIdsString = '([0-9a-z]{24})';

/**
 * Regex object to match ids in url
 */
const matchIds = new RegExp(matchIdsString);

/**
 * Regex objects to match urls
 */
const matchReadAll = new RegExp('^/read/all$');
const matchReadSpecific = new RegExp(`^/read/log/${matchIdsString}$`);
const matchReadUserAll = new RegExp(`^/read/${matchIdsString}$`);
const matchReadUserSpecific = new RegExp(`^/read/${matchIdsString}/log/${matchIdsString}`);

/**
 * Call database 
 * @param {Request} req 
 * @param {Response} res 
 */
const callDB = (req, res) => {
    if (matchReadAll.test(req.url)) {
        return dbRead.all().then(results => {
            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify(results));
            res.end();
        });
    }
    else if (matchReadUserAll.test(req.url)) {
        const ids = matchIds.exec(req.url);
        return dbRead.userAll(new objectId(ids[0])).then(results => {
            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify(results));
            res.end();
        });
    }
    else if (matchReadSpecific.test(req.url)) {
        const ids = matchIds.exec(req.url);
        return dbRead.specific({'_id': new objectId(ids[0])}).then(results => {
            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify(results));
            res.end();
        });
    }
    else if (matchReadUserSpecific.test(req.url)) {
        const ids = matchIds.exec(req.url);
        return dbRead.userSpecific({'_id': new objectId(ids[1]), '_userId': new objectId(ids[0])});
    }
};

module.exports = {
    callDB,
    /**
     * Checks if route matches any read urls
     * @param {string} url 
     */
    isRouteMatch(url) {
        return matchReadAll.test(url)
        || matchReadUserAll.test(url)
        || matchReadSpecific.test(url)
        || matchReadUserSpecific.test(url);
    }
};