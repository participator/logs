// npm Packages
const http = require('http');
const process = require('process');

// Custom Packages
const read = require('./read')

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
    if (read.isRouteMatch(req.url)) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        read.callDB(req, res).catch(err => {
            console.error('[db failure]', err.message);
            res.writeHead(500, 'The server has encountered a situation it doesn\'t know how to handle.');
        });
    }
    else {
        res.writeHead(404, 'Not Found');
        res.end();
    }
});

server.listen(port);