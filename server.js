require('dotenv').config()
const express = require('express'),
  bodyParser = require('body-parser'),
  path = require('path'),
  mongoose = require('mongoose'),
  ejs = require('ejs');

global.appRoot = path.resolve(__dirname);

const app = express()

// init/connect mongodb
require('./app/utils').db(mongoose);


// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, '/app/views')))

app.use('/fcm', require('./app/router/fcm'));

app.get('/', (req, res, next) => {
  return res.render('index.ejs', { message: "You can access this site offline (Message from server - EJS data bindings)" });
})

app.get('/storage', (req, res, next) => res.render('storage'));

app.listen(3000, () => console.log('app listening on port 3000!'))