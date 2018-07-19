//During the test ensure the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

chai.use(chaiHttp);

var carID = '1234';

describe('Vehicles', () => {
    describe('/GET/:id vehicle', () => {
        it('it should get vehicle info', (done) => {
            chai.request(server)
            .get('/vehicles/' + carID)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('vin');
                res.body.should.have.property('color');
                res.body.should.have.property('doorCount');
                res.body.should.have.property('driveTrain');
              done();
            });
        })
    })

    describe('/GET/:id/doors vehicle', () => {
        it('it should get vehicle car door info', (done) => {
            chai.request(server)
            .get('/vehicles/' + carID + '/doors')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(carID === '1234' ? 4 : 2);
              done();
            });
        })
    })

    describe('/GET/:id/fuel vehicle', () => {
        it('it should get vehicle fuel info', (done) => {
            chai.request(server)
            .get('/vehicles/' + carID + '/fuel')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('percent');
              done();
            });
        })
    })

    describe('/GET/:id/battery vehicle', () => {
        it('it should get vehicle battery info', (done) => {
            chai.request(server)
            .get('/vehicles/' + carID + '/battery')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('percent');
              done();
            });
        })
    })

    describe('/POST/:id/engine vehicle', () => {
        it('it should start or stop the vehicle', (done) => {
            chai.request(server)
            .post('/vehicles/' + carID + '/engine')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('status');
              done();
            });
        })
    })

    describe('/GET/:id vehicle fail', () => {
        it('it should throw error saying invalid ID', (done) => {
            chai.request(server)
            .get('/vehicles/1456')
            .end((err, res) => {
                res.should.have.status(500);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
              done();
            });
        })
    })

})
