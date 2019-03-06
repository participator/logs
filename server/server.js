const http = require('http'),
fs = require('fs'),
url = require('url');

// const port = 80;
const port = 9229;
const filePath = 'log.json';

const server = http.createServer((req, res) => {
    // Request
    // console.log('[createServer:req]', req.url);
    const reqType = requestHandler(req);

    // Response
    // console.log('[createServer:reqType]', reqType);
    responseHandler(reqType, res);
});

const requestType = {
    data: 'log.json',
    main: 'index.html',
    script: 'script.js',
    style: 'style.css'
};

const requestHandler = (req) => {
    const reqUrl = url.parse(req.url);
    // console.log('[req.url]', req.url);
    console.log('[reqUrl]', reqUrl.pathname);
    
    let respType = '';
    switch (reqUrl.pathname) {
        case '/' + requestType.data:
            respType = requestType.data;
            break;
        case '/' + requestType.script:
            respType = requestType.script;
            break;
        case '/' + requestType.style:
            respType = requestType.style;
            break;
        default:
            respType = requestType.main;
        break;
    }
    
    // console.log('[responseType.main]', requestType.main);
    return respType;
};

const responseHandler = (reqType, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    let file;

    switch (reqType) {
        case requestType.data:
            res.setHeader('Content-Type', 'application/json');
            file = fs.createReadStream(requestType.data);
            file.pipe(res);
            break;
        case requestType.script:
            res.setHeader('Content-Type', 'text/javascript');
            file = fs.createReadStream(requestType.script);
            file.pipe(res);
            break;
        case requestType.style:
            res.setHeader('Content-Type', 'text/css');
            file = fs.createReadStream(requestType.style);
            file.pipe(res);
            break;
        default:
            res.setHeader('Content-Type', 'text/html');
            file = fs.createReadStream(requestType.main);
            file.pipe(res);
            break;
    }
}

// server.on('')

server.listen(port);