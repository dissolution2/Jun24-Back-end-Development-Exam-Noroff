var express = require('express');
var jwt = require('jsonwebtoken');
var jsend = require('jsend');
const isAuth = require('../middleware/middleware');
var router = express.Router();
var db = require('../models');
// var crypto = require('crypto')

const UsersService = require("../services/UsersService");
var usersService = new UsersService(db);

const RoleService = require('../services/RoleService');
var roleService = new RoleService(db);

const UserDiscountLoggService = require('../services/UserDiscountLoggService');
var userDiscountLoggService = new UserDiscountLoggService(db);
router.use(jsend.middleware);

function isValidateStringNotEmpty(strComp) {
  return (!strComp || /^\s*$/.test(strComp));
}

/* GET users listing. */
router.get('/', isAuth, async function(req, res, next) {
  /* 
		#swagger.tags = ['Users']
	  #swagger.description = 'Admin get all Users with there History. User logged inn, se there DataHistory'
       
		#swagger.responses[200] = { description: 'statusCode: 200, data: { users: "users found", users, DataHistory: DataHistory }'}
    */
  const { token } = req.body;
  console.log("Called GET /users token: ", token);
  
  if(token){

    const users = await usersService.getOneId(token.email);
    let userId = users.dataValues.userId;
    let roleId = users.dataValues.roleId;

    console.log("user ", users); // Debug Line
    console.log("userId: ", userId); // Debug Line
    console.log("roleId: ", roleId); // Debug Line

    const check_role = await roleService.getUserPrivName(roleId);
    let checkPrive = check_role.dataValues.roleName;

    /** We get all Orders As Admin */
    if(checkPrive === "Admin"){
        //console.log("we have admin rights");

      const users = await usersService.getAll();
      console.log("users getAll: ", users );
      
      if(users){

        const user_history = await userDiscountLoggService.getALLUserHistory();
        // console.log("user_history: ", user_history); //Debug line
        if(user_history){
          const DataHistory = user_history;// .dataValues; //.userId; //.users[0].historyPurchures;
          console.log("DataHistory: ", DataHistory); //[0].dataValues.id);  

          return res.jsend.success({ statusCode: 200, data: { users: "users found", users, DataHistory: DataHistory }});   

        }else{
          //User has no purchuses history to show!!
          return res.jsend.success({ statusCode: 200, data: { users: "users found", users, DataHistory: null }});   
        }
      }else{
        return res.jsend.fail({"statusCode": 500, result: {error: "something whent wrong!!..."}});
      }
    }

    if(checkPrive === "User"){
       console.log("we have user rights");


       //const users = await usersService.getOneId(userId);
       console.log("users from first token check !! ", users);
       const DataHistory = await await userDiscountLoggService.getHistoryDiscount(userId);
       if(DataHistory){
        // returns History!!
        console.log("resturns history data");
        return res.jsend.success({ statusCode: 200, data: { users: "users found", users, DataHistory: DataHistory }});    
       }else{
        console.log("resturns history null");
        return res.jsend.success({ statusCode: 200, data: { users: "users found", users, DataHistory: null }});   
       }
       
    }

  }
  
});


/** All tables that are created must have CRUD endpoints */
/** NB!! User Registratged and login is with auth.js  */
router.post('/', isAuth , async function(req,res,next){
  /* 
		#swagger.tags = ['Users']
	    #swagger.description = 'This is not Implemented her, User are registrated with /Auth/Registrate'
       #swagger.parameters['body'] = {
            "name": "body",
            "in": "body",
            "required": false,
            "schema": {
                "type": "object",
                "properties": {}
            }
        }
		#swagger.responses[500] = { description: 'statusCode": 500, result: {error: "POST for Users is not implemented"}'}
    #swagger.responses[403] = { description: 'statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}'}
    */
  // console.log("Call post /users"); // debug line
  return res.jsend.fail({"statusCode": 500, result: {error: "Not in use..." }}); 

});

/** Update a User to Admin priviliges  */
router.put('/', isAuth , async function(req,res,next){
  /* 
		#swagger.tags = ['Users']
	    #swagger.description = 'Admin can change/update User Privileges to Admin: "Rights" or Back to User: "Rights"'
		#swagger.parameters['body'] =  {
    		"name": "body",
    		"in": "body",
			"required": "true",
      		"schema": {
        		$ref: "#/definitions/UsersPut",
					}
    	}
		#swagger.responses[200] = { description: 'statusCode: 200, result: { message: "User privileges updated" }'}
    #swagger.responses[500] = { description: 'statusCode": 500, result: { error: "Privileges On Admin cant be changed!!"}'}
    #swagger.responses[403] = { description: 'statusCode: 403, result: { error: "Privileges Admin rights [Required] !!"}'}
  	*/
  const { userId, roleName, token } = req.body;
  // console.log("Call put /users userId: ", userId); // debug line
  // console.log("Call put /users roleName: ", roleName); // debug line

  //return res.jsend.fail({"statusCode": 500, result: {error: "Privileges Admin rights [Required] !!", userId: userId, roleName: roleName}});  // debug line 

  if(token){

    const admin_user = await usersService.getOneId(token.email);
    let admin_roleId = admin_user.dataValues.roleId;
    // let admin_roleId = admin_user.dataValues.roleId;

    // console.log("admin_user ", admin_user); // Debug Line
    // console.log("userId: ", userId); // Debug Line
    // console.log("roleId: ", roleId); // Debug Line

    const check_role = await roleService.getUserPrivName(admin_roleId);
    let checkPrive = check_role.dataValues.roleName;

    if(checkPrive === "Admin"){
        // console.log("we have admin rights"); // debug line

        if(Number(userId) !== 1){
          let convertedUserId = Number(userId);
          // let convertedRoleId = Number(roleId);

          if(!Number.isInteger(convertedUserId) || Number(convertedUserId) === 0 ){
            return res.jsend.fail({"statusCode": 500, result: {error: "Require userId, Not a integer value", input: userId }});
          }

          // if(!Number.isInteger(convertedRoleId) || Number(convertedRoleId) === 0 ){
          //   return res.jsend.fail({"statusCode": 500, result: {error: "Require roleId, Not a integer value", input: roleId }});
          // }

          if(isValidateStringNotEmpty(roleName) && roleName === 'Admin'){
            return res.jsend.fail({"statusCode": 500, result: {error: "Require roleName, Not a integer value", input: roleName }});
          }

          const check_user_exist = await usersService.getOnById(convertedUserId);
          // console.log("check_user_exist: ", check_user_exist); // debug line
 
          if(check_user_exist){
            
            const check_roleName_exist = await roleService.getRoleByName(roleName);
            // console.log("check_roleName_exist user update!!: ", check_roleName_exist.dataValues.roleId); // debug line
            
            if(!check_roleName_exist){
              return res.jsend.fail({"statusCode": 500, result: {error: "Error roleName dose not exist"}});
            }

            const roleId = check_roleName_exist.dataValues.roleId;
            const update_user_priv = await usersService.updateUserPriv(userId, roleId );
            

            if(update_user_priv){
              return res.jsend.success({ statusCode: 200, result: { message: 'User privileges updated' }});
            }
            
            return res.jsend.fail({"statusCode": 500, result: {error: "Error updateing User privileges...."}});
            
          }else{
              return res.jsend.success({ statusCode: 200, result: { message: 'User dont exist' }});
          }
      }else{
        return res.jsend.fail({"statusCode": 500, result: {error: "Privileges On Admin cant be changed!!"}});  
      }
    }
    return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});  
  }
  return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});

});

/** Assignment:  "All tables that are created must have CRUD endpoints"  */
/** If User is not active, havent bouth anything  
 * Admin can remove User.
*/
/** Assignment: "Admin user roles can add/edit/delete records"  */
/** Not implemented on webAdmin  */
router.delete('/', isAuth , async function(req,res,next){
  /* 
		#swagger.tags = ['Users']
	  #swagger.description = 'Admin can Delete user. Senario: User is not active, havent bouth anything - no history'
		#swagger.parameters['body'] =  {
    		"name": "body",
    		"in": "body",
			"required": "true",
      		"schema": {
        		$ref: "#/definitions/UsersDelete",
					}
    	}
		#swagger.responses[200] = { description: 'statusCode: 200, result: { message: "User is deleted from the database.." }'}
    #swagger.responses[500] = { description: 'statusCode": 500, result: { error: "User is active, restricted to delete.."}'}
    #swagger.responses[403] = { description: 'statusCode: 403, result: { error: "Privileges Admin rights [Required] !!"}'}
  	*/
  // console.log("Call delete /users"); // debug line
  const { userId, token } = req.body;
  if(token){

    const admin_user = await usersService.getOneId(token.email);
    let admin_roleId = admin_user.dataValues.roleId;
    // let admin_roleId = admin_user.dataValues.roleId;

    // console.log("admin_user ", admin_user); // Debug Line
    // console.log("userId: ", userId); // Debug Line
    

    const check_role = await roleService.getUserPrivName(admin_roleId);
    let checkPrive = check_role.dataValues.roleName;

    if(checkPrive === "Admin"){
        // console.log("we have admin rights"); // debug line

        let convertedUserId = Number(userId);
        if(!Number.isInteger(convertedUserId) || Number(convertedUserId) === 0 ){
           return res.jsend.fail({"statusCode": 500, result: {error: "Require userId, Not a integer value", input: userId }});
        }

        //check if user is active / checks history of purchurses if null etc not used can delete --- 
        const check_user_existOn_purchurses = await userDiscountLoggService.checkExits(userId);
        // console.log("check_user_existOn_purchurses", check_user_existOn_purchurses); // debug line


        if(check_user_existOn_purchurses === null){

          const check_user_exist = await usersService.getOnById(userId);
          // console.log("check_user_exist: ", check_user_exist); // debug line

          if(check_user_exist){
            const delete_user = await usersService.delete(userId);
            // console.log("delete_user", delete_user); // debug line
            return res.jsend.success({ statusCode: 200, result: { message: "User is deleted from the database.." }});
          }
          return res.jsend.fail({"statusCode": 404, result: {error: "User dont exist.."}});
        }
        return res.jsend.fail({"statusCode": 500, result: {error: "User is active, restricted to delete.."}});
      }
      return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});
    }
    return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});
});

module.exports = router;
