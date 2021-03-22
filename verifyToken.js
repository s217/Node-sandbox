
//including jsonwebtoken
const jwt = require('jsonwebtoken');


module.exports = {

    verify: (req, res, next) => {

        const token = req.headers['authorization'];

        if (!token) {
            return res.status(401).send('Unauthorized use. Access token is missing.');
        }

        const tokenCheck = token.split(' ');


        if (tokenCheck.length === 2 && tokenCheck[0] === 'Bearer') {


            jwt.verify(tokenCheck[1], 'SFdgnf56dcfvut565645ws54', function(err, decoded) {
                if (err) {
                    return res.status(401).send({message: 'Failed to authenticate token.' });
                }

                // if everything good, save to request for use in other routes
                console.log(decoded);

                req.email = decoded.email;
                
                next();

              });



        } else {

            return res.status(401).send('Token should be authorization header. In (Bearer Token) format');

        }


      }

};