// npm Packages
const http = require('http');
const process = require('process');

// Custom Packages
const mime = require('../utils/mime'),
reads = require('./reads'),
creates = require('./creates'),
deletes = require('./deletes');

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
    res.setHeader('Access-Control-Max-Age', '-1');
    if (reads.isRouteMatch(req.url)) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Method', 'GET');
        reads.callDB('Logs', req.url)
        .then(dbResponse => {
            // console.log('[read dbResponse]', dbResponse.length);
            res.setHeader('Content-Type', mime.mimeTypes.json);
            res.write(JSON.stringify(dbResponse));
            res.end();
        })
        .catch(err => {
            if (err.message === 'Not Found') {
                console.error('[read Not Found]', err.message);
                res.setHeader('Content-Type', mime.mimeTypes.html);
                res.writeHead(404, err.message);
                res.end();
            }
            else {
                console.error('[read db failure]', err.message);
                res.writeHead(500, 'The server has encountered a situation it doesn\'t know how to handle.');
                res.end();
            }
        });
    }
    else if (creates.isRouteMatch(req.url)) {
        if (req.method === 'OPTIONS') {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'POST');
        }
        readRequestPromise(req).then(data => {
            return creates.callDB('Logs', req.url, data);
        })
        .then(dbResponse => {
            // console.log('[create dbResponse]', dbResponse.length);
            res.setHeader('Content-Type', mime.mimeTypes.json);
            res.write(JSON.stringify(dbResponse));
            res.end();
        })
        .catch(err => {
            if (err.message === 'Not Found') {
                console.error('[create Not Found]', err.message);
                res.setHeader('Content-Type', mime.mimeTypes.html);
                res.writeHead(404, err.message);
                res.end();
            }
            else {
                console.error('[create db failure]', err.message);
                res.writeHead(500, 'The server has encountered a situation it doesn\'t know how to handle.');
                res.end();
            }
        });
    }
    else if (deletes.isRouteMatch(req.url)) {
        if (req.method === 'OPTIONS') {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'DELETE');
            res.end();
        }
        readRequestPromise(req).then(data => {
            return deletes.callDB('Logs', req.url, data);
        })
        .then(dbResponse => {
            console.log('[delete dbResponse]', dbResponse);
            res.setHeader('Content-Type', mime.mimeTypes.json);
            res.write(JSON.stringify(dbResponse));
            res.end();
        })
        .catch(err => {
            if (err.message === 'Not Found') {
                console.error('[delete Not Found]', err.message);
                res.setHeader('Content-Type', mime.mimeTypes.html);
                res.writeHead(404, err.message);
                res.end();
            }
            else {
                console.error('[delete db failure]', err.message);
                res.writeHead(500, 'The server has encountered a situation it doesn\'t know how to handle.');
                res.end();
            }
        });
    }
    else {
        res.setHeader('Content-type', 'text/html');
        res.writeHead(404, 'Not Found');
        res.end();
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