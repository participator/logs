const http = require('http'),
fs = require('fs'),
url = require('url');

const port = 80;
// const port = 9229;

const server = http.createServer((req, res) => {

    let file;
    console.log('[requested url]', req.url);
    console.log('[file exist]', fs.existsSync('.' + req.url));
    if(fs.existsSync('.' + req.url)) {
        if (req.url === '/') file = fs.createReadStream(requestType.main);
        else file = fs.createReadStream('.' + req.url);
        file.pipe(res);
    }
    else {
        res.writeHead('404', 'File not found');
        res.end();
    }
});

const requestType = {
    data: 'log.json',
    main: 'index.html',
    script: 'script.js',
    style: 'style.css'
};

server.listen(port);