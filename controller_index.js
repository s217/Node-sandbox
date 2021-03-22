//including express
const express = require("express");

//incluind bcryptjs
const bcrypt = require('bcryptjs');

//including authentication.js
const auth = require('./auth');

const verifyToken = require('./verifyToken');


//creating object of express
const router = express.Router();

//including database file
const database = require("./database");

//including body parser
const bodyParser = require("body-parser");

//creating object of express
const app = express();

//using the body parser
app.use(bodyParser.json());

//using the body parser urlencoded function
app.use(bodyParser.urlencoded({ extended: false }));

//running the server
app.listen(3100, function (req, res) {

    console.log("server is running");

});

//getting a response
app.get("/", verifyToken.verify, function (req, res) {

    
    res.send(`welcome user with email : ${req.email}`);

});

//API for registration
app.post("/register", database.register);

//API for log in
app.post("/login", database.login);

//API for register with encrypted password
app.post("/register/encryption", auth.register);

//API for log in with token
app.post("/login/token", auth.login);

//get details of the client
app.get("/datails", verifyToken.verify, auth.showDetails);

//delete details of client
app.get("/delete", verifyToken.verify, auth.deleteDetails);

//update the details of the client
app.post("/update", verifyToken.verify, auth.updateDetails);
