const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

module.exports = (req, res, next) => {
  // console.log(req.headers);
  // Check if token exists
  if (!req.headers.authorization) {
    res.status(401).json({ msg: "Unauthorized access." });
  } 
  else {
    // Check token validity
    let token = req.headers.authorization.split(" ")[1];

    // Check the validity of this token
    jwt.verify(token, authConfig.secret, (err, decoded) => {
      if(err) {
          res.status(500).json({ msg: "A problem occurred while decoding the token: ", err });
      } else {
          req.user = decoded;
          console.log('Valid token. Auth passed.')
          next();
      }
    });
  }
};