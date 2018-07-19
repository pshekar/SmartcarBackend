// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// routes
var vehicles = require('./routes/vehicles');

// middleware
app.use(function(req, res, next) {
    // do logging
    // keeping these consoles to check route and http method
    // console.log(req.method);
    // console.log(req.url);
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/)
app.get('/', function(req, res) {
    res.json({ message: 'connected to API' });
});

// register routes here
// all of our routes will be prefixed with /api
app.use('/vehicles', vehicles);

// start server
app.listen(port);
console.log('Listening on port ' + port);

module.exports = app;
