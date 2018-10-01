const jwt = require('jsonwebtoken');
const jwtKey = require('../Values');
module.exports = (req, res,next) => {
    try{
        const authToken = req.headers.authorization.split(" ")[1];
        const authTokenDecoded = jwt.verify(authToken, jwtKey.jwtKey);

        req.user = authTokenDecoded
        next();
    }
    catch(error) {
        res.status(401).json({
            message: "Auth failed"
        });
    }
};