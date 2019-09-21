// npm Packages
const http = require('http'),
    fs = require('fs'),
    url = require('url'),
    path = require('path'),
    process = require('process'),
    dotenv = require('dotenv'),
    querystring = require('querystring');

// Third Party Packages
const passport = require('passport'),
    Auth0Strategy = require('passport-auth0');;

// Custom Packages
const mimeTypes = require('../utils/mime');

dotenv.config();

// Set up Passport to User auth0
// Configure Passport to use Auth0
var strategy = new Auth0Strategy(
    {
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL:
        process.env.AUTH0_CALLBACK_URL || 'http://localhost:8000/callback'
    },
    (accessToken, refreshToken, extraParams, profile, done) => {
      // accessToken is the token to call Auth0 API (not needed in the most cases)
      // extraParams.id_token has the JSON Web Token
      // profile has all the information from the user
      return done(null, profile);
    }
  );
  
  passport.use(strategy);
  
  // You can use this section to keep a smaller payload
  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

// Constants
const port = process.env.port || 8080;
const matchPublicFolder = new RegExp('^/public/[.]*');

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
    if (fs.existsSync(requestedFile) && matchPublicFolder.test(req.url) || req.url === '/') {
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
    else if (req.url === '/login') {
        passport.authenticate('auth0', {
            scope: 'openid email profile'
        }, (req, res) => res.redirect('/'));
    }
    else if (req.url === '/callback') {
        passport.authenticate('auth0', function (err, user, info) {
            console.log('[callback info]', info);
            if (err) { return next(err); }
            if (!user) { return res.redirect('/login'); }
            req.logIn(user, function (err) {
                if (err) { return next(err); }
                const returnTo = req.session.returnTo;
                delete req.session.returnTo;
                res.redirect(returnTo || '/');
            });
        });
    }
    else if (req.url === '/logoff') {
        var returnTo = req.protocol + '://' + req.hostname;
        var port = req.connection.localPort;
        if (port !== undefined && port !== 80 && port !== 443) {
            returnTo += ':' + port;
        }
        var logoutURL = new url.URL(
            util.format('https://%s/logout', process.env.AUTH0_DOMAIN)
        );
        var searchString = querystring.stringify({
            client_id: process.env.AUTH0_CLIENT_ID,
            returnTo: returnTo
        });
        logoutURL.search = searchString;

        res.redirect(logoutURL);
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