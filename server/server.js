const http = require('http'),
fs = require('fs'),
url = require('url'),
path = require('path');

const serverDB = require('./serverDbRead');

const port = 80;
// const port = 9229;

const server = http.createServer((req, res) => {

    let file;
    console.log('[requested url]', req.url);
    console.log('[file exist]', fs.existsSync('.' + req.url));

    // Return from file system
    if(fs.existsSync('.' + req.url)) {
        const responsePathname = url.parse(req.url).pathname;
        // console.log('[responseUrl]', responsePathname);
        const responseExt = path.extname(responsePathname);
        // console.log('[responseExt]', responseExt);

        const mimeType = setResponseHeaderMimeType(responseExt);
        if (mimeType) {
            console.log('[set Content-Type]', mimeType);
            res.setHeader('Content-Type', mimeType);
        }
        
        if (req.url === '/') {
            file = fs.createReadStream(requestType.main);
        }
        else {
            file = fs.createReadStream('.' + req.url);
        }
        file.pipe(res);
    }
    // Return from database
    else if (serverDB.isRouteMatch(req.url)) {
        serverDB.callDB(req, res).catch(err => {
            console.error('[db failure]', err.message);
        });
    }
    // Return Not found
    else {
        res.writeHead('404', 'File not found');
        res.end();
    }
});

const mimeTypes = {
    json: 'application/json',
    html: 'text/html',
    js: 'text/javascript',
    css: 'text/css',
};

const requestType = {
    main: 'index.html'
};

const setResponseHeaderMimeType = fileExt => {
    let mimeType;

    switch (fileExt) {
        case '.json':
            mimeType = mimeTypes.json;
            break;
        case '.html':
            mimeType = mimeTypes.html;
            break;
        case '.js':
            mimeType = mimeTypes.js;
            break;
        case '.css':
            mimeType = mimeTypes.css;
            break;
    }
    
    return mimeType;
};

server.listen(port);