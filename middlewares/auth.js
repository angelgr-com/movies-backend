const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Check if token exists
  if (!req.headers.authorization) {
    res.status(401).json({ msg: "Unauthorized access." });
  } 
  else {
    // Check token validity
    let token = req.headers.authorization.split(" ")[1];

    // Check the validity of this token
    jwt.verify(token, process.env.AUTH_EXPIRES, (err, decoded) => {
      if(err) {
          res.status(500).json({ msg: "A problem occurred while decoding the token: ", err });
      } else {
          req.user = decoded;
          next();
      }
    });
  }
};