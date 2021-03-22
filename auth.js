//including mysql
let mysql = require('mysql');

//including jsonwebtoken
const jwt = require('jsonwebtoken');

//creating connection to the account_db
let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234567890",
    database: "account_db"
});

//connecting to db
con.connect(function (err) {

    if (!err)
        console.log("Connected to database!");
    else
        console.log("error ocurred:" + JSON.stringify(err));

});

//incluind bcryptjs
var bcrypt = require('bcryptjs');

//promisified db query
let query = (queryString) => {

    return new Promise((resolve, reject) => {

        con.query(queryString, function (err, rows) {

            if (err) return reject(err);

            resolve(rows)

        });

    });

};



//defining exportable function
module.exports = {

    //storing the new user data to register with encrypted password
    register: async (req, res) => {
        try {

            let newUser = {
                name: req.body.name,
                emailId: req.body.emailId,
                address: req.body.address,
                password: req.body.password
            };
        

            let email = newUser.emailId;

            if (!newUser.name) {

                return res.send(`you must provide a valid email_iyou must provide
                 a name should be string not more than 100 charactersd`);
            }
            //checking for name

            else if (!newUser.emailId) {

                return res.send("you must provide a valid email_id");

            }
            //checking for email

            else if (email.indexOf('@') <= 0 || email.indexOf('.') <= 0) {

                return res.send("invalid email address!");

            }
            //validating email id

            else if (!newUser.address) {

                return res.send("you must provide a valid address");

            }
            //checking for address

            else if (!newUser.password) {

                return res.send("you must choose a password max 10 characters");

            }
            //checking for password

            else {


                let queryGetEmailData = `select c_id from clients where email_id = '${email}'`;

                let rows = await query(queryGetEmailData);


                if (rows && rows.length > 0) {
                    return res.send(`this email_id is already registered with c_id = ${rows[0].c_id}`);

                }

                else {

                    const hashedPassword = bcrypt.hashSync(newUser.password, 8);

                    let queryInsertClient = `INSERT INTO clients (name, email_id, address, password) VALUES 
                    ("${newUser.name}", "${newUser.emailId}", "${newUser.address}", "${hashedPassword}");`;

                    await query(queryInsertClient);

                    let queryGetNewCId = `select c_id from clients where email_id = '${newUser.emailId}';`;

                    const rows = await query(queryGetNewCId);

                    //Auth token generate
                    const token = jwt.sign({ email: newUser.emailId }, 'SFdgnf56dcfvut565645ws54', {
                        expiresIn: 60 // expires in 1 min
                      });

                    return res.send(`you are registered now and token = ${token}`);

                }


            }

        } catch (error) {
            console.log(error);
            return res.send(`error`);
        }

    },

    //user login function with token
    login: async (req, res) => {

        try {

            let loginCred = {
                emailId: req.body.emailId,
                password: req.body.password
            }

            if (!loginCred.emailId) {

                return res.send(`you must provide a registered email id`);

            }

            else if (!loginCred.password) {

                return res.send(`you must provide your password`);

            }

            else {


                let queryGetPassword = `select password from clients where email_id = '${loginCred.emailId}';`;

                let rows1 = await query(queryGetPassword);



                if (rows1.length <= 0) {

                    return res.send(`email id is not registered!!`);

                }

                const passwordIsValid = bcrypt.compareSync(loginCred.password, rows1[0].password);

                
                if (passwordIsValid) {

                     //Auth token generate
                     const token = jwt.sign({ email: loginCred.emailId }, 'SFdgnf56dcfvut565645ws54', {
                        expiresIn: 1800 // expires in 30 min
                      });

                    return res.send(`welcome! you are logged in. and token = ${token}`);
                    

                } else {

                    return res.send(`email id or password is incorrect`);

                };
            }

        } catch (error) {
            console.log(error);
            return res.send(`error`);
        }
    },

    //getting the address and name of the client
    showDetails: async (req, res) => {

        try{

            let queryGetDetails = `select name, address from clients where email_id = '${req.email}'`;

            let details = await query(queryGetDetails);

            return res.send(details);


        } catch (error) {
            console.log(error);
            return res.send(`error`);
        }

    },

    deleteDetails: async (req, res) => {

        try{

            let queryDeleteDetails = `update clients set name = '', address = '' where email_id = '${req.email}'`;

            let completeDelete = await query(queryDeleteDetails);

            return res.send(`your data is deleted`);

        } catch (error) {
            console.log(error);
            return res.send(`error`);

        }

    },

    updateDetails: async (req, res) => {

        try {

            let setName = req.body.name;
            let setAddress = req.body.address;

            let queryUpdateDetails = `update clients set name = '${setName}', address = '${setAddress}'
             where email_id = '${req.email}'`;

            let completeupdate = await query (queryUpdateDetails);

            return res.send(`your data is updated`);

        } catch (error) {
            console.log(error);
            return res.send(`error`);
        }

    },

};
