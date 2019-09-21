// npm Packages
const http = require('http'),
fs = require('fs'),
url = require('url'),
path = require('path'),
process = require('process'),
dotenv = require('dotenv');

dotenv.config();

// Custom Packages
const mimeTypes = require('../utils/mime');

// Constants
const port = process.env.port || 8080;
const matchPublicFolder = new RegExp('^/public/[.]*')

/**
 * Create Web Server
 */
const server = http.createServer((req, res) => {

    const requestedFile = getFileInCurrentDirectoryFullPath(req.url);
    console.log('[requested url]', req.url);
    console.log('[file exist]', fs.existsSync(requestedFile));
    console.log('[dirname]', __dirname);
    console.log('[filename]', __filename);
    
    // Return from file system in public folder
    if(fs.existsSync(requestedFile) && matchPublicFolder.test(req.url) || req.url === '/') {
        const responsePathname = url.parse(req.url).pathname;
        // console.log('[responseUrl]', responsePathname);
        const responseExt = path.extname(responsePathname);
        // console.log('[responseExt]', responseExt);
        
        let file;
        const mimeType = mimeTypes.setHeaderMimeType(responseExt);
        if (mimeType) {
            console.log('[set Content-Type]', mimeType);
            res.setHeader('Content-Type', mimeType);
        }
        if (req.url === '/' || req.url === requestType.main) {
            file = fs.createReadStream(getFileInCurrentDirectoryFullPath(requestType.main));
        }
        else if (req.url === '/public/index.html') {
            file = fs.createReadStream(getFileInCurrentDirectoryFullPath(requestType.app));
        }
        else {
            file = fs.createReadStream(requestedFile);
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
    main: '/public/login.html',
    app: '/public/index.html'
};

const getFileInCurrentDirectoryFullPath = relativePath => path.join(__dirname, relativePath);

server.listen(port);