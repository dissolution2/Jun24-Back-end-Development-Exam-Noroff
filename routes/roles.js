var express = require('express');
// var jwt = require('jsonwebtoken');
var jsend = require('jsend');
const isAuth = require('../middleware/middleware');
var router = express.Router();
var db = require('../models');
// var crypto = require('crypto')

const UsersService = require("../services/UsersService");
var usersService = new UsersService(db);

const RoleService = require('../services/RoleService');
var roleService = new RoleService(db);


router.use(jsend.middleware);

/* GET roles listing. */
router.get('/', isAuth, async function(req, res, next) {
    /* 
		#swagger.tags = ['Role']
	    #swagger.description = 'Admin get all roles in the database'
        
		#swagger.responses[200] = { description: 'statusCode: 200, data: { roles: "Roles found", roles }' }
        #swagger.responses[403] = { description: 'statusCode: 403, result: {error: "Privileges Admin rights [Required] !!"}'}
    */
    const { token } = req.body;
    console.log("Called GET / Roles"); // Debug line


    if(token){

        // Get userId
        const user = await usersService.getOneId(token.email);
        let userId = user.dataValues.userId;
        let roleId = user.dataValues.roleId;

        console.log("user ", user); // Debug Line
        console.log("userId: ", userId); // Debug Line
        console.log("roleId: ", roleId); // Debug Line

        const check_role = await roleService.getUserPrivName(roleId);
        //console.log("check_role in roles.js: ", check_role);
        let checkPrive = check_role.dataValues.roleName;

        /** We get all Orders As Admin */
        if(checkPrive === "Admin"){
            //console.log("we have admin rights");
            const roles = await roleService.getAll();
            console.log("roles: ", roles);

            if(roles){
                return res.jsend.success({ statusCode: 200, data: { roles: "Roles found", roles }});   
            }
        }
        return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});
    }else{
        return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});
    }

});
/** All tables that are created must have CRUD endpoinst */
/** required: only Admin and User Role. */
router.post('/', isAuth, async function(req, res, next) {
    /*   
		#swagger.tags = ['Role']
        #swagger.description = 'All tables that are created must have CRUD endpoinst - Not implemented'
        #swagger.deprecated = true
        #swagger.responses[500] = { description: 'statusCode": 500, result: {error: "POST for Roles is not implemented"}'}
        #swagger.responses[403] = { description: 'statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}'}

    */
    const { token } = req.body;
    if(token){
        return res.jsend.fail({"statusCode": 500, result: {error: "POST for Roles is not implemented"}});
    }
    return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});

});
/** All tables that are created must have CRUD endpoinst */
/** required: only Admin and User Role. if changed -breaks the application */
router.put('/', isAuth, async function(req, res, next) {
    /*   
		#swagger.tags = ['Role']
        #swagger.description = 'All tables that are created must have CRUD endpoinst - Not implemented'
        #swagger.deprecated = true
        #swagger.responses[500] = { description: 'statusCode": 500, result: {error: "PUT for Roles is not implemented"}'}
        #swagger.responses[403] = { description: 'statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}'}

    */
    const { token } = req.body;
    if(token){
        return res.jsend.fail({"statusCode": 500, result: {error: "PUT for Roles is not implemented"}});
    }
    return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});
});
/** All tables that are created must have CRUD endpoinst */
/** required: only Admin and User Role. if deleted -breaks the application */
router.delete('/', isAuth, async function(req, res, next) {
    /*   
		#swagger.tags = ['Role']
        #swagger.description = 'All tables that are created must have CRUD endpoinst - Not implemented'
        #swagger.deprecated = true
        #swagger.responses[500] = { description: 'statusCode": 500, result: {error: "DELETE for Roles is not implemented"}'}
        #swagger.responses[403] = { description: 'statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}'}

    */
    const { token } = req.body;
    if(token){
        return res.jsend.fail({"statusCode": 500, result: {error: "DELETE for Roles is not implemented"}});
    }
    return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});
});

module.exports = router;