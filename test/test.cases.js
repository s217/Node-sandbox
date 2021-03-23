//including chai
const chai = require("chai");

//including chai-http
const chaiHttp = require("chai-http");

//creating an object of chai
const should = chai.should();

//including token generating file
let token;

//creating an invalid token for test
const invalidToken = "log123";

let validUser = require('./test.mock').validUser;
let invalidUser1 = require('./test.mock').invalidUser1;
let invalidUser2 = require('./test.mock').invalidUser2;
//using chai http
chai.use(chaiHttp);

//including the controller for test
let server = require("../controller_index");

describe('controller_index', () => {

    describe('testing the register API', () => {

        //test for incorrect email @ is missing
        it('it should not register the new user', (done) => {
            chai.request(server)
                .post('/register/encryption')
                .send({name: invalidUser1.name, address: invalidUser1.address, emailId: invalidUser1.email, password: invalidUser1.password})
                .end((err, res) => {
                    (res).should.have.status(400);
                    (res.body).should.be.a('object');
                    done();
                });
        });

        //test for incorrect email dot is missing
        it('it should not register the new user', (done) => {
            chai.request(server)
                .post('/register/encryption')
                .send({name: invalidUser2.name, address: invalidUser2.address, emailId: invalidUser2.email, password: invalidUser2.password})
                .end((err, res) => {
                    (res).should.have.status(400);
                    (res.body).should.be.a('object');
                    done();
                });
        });

        //test if name is not there
        it('it should not register the new user', (done) => {
            chai.request(server)
                .post('/register/encryption')
                .send({address: validUser.address, emailId: validUser.email, password: validUser.password})
                .end((err, res) => {
                    (res).should.have.status(400);
                    (res.body).should.be.a('object');
                    done();
                });
        });

        //test if address is not there
        it('it should not register the new user', (done) => {
            chai.request(server)
                .post('/register/encryption')
                .send({name: validUser.name, emailId: validUser.email, password: validUser.password})
                .end((err, res) => {
                    (res).should.have.status(400);
                    (res.body).should.be.a('object');
                    done();
                });
        });

        //test if email is not there
        it('it should not register the new user', (done) => {
            chai.request(server)
                .post('/register/encryption')
                .send({name: validUser.name, address: validUser.address, password: validUser.password})
                .end((err, res) => {
                    (res).should.have.status(400);
                    (res.body).should.be.a('object');
                    done();
                });
        });

        //test if password is not there
        it('it should not register the new user', (done) => {
            chai.request(server)
                .post('/register/encryption')
                .send({name: validUser.name, address: validUser.address, emailId: validUser.email})
                .end((err, res) => {
                    (res).should.have.status(400);
                    (res.body).should.be.a('object');
                    done();
                });
        });

        //testing the register API with valid user
        it('it should register the new user', (done) => {
            chai.request(server)
                .post('/register/encryption')
                .send({name: validUser.name, address: validUser.address, emailId: validUser.email, password: validUser.password})
                .end((err, res) => {
                    (res).should.have.status(200);
                    (res.body).should.be.a('object');
                    token = res.body.token;
                    done();
                });
        });

    });

    describe('testing the log in API', () => {

        it('test for not registered email', (done) => {
            chai.request(server)
                .post('/login/token')
                .send({emailId: invalidUser1.email, password: invalidUser1.password})
                .end((err, res) => {
                    (res).should.have.status(400);
                    (res.body).should.be.a('object');
                    done();
                });
        });

        it('test for incorrect password', (done) => {
            chai.request(server)
                .post('/login/token')
                .send({emailId: validUser.email, password: invalidUser1.password})
                .end((err, res) => {
                    (res).should.have.status(400);
                    (res.body).should.be.a('object');
                    done();
                });
        });

        it('test for valid user log in', (done) => {
            chai.request(server)
                .post('/login/token')
                .send({emailId: validUser.email, password: validUser.password})
                .end((err, res) => {
                    (res).should.have.status(200);
                    (res.body).should.be.a('object');
                    done();
                });
        });

    });

    describe('testing the delete API', () => {

        it('test for delete with invalid token', (done) => {
            chai.request(server)
                .get('/delete')
                .set('Authorization' , 'Bearer ' + invalidToken)
                .end((err, res) => {
                    (res).should.have.status(401);
                    (res.body).should.be.a('object');
                    done();
                });
        });

        it('test for delete with valid token', (done) => {
            chai.request(server)
                .get('/delete')
                .set('Authorization' , 'Bearer ' + token)
                .end((err, res) => {
                    (res).should.have.status(200);
                    (res.body).should.be.a('object');
                    done();
                });
        });

    });

    describe('testing the show details API', () => {

        it('test for show details with invalid token', (done) => {
            chai.request(server)
                .get('/details')
                .set('Authorization' , 'Bearer ' + invalidToken)
                .end((err, res) => {
                    (res).should.have.status(401);
                    (res.body).should.be.a('object');
                    done();
                });
        });

        it('test for show details with valid token', (done) => {
            chai.request(server)
                .get('/details')
                .set('Authorization' , 'Bearer ' + token)
                .end((err, res) => {
                    (res).should.have.status(200);
                    (res.body).should.be.a('object');
                    done();
                });
        });

    });

    describe('testing the update API', () => {

        //test for update with invalid token
        it('it should update the details of user', (done) => {
            chai.request(server)
                .post('/update')
                .set('Authorization' , 'Bearer ' + invalidToken)
                .send({name: invalidUser1.name, address: invalidUser1.address})
                .end((err, res) => {
                    (res).should.have.status(401);
                    (res.body).should.be.a('object');
                    done();
                });
        });

        it('test for update with valid token', (done) => {
            chai.request(server)
                .post('/update')
                .set('Authorization' , 'Bearer ' + token)
                .send({name: invalidUser1.name, address: invalidUser1.address})
                .end((err, res) => {
                    (res).should.have.status(200);
                    (res.body).should.be.a('object');
                    done();
                });
        });
    });

});




