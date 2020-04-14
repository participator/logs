// npm Packages
const http = require('http');
const process = require('process');

// Custom Packages
const mime = require('../utils/mime'),
reads = require('./reads'),
creates = require('./creates'),
deletes = require('./deletes'),
updates = require('./updates');

// Constants
const port = process.env.port || 8081;

// Control what origin can access resource
// res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
// res.setHeader('Vary', 'Origin');

/**
 * Create DB Server
 */
const server = http.createServer((req, res) => {
    console.log('[requested url]', req.url);

    if (req.method === 'GET') {
        // Set Response Headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Method', 'GET');

        if (reads.isRouteMatch(req.url)) {
            reads.callDB('Logs', req.url)
            .then(dbResponse => {
                // console.log('[read dbResponse]', dbResponse.length);
                res.setHeader('Content-Type', mime.mimeTypes.json);
                res.write(JSON.stringify(dbResponse));
                res.end();
            })
            .catch(err => {
                if (err.message === 'Not Found') {
                    console.error('[read Not Found]', err);
                    respondWithNotFound(res);
                }
                else {
                    console.error('[read db failure]', err);
                    res.writeHead(500, 'The server has encountered a situation it doesn\'t know how to handle.');
                    res.end();
                }
            });
        }
        else {
            respondWithNotFound(res);
        }
    }
    else if (['POST', 'DELETE', 'PUT'].includes(req.method)) {
        // Set Response Headers
        res.setHeader('Access-Control-Allow-Origin', '*');

        if (creates.isRouteMatch(req.url)) {
            readRequestPromise(req)
            .then(data => creates.callDB('Logs', req.url, data))
            .then(dbResponse => {
                // console.log('[create dbResponse]', dbResponse.length);
                res.setHeader('Content-Type', mime.mimeTypes.json);
                res.write(JSON.stringify(dbResponse));
                res.end();
            })
            .catch(err => {
                if (err.message === 'Not Found') {
                    console.error('[create Not Found]', err);
                    respondWithNotFound(res);
                }
                else {
                    console.error('[create db failure]', err);
                    res.writeHead(500, 'The server has encountered a situation it doesn\'t know how to handle.');
                    res.end();
                }
            });
        }
        else if (deletes.isRouteMatch(req.url)) {
            readRequestPromise(req).then(data => deletes.callDB('Logs', req.url, data))
            .then(dbResponse => {
                console.log('[delete dbResponse]', dbResponse);
                res.setHeader('Content-Type', mime.mimeTypes.json);
                res.write(JSON.stringify(dbResponse));
                res.end();
            })
            .catch(err => {
                if (err.message === 'Not Found') {
                    console.error('[delete Not Found]', err);
                    respondWithNotFound(res);
                }
                else {
                    console.error('[delete db failure]', err);
                    res.writeHead(500, 'The server has encountered a situation it doesn\'t know how to handle.');
                    res.end();
                }
            });
        }
        else if (updates.isRouteMatch(req.url)) {
            readRequestPromise(req).then(data => updates.callDB('Logs', req.url, data))
            .then(dbResponse => {
                console.log('[delete dbResponse]', dbResponse);
                res.setHeader('Content-Type', mime.mimeTypes.json);
                res.write(JSON.stringify(dbResponse));
                res.end();
            })
            .catch(err => {
                if (err.message === 'Not Found') {
                    console.error('[delete Not Found]', err);
                    respondWithNotFound(res);
                }
                else {
                    console.error('[delete db failure]', err);
                    res.writeHead(500, 'The server has encountered a situation it doesn\'t know how to handle.');
                    res.end();
                }
            });
        }
        else {
            respondWithNotFound(res);
        }
    }
    else if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, DELETE, PUT');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type');
        res.setHeader('Access-Control-Max-Age', 0);
        res.end();
    }
    else {
        respondWith(res, mime.mimeTypes.html, 405, 'Method Not Allowed');
    }
});

server.listen(port);

// Helper Functions

/**
 * Parse data from Request object
 * @param {Request} req - request object
 */
const readRequestPromise = req => {
    return new Promise((resolve, reject) => {
        if (!req) reject();

        req.setEncoding('utf8');
        req.on('data', data => {
            resolve(data);
        })
    });
};

const respondWithNotFound = (res) => {
    respondWith(res, mime.mimeTypes.html, 404, 'Not Found');
};

const respondWith = (res, mimeType, errorCode, errorMessage) => {
    res.setHeader('Content-type', mimeType);
    res.writeHead(errorCode, errorMessage);
    res.end();
};