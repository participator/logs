// npm Packages
const http = require('http'),
fs = require('fs'),
url = require('url'),
path = require('path'),
process = require('process');

// Custom Packages
const mimeTypes = require('../utils/mime');

// Constants
const port = process.env.port || 8080;
const matchPublicFolder = new RegExp('^/public/[.]*')

/**
 * Create Web Server
 */
const server = http.createServer((req, res) => {

    let file;
    console.log('[requested url]', req.url);
    console.log('[file exist]', fs.existsSync('..'  + req.url));

    // Return from file system in public folder
    if(fs.existsSync('..' + req.url) && matchPublicFolder.test(req.url) || req.url === '/') {
        const responsePathname = url.parse(req.url).pathname;
        // console.log('[responseUrl]', responsePathname);
        const responseExt = path.extname(responsePathname);
        // console.log('[responseExt]', responseExt);

        const mimeType = mimeTypes.setHeaderMimeType(responseExt);
        if (mimeType) {
            console.log('[set Content-Type]', mimeType);
            res.setHeader('Content-Type', mimeType);
        }
        if (req.url === '/') {
            file = fs.createReadStream(requestType.main);
        }
        else {
            file = fs.createReadStream('..' + req.url);
        }
        file.pipe(res);
    }
    // Return Not found
    else {
        res.writeHead('404', 'File not found');
        res.end();
    }
});

const requestType = {
    main: '../public/index.html'
};

server.listen(port);