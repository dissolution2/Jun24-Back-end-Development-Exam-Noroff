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

/* GET users listing. */
router.get('/', isAuth, async function(req, res, next) {
    /* 
		#swagger.tags = ['UserHistoryDiscount']
	    #swagger.description = 'Admin get all UserHistory (bouth products)'
        
		#swagger.responses[200] = { description: 'statusCode: 200, data: { result: "users found", userHistory }' }
        #swagger.responses[500] = { description: 'statusCode": 401, result: {error: "Privileges Admin rights [Required] !!"}'}
    */
    const { token } = req.body;
    console.log("Called GET / UserDiscountLogg"); // Debug line


    if(token){

        // Get userId
        const user = await usersService.getOneId(token.email);
        let userId = user.dataValues.userId;
        let roleId = user.dataValues.roleId;

        console.log("user ", user); // Debug Line
        console.log("userId: ", userId); // Debug Line
        console.log("roleId: ", roleId); // Debug Line

        const check_role = await roleService.getUserPrivName(roleId);
        let checkPrive = check_role.dataValues.roleName;

        /** We get all Orders As Admin */
        if(checkPrive === "Admin"){
            console.log("we have admin rights"); // Debug line
            
            const userHistory = await userDiscountLoggService.getALLUserHistory();
            return res.jsend.success({ statusCode: 200, data: { result: "users found", userHistory }});  
        
        }
        return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});
    }else{
        return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});
    }

});
/** All tables that are created must have CRUD endpoinst, initially, this is created - used in /cart/checkout when user buy products */
router.post('/', isAuth, async function(req, res, next) {
    /*   
		#swagger.tags = ['UserHistoryDiscount']
        #swagger.description = 'Admin can created user History if not created or user dont exist. NB Initially used in /cart/checkout'
        #swagger.parameters['body'] =  {
    		"name": "body",
    		"in": "body",
			"required": "true",
            "schema": {
        		$ref: "#/definitions/UserHistoryPost",
					}
        }
        #swagger.responses[200] = { description: 'statusCode: 200, data: { result: "Users History created"}'}
        #swagger.responses[404] = { description: 'statusCode: 404, result: { error: "User not found!!", input: userId}'}
        #swagger.responses[403] = { description: 'statusCode: 403, result: { error: "Privileges Admin rights [Required] !!"}'}

    */
    const { userId, token } = req.body;

    const admin_user = await usersService.getOneId(token.email);
    let roleId = admin_user.dataValues.roleId;

    const check_role = await roleService.getUserPrivName(roleId);
    let checkPrive = check_role.dataValues.roleName;

    let convertedUserId = Number(userId);

    if(token){
       if(checkPrive === "Admin"){
            // console.log("we have admin rights"); // Debug line
            if(!Number.isInteger(convertedUserId)){
                return res.jsend.fail({"statusCode": 500, result: {error: "Require userId, Not a integer value", input: userId }});
            }

            const check_userId_exist = await usersService.getOnById(userId);
            if(!check_userId_exist){
                return res.jsend.fail({"statusCode": 404, result: {error: "User not found!!", input: userId}});
            }
            const check_user_discount_exist = await userDiscountLoggService.checkExits(userId);

            if(!check_user_discount_exist){
                const create_history = await userDiscountLoggService.create(userId,0);
                // console.log("created history: ", create_history); // debug line
                return res.jsend.success({ statusCode: 200, data: { result: "Users History created" }}); 
            }
            return res.jsend.success({ statusCode: 200, data: { result: "Users History Allready exist!!" }}); 
    
        }
        return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});
    }else{
        return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});
    }
});

/** change count on bouth products counter 
 * 
 * NB:  
 * remove or update the count to se the memeberShip change on purcheses.
 * 
 * Or use, a user to buy products etc. (testing)!!
*/
router.put('/', isAuth, async function(req, res, next) {
    /* 
		#swagger.tags = ['UserHistoryDiscount']
	    #swagger.description = 'Admin Update/change UserHistory (bouth products), can be used to test MemberShip Discount. NB(change history up to next level of MemberShip example 0 - 15, change to 15. next buy will give next memeberShip)'
        #swagger.parameters['body'] =  {
    		"name": "body",
    		"in": "body",
			"required": "true",
            "schema": {
        		$ref: "#/definitions/UserHistoryPut",
					}
        }
		#swagger.responses[200] = { description: 'statusCode: 200, data: { result: "User history updated" }' }
        #swagger.responses[401] = { description: 'statusCode: 401, data: { error: "User restricted", input: userId }'}
        #swagger.responses[403] = { description: 'statusCode: 403, result: { error: "Privileges Admin rights [Required] !!" }'}
        #swagger.responses[500] = { description: 'statusCode": 500, result: {error: "Require userId, check format", input: userId }'}
    */
    const { userId, updateHistory, token } = req.body;
    console.log("Called PUT / UserDiscountLogg"); // Debug line


    if(token){

        // Get userId
        const user = await usersService.getOneId(token.email);
        let roleId = user.dataValues.roleId;

        console.log("user ", user); // Debug Line
        console.log("req.body 'userId': ", userId); // Debug Line
        console.log("roleId: ", roleId); // Debug Line

        const check_role = await roleService.getUserPrivName(roleId);
        let checkPrive = check_role.dataValues.roleName;

        /** We get all Orders As Admin */
        if(checkPrive === "Admin"){
            console.log("we have admin rights"); // Debug line


            let convertuserId = Number(userId);
            if(Number.isNaN(convertuserId)){
                return res.jsend.fail({"statusCode": 500, result: {error: "Require userId, check format", input: userId }});
            }

            let convertedUpdateHistory = Number(updateHistory);
            if(Number.isNaN(convertedUpdateHistory)){
                return res.jsend.fail({"statusCode": 500, result: {error: "Require updateHistory, check format", input: updateHistory }});
            }

            if(userId !== 1){

                const checkUser = await userDiscountLoggService.checkExits(userId);
                if(checkUser){
                    
                    const userHistory = await userDiscountLoggService.update(userId,updateHistory);
                    // console.log("userHistory: ", userHistory); // debug Line
                    return res.jsend.success({ statusCode: 200, data: { result: "User history updated" }});  
                }else{
                    

                    const user_check = await usersService.getOnById(userId);
                    if(user_check){
                        const history = await userDiscountLoggService.create(userId,updateHistory);
                        return res.jsend.success({ statusCode: 200, data: { result: "No User history, we create and updated", input: userId, update: history }});  
                    }else{
                        return res.jsend.fail({"statusCode": 404, data: { result: "user dont exist", input: userId }});  
                    }
                }
            }else{
                return res.jsend.fail({"statusCode": 401, data: { error: "User restricted", input: userId }});  
            }
        
        }else{
            return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}}); 
        }
    }
    return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}}); 
});

/** All tables that are created must have CRUD endpoinst, we do not destroy - set history to: 0 */
router.delete('/', isAuth, async function(req, res, next) {
    /*   
		#swagger.tags = ['UserHistoryDiscount']
        #swagger.description = 'Admin can resett the User History'
        #swagger.parameters['body'] =  {
    		"name": "body",
    		"in": "body",
			"required": "true",
            "schema": {
        		$ref: "#/definitions/UserHistoryDelete",
					}
        }
        #swagger.responses[200] = { description: 'statusCode: 200, data: { result: "Users History resetted" }' }
        #swagger.responses[404] = { description: 'statusCode: 404, result: { error: "User discount not found, not resetted", input: userId }'}
        #swagger.responses[500] = { description: 'statusCode: 500, result: { error: "Require userId, Not a integer value", input: userId }'}
        #swagger.responses[403] = { description: 'statusCode: 403, result: { error: "Privileges Admin rights [Required] !!"}'}

    */
    const { userId, token } = req.body;

    const admin_user = await usersService.getOneId(token.email);
    let roleId = admin_user.dataValues.roleId;

    const check_role = await roleService.getUserPrivName(roleId);
    let checkPrive = check_role.dataValues.roleName;

    let convertedUserId = Number(userId);

    if(token){
        if(checkPrive === "Admin"){
            // console.log("we have admin rights"); // Debug line
            if(!Number.isInteger(convertedUserId)){
                return res.jsend.fail({"statusCode": 500, result: {error: "Require userId, Not a integer value", input: userId }});
            }

            const check_userId_exist = await usersService.getOnById(userId);
            if(!check_userId_exist){
                return res.jsend.fail({"statusCode": 404, result: {error: "User not found!!", input: userId}});
            }
            const check_user_discount_exist = await userDiscountLoggService.checkExits(userId);

            if(!check_user_discount_exist){
                return res.jsend.fail({"statusCode": 404, result: {error: "User discount not found, not resetted", input: userId}}); 
            }

            const resett_userHistory = await userDiscountLoggService.update(userId,0);
            if(resett_userHistory){
                return res.jsend.success({ statusCode: 200, data: { result: "Users History resetted" }});
            }
            return res.jsend.fail({"statusCode": 500, result: {error: "Server 500 error...", input: userId}}); 
            
        }
        return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});
    }else{
        return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});
    }
});

module.exports = router;