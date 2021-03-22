//including mysql
let mysql = require('mysql');

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


//Promisifying db query
let query = (queryString) => {

    return new Promise((resolve, reject) => {

        con.query(queryString, function (err, rows) {

            if (err) return reject(err);

            resolve(rows)

        });

    });

};



module.exports = {

//storing the new user data to register
    register: async (req, res) => {
        try {

            let newUser = {
                emailId: req.body.emailId,
                name: req.body.name,
                address: req.body.address,
                password: req.body.password
            }

            let email = newUser.emailId;

            if (!newUser.name) {

                return res.send({ msg: "you must provide a name (should be string not more than 100 characters" });
            }
            //checking for name

            else if (!newUser.emailId) {

                return res.send({ msg: "you must provide a valid email_id" });

            }
            //checking for email

            else if (email.indexOf('@') <= 0 || email.indexOf('.') <= 0) {

                return res.send({ msg: "invalid email address!" });

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

                let queryInsertClient = `INSERT INTO clients (name, email_id, address, password) VALUES ("${newUser.name}", "${email}", "${newUser.address}", "${newUser.password}");`;

                let rows = await query(queryGetEmailData);


                if (rows && rows.length > 0) {
                    return res.send(`this email_id is already registered with c_id = ${rows[0].c_id}`);
                }

                else {

                    await query(queryInsertClient);

                    let queryGetNewCId = `select c_id from clients where email_id = '${newUser.emailId}';`;

                    const rows = await query(queryGetNewCId);

                    return res.send(`you are registered now and your c_id = ${rows[0].c_id}`);

                }


            }

        } catch (error) {
            console.log(error);
            return res.send('error');
        }

    },
    

//user login function
    login: async (req, res) => {

        try {

            let loginCred = {
                emailId: req.body.emailId,
                password: req.body.password
            }

            if (!loginCred.emailId) {

                return res.send('you must provide a registered email_id');

            }

            else if (!loginCred.password) {

                return res.send('you must provide a password');

            }

            else {

                let queryGetPassword = `select password from clients where email_id = '${loginCred.emailId}';`;

                let rows1 = await query(queryGetPassword);


                if (rows1.length <= 0) {

                    return res.send('email id is not registered!!');

                }

                else if (rows1[0].password === loginCred.password) {

                    return res.send('welcome! you are logged in..');

                }

                else {

                    return res.send('email id or password is incorrect');

                };
            }

        } catch (error) {
            console.log(error)
            return res.send('error');
        }
    },

};

