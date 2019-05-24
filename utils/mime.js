const mimeTypes = {
    json: 'application/json',
    html: 'text/html',
    js: 'text/javascript',
    css: 'text/css',
    svg: 'image/svg+xml'
};

const setHeaderMimeType = fileExt => {
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
        case '.svg':
            mimeType = mimeTypes.svg;
            break;
    }
    
    return mimeType;
};

module.exports = {
    mimeTypes,
    setHeaderMimeType
};