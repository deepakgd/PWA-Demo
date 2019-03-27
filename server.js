require('dotenv').config()
const express = require('express'),
  bodyParser = require('body-parser'),
  path = require('path'),
  mongoose = require('mongoose'),
  ejs = require('ejs'),
  cors = require('cors'),
  jsonFile = require('jsonfile');

// global storing project path
global.appRoot = path.resolve(__dirname);

// Creates an Express application. The express() function is a top-level function exported by the express module.
const app = express()

// init/connect mongodb
require('./app/utils').db(mongoose);


// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');

// enable CORS 
app.use(cors())

// Parse incoming request bodies in a middleware before your handlers, available under the req.body property. Limited to 50mb for both form data and json
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }))

// Static files access
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, '/app/views')))

//webpack object stored
jsonFile.readFile('./public/build/webpack-manifest.json', (err, obj) => {
  if (err) return err;
  app.set('webpack', obj);
});

// For local, dynamic changes can be updated
if (process.env.NODE_ENV === 'local') {
  app.use(function (req, res, next) {
    if (req.method === 'GET') {
      jsonFile.readFile('./public/build/webpack-manifest.json', (err, obj) => {
        if (err) return err;
        app.set('webpack', obj);
        next();
      });
    }
    else next();
  })
}

// handles all api 
app.use('/api', require('./app/router/api'));

// home page 
app.get('/', (req, res, next) => {
  return res.render('index.ejs', { message: "You can access this site offline (Message from server - EJS data bindings)", webpack: req.app.get('webpack') });
})

// return storage page with webpack object
app.get('/storage', (req, res, next) => res.render('storage', { webpack: req.app.get('webpack') }));

// return pushnotification page with webpack object
app.get('/pushnotification', (req, res, next) => res.render('pushnotification', { webpack: req.app.get('webpack') }));

// return camera page with webpack object
app.get('/camera', (req, res, next) => res.render('camera', { webpack: req.app.get('webpack') }));

// return geolocation page with webpack object
app.get('/geolocation', (req, res, next) => res.render('geolocation', { webpack: req.app.get('webpack') }));

// return morefeatures page with webpack object
app.get('/morefeatures', (req, res, next) => res.render('morefeatures', { webpack: req.app.get('webpack') }));

// app listening to port 3000
app.listen(3000, () => console.log('app listening on port 3000!'))