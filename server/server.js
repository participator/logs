const http = require('http');
const fs = require('fs');

const port = 80;
const filePath = 'log.json';

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const file = fs.createReadStream(filePath);
    file.pipe(res);    
});

server.listen(port);