var express = require('express');
var jsend = require('jsend'); 
var router = express.Router();
router.use(jsend.middleware); 

function isValidateStringNotEmpty(strComp) {
  return (!strComp || /^\s*$/.test(strComp));
}


/* GET users listing. */
router.get('/', function(req, res, next) {
  
  // console.log("Call GET /admin/users") // debug line
  const token = req.session.token;
  let value = 0;
  let resultQ;
  
  if(token){

    // console.log("Call GET /users we are inn token!!") // debug line
   
    fetch('http://localhost:3000/users', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(response => response.json())
        .then(callback_users => {
          // Handle the response data
          // console.log(callback_users); // debug line
          const DataUsers = callback_users.data.data.users;
          // const DataHistory = callback_users.data.data.DataHistory;
          res.render('users', { DataUsers: DataUsers, resultQ: resultQ, popup: { value } });

        })
        .catch(err => {
          // Handle errors
          console.log("error: ", err);
          value = 1;
          resultQ = { message: "Error, something whent wrong!!: ", err };
          res.render('users', { DataUsers: null, resultQ: resultQ, popup: { value } });
        });
  }
  else{
    value = 1;
    resultQ = { message: "Session or Admin rights required!!"};
    res.render('index', { resultQ: resultQ, popup: { value } });
  }


});

router.post('/update', function(req, res, next) {

  const { id, userNameUpdate, userRoleName,    } = req.body;
  const token = req.session.token;
  let value = 0;
  let resultQ;
  
  // console.log("update users called") // Debug Line
  // console.log("update users userId: ", id) // Debug Line
  // console.log("update users userNameUpdate: ", userNameUpdate) // Debug Line
  // console.log("update users userRoleName: ", userRoleName) // Debug Line

  if(token){

    const url_users_update = 'http://localhost:3000/users';
    const url_users = 'http://localhost:3000/users';
      
    let url_data = new URLSearchParams();
    url_data.append(`userId`, id);
    url_data.append(`roleName`, userRoleName);
    
    const option = {
        method: `PUT`,
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: url_data
    }; 

    fetch(url_users_update, option)
    .then(response => response.json())
    .then(async callback_update => {

      // console.log("callback_update: ", callback_update); // debug line
      value = 1;
      resultQ = callback_update;

      const fetch_UsersWithPromise = fetch(url_users, { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } }).then(response => response.json());
      
      const [callback_users] = await Promise.all([fetch_UsersWithPromise]);
      // console.log("callback_users: ", callback_users); // debug line

      const DataUsers = callback_users.data.data.users;
      // const DataCollectionList = callback_memberShip.data.data.DataCollectionList;
      // console.log("DataUsers: ", DataUsers); // debug line
      // console.log("DataCollectionList: ", DataCollectionList);
      

        // Render the page with fetched data
        res.render('users', { DataUsers: DataUsers, resultQ: resultQ, popup: { value } });
    })
    .catch(err => {
      
      // Handle errors
      console.log("error: ", err);
      value = 1;
      resultQ = { message: "Error, something whent wrong!!: ", err };
      res.render('users', { DataUsers: null, resultQ: resultQ, popup: { value } });
    });

  }else{
    value = 1;
    resultQ = { message: "Session or Admin rights required!!"};
    res.render('index', { resultQ: resultQ, popup: { value } });
  }


});

module.exports = router;
