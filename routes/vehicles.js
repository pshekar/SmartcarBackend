var express = require('express');        // call express
var router = express.Router();           // get an instance of the express Router
var request = require('request');

// GM base URL to be used by all APIs
var baseGMUrl = 'https://gmapi.azurewebsites.net';

// array of valid IDs - ideally this would be a connection to the database
// where all the car IDs would be stored
var IDs = ['1234', '1235'];

// vehicle info
router.route('/:id')
    .get(function(req, res) {
        // check to see if ID in parameter is valid - ideally I would call a
        // helper function to check if ID is stored in the database
        if (IDs.includes(req.params.id) === false) {
            res.status(500)
            res.send({ error: "Please provide a valid ID" })
        }
        else {
            //adjust url for  specific route
            var GMRequest = baseGMUrl + '/getVehicleInfoService';
            //body for the POST request to GM API
            var reqBody = {
                id: req.params.id,
                responseType: 'JSON'
            }
            //object to send as response to Smartcar API call
            var result = {};
            //call made to GM API
            request({
                method: 'POST',
                url: GMRequest,
                body: reqBody,
                json: true
            }, (err, resp, body) => {
                //adding required key/value to result object
                result['vin'] = body.data.vin.value;
                result['color'] = body.data.color.value;
                //GM API returns whether it is a four door sedan or a two door coupe,
                //but Smartcar API returns a number, thus the ternary
                result['doorCount'] = body.data.fourDoorSedan.value === 'True' ? 4 : 2;
                result['driveTrain'] = body.data.driveTrain.value;
                //return as json object
                res.json(result);
            });
        }
    });

// security
router.route('/:id/doors')
    .get(function(req, res) {
        // check to see if ID in parameter is valid - ideally I would call a
        // helper function to check if ID is stored in the database
        if (IDs.includes(req.params.id) === false) {
            res.status(500)
            res.send({ error: "Please provide a valid ID" })
        }
        else {
            //adjust url for  specific route
            var GMRequest = baseGMUrl + '/getSecurityStatusService';
            //body for the POST request to GM API
            var reqBody = {
                id: req.params.id,
                responseType: 'JSON'
            }
            //array to send as response to Smartcar API call
            var result = [];
            //call made to GM API
            request({
                method: 'POST',
                url: GMRequest,
                body: reqBody,
                json: true
            }, (err, resp, body) => {
                //loop through array that GM API returns with each car door position
                // and whether that door is locked or not
                for (var value in body.data.doors.values) {
                    var obj = body.data.doors.values[value];
                    var position = {};
                    position['location'] = obj.location.value;
                    //GM API returns a string, so this ternary is to make it a boolean
                    position['locked'] = obj.locked.value === 'True' ? true : false;
                    result.push(position);
                }
                //return as json object
                res.jsonp(result);
            });
        }
    });

// fuel range
router.route('/:id/fuel')
    .get(function(req, res) {
        // check to see if ID in parameter is valid - ideally I would call a
        // helper function to check if ID is stored in the database
        if (IDs.includes(req.params.id) === false) {
            res.status(500)
            res.send({ error: "Please provide a valid ID" })
        }
        else {
            //adjust url for  specific route
            var GMRequest = baseGMUrl + '/getEnergyService';
            //body for the POST request to GM API
            var reqBody = {
                id: req.params.id,
                responseType: 'JSON'
            }
            //object to send as response to Smartcar API call
            var result = {};
            //call made to GM API
            request({
                method: 'POST',
                url: GMRequest,
                body: reqBody,
                json: true
            }, (err, resp, body) => {
                //add required key/value pair to result object
                result['percent'] = parseFloat(body.data.tankLevel.value);
                //return as json object
                res.jsonp(result);
            });
        }
    });

// battery range
router.route('/:id/battery')
    .get(function(req, res) {
        // check to see if ID in parameter is valid - ideally I would call a
        // helper function to check if ID is stored in the database
        if (IDs.includes(req.params.id) === false) {
            res.status(500)
            res.send({ error: "Please provide a valid ID" })
        }
        else {
            //adjust url for  specific route
            var GMRequest = baseGMUrl + '/getEnergyService';
            //body for the POST request to GM API
            var reqBody = {
                id: req.params.id,
                responseType: 'JSON'
            }
            //object to send as response to Smartcar API call
            var result = {};
            //call made to GM API
            request({
                method: 'POST',
                url: GMRequest,
                body: reqBody,
                json: true
            }, (err, resp, body) => {
                //add required key/value pair to result object
                result['percent'] = parseFloat(body.data.batteryLevel.value);
                //return as json object
                res.jsonp(result);
            });
        }
    });

// start/stop engine
router.route('/:id/engine')
    .post(function(req, res) {
        // check to see if ID in parameter is valid - ideally I would call a
        // helper function to check if ID is stored in the database
        if (IDs.includes(req.params.id) === false) {
            res.status(500)
            res.send({ error: "Please provide a valid ID" })
        }
        else {
            //adjust url for  specific route
            var GMRequest = baseGMUrl + '/actionEngineService';
            //changing the action part of the post body to match the GM API reqs
            var command = req.body.action === 'START' ? 'START_VEHICLE' : 'STOP_VEHICLE';
            //body for the POST request to GM API
            var reqBody = {
                id: req.params.id,
                command: command,
                responseType: 'JSON'
            }
            //object to send as response to Smartcar API call
            var result = {};
            //call made to GM API
            request({
                method: 'POST',
                url: GMRequest,
                body: reqBody,
                json: true
            }, (err, resp, body) => {
                //check resulting status
                //EXECUTED = success, otherwise error
                var status = body.actionResult.status === 'EXECUTED' ? 'success' : 'error';
                //add required key/value pair to result object
                result['status'] = status;
                //return as json object
                res.jsonp(result);
            });
        }
    })

module.exports = router;   // for testing
