const { Admin } = require('../models/index');

module.exports = (req, res, next) => {
  let id = req.body.id;

  Admin
  .findOne({
    where : { id : id }
  })
  .then(isAdmin => {
    if(isAdmin){
      next();
    }else {
        res.send(`The user has no admin privileges.`)
    }
  })
  .catch(error => {
    res.send(error)
  })
};