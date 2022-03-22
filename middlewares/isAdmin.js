const { Admin } = require('../models/index');

module.exports = (req, res, next) => {
  let id = req.body.id;

  Admin
  .findOne({
    where : { id_user : id }
  })
  .then(isAdmin => {
    if(isAdmin){
      next();
    }else {
      res.status(401).send(`The user has no admin privileges.`)
    }
  })
  .catch(error => {
    res.send(error)
  })
};