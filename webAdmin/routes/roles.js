var express = require('express');
var jsend = require('jsend'); 
var router = express.Router();
router.use(jsend.middleware); 

/* GET users listing. */
router.get('/', function(req, res, next) {
  const token = req.session.token;
  // console.log("token..: ", token); // debug line
  let value = 0;
  let resultQ;

    if(token){
      
    
      fetch('http://localhost:3000/roles', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(response => response.json())
        .then(callback_roles => {
          // Handle the response data
          // console.log(callback_roles); // debug line
          const DataRoles = callback_roles.data.data.roles;

          res.render('roles', { DataRoles: DataRoles , resultQ: resultQ, popup: { value } });

        })
        .catch(err => {
          // Handle errors
          console.log(err);
          value = 1;
          resultQ = { message: "Error, something whent wrong!!: ", err };
          res.render('roles', { DataRoles: null, resultQ: resultQ, popup: { value } });
        });
    }else{
      value = 1;
      resultQ = { message: "Session or Admin rights required!!"};
      res.render('index', { resultQ: resultQ, popup: { value } });
    }
});

module.exports = router;
