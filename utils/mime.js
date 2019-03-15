const mimeTypes = {
    json: 'application/json',
    html: 'text/html',
    js: 'text/javascript',
    css: 'text/css',
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
    }
    
    return mimeType;
};

module.exports = {
    mimeTypes,
    setHeaderMimeType
};