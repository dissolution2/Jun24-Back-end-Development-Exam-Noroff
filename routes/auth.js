var express = require('express');
var jwt = require('jsonwebtoken');
var jsend = require('jsend');
var router = express.Router();
var db = require('../models');
var crypto = require('crypto')
var UsersService = require("../services/UsersService");
var usersService = new UsersService(db);

router.use(jsend.middleware);




/** Email( test: string @ . string ) value validation function */
function isValidEmail(email) {
	const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
	if(!regex.test(email)){
	  return false;
	}else{
	  return true;
	}
  }
  
  function isValidateStringNotEmpty(strComp) {
	return (!strComp || /^\s*$/.test(strComp));
  }

// ? Swagger checked
router.post('/register', async function (req, res, next) {
    /* 
		#swagger.tags = ['Auth']
	    #swagger.description = 'User register with firstName, lastName, userName, address, telephonenumber, email, password'
		#swagger.parameters['body'] =  {
    		"name": "body",
    		"in": "body",
			"required": "true",
      		"schema": {
        		$ref: "#/definitions/Register",
					}
    	}
		#swagger.responses[200] = { description: 'statusCode: 200, result: { message: "Your account has been crated!!"" }'}
  	*/
    /** All users are given a role = "User" */
    /** All users are given a memberId = 1 memberShip discount */
    
    const { firstName, lastName, userName, address, telephonenumber, email, password } = req.body;

	// console.log(roleId, memberId, firstName, lastName, userName, address, telephonenumber, email, password); // Debug Line

	if(isValidateStringNotEmpty(firstName)){
    //if(firstName == null || firstName == ""){
		return res.jsend.fail({"statusCode": 500, result: {firstName: "firstName is required."}});
	}
    
	//if(lastName == null || lastName == ""){
	if(isValidateStringNotEmpty(lastName)){
		return res.jsend.fail({"statusCode": 500, result: {lastName: "lastName is required."}});
	}

    //if(userName == null || userName == ""){
	if(isValidateStringNotEmpty(userName)){
		return res.jsend.fail({"statusCode": 500, result: {userName: "UserName is required. "}});
	}
	if(isValidateStringNotEmpty(address)){
    //if(address == null || address == ""){
		return res.jsend.fail({"statusCode": 500, result: {address: "Address is required."}});
	}

    
	if(isValidateStringNotEmpty(telephonenumber)){  // uins string in init on initAdmin, with URLSearchParams cant use integer or Number()
		return res.jsend.fail({"statusCode": 500, result: {telephonenumber: "Number is required."}});
	}

    //if(email == null || email == ""){
	if(!isValidEmail(email)){
		return res.jsend.fail({"statusCode": 500, result: {email: "Email is required, check format."}});
	}
	
	//if (password == null || firstName == "") {
	if(isValidateStringNotEmpty(password)){
		return res.jsend.fail({"statusCode": 500, result: {"password": "Password is required."}});
	}
	// todo: if time set new qury wit or notation [or] so we only have one quriy on both
    var checkUserEmail = await usersService.getOneEmail(email);
	var checkUserName = await usersService.getOneUserName(userName);
	
	// console.log("check userName: ", checkUserName); // Debug Line
	// console.log("check userEmail: ", checkUserEmail); // Debug Line

	if(checkUserEmail != null || checkUserName != null){
		return res.jsend.error("There was an error crating you account, User name or email is allready in use!");
	}
	var salt = crypto.randomBytes(16);
	crypto.pbkdf2(password, salt, 310000, 32, 'sha256', async function(error, hashedPassword){
		if(error){
			return next(error);
		}
		const user = await usersService.create(2, 1, firstName, lastName, userName, address, telephonenumber, email, hashedPassword, salt);
		console.log("user created: ", user); // Debug Line
		res.jsend.success({ statusCode: 200, result: { message: 'Your account has been crated!!' }});
	});
});


// ? Swagger checked
router.post('/login', async function(req,res, next){
	/* 
		#swagger.tags = ['Auth']
	    #swagger.description = 'User login with userName or email and password { userName: "dissolution", email: "", password: "12345" }'
		#swagger.parameters['body'] =  {
    		"name": "body",
    		"in": "body",
			"required": "true",
      		"schema": {
        		$ref: "#/definitions/LogIn",
					}
    	}
		#swagger.responses[200] = { description: 'status: "success",
				statusCode: 200,
				data: {
					result: "You are logged in",
					email: "test@test.com",
					name: "dissolution",
					token: "token generated..."
				}' }
  	*/
    const { userName, email, password } = req.body;

	if(isValidateStringNotEmpty(userName) && isValidateStringNotEmpty(email)){
		return res.jsend.fail({ statusCode: 500, message: "userName or email is required"});	
	}
	if(isValidateStringNotEmpty(password)){
		return res.jsend.fail({ statusCode: 500, message: "password is required"});	
	}
    if(!isValidateStringNotEmpty(email)){

		// console.log("Call auth/login with email"); // Debug Line

		usersService.getOneEmail(email).then((data) => {
			if(data === null) {
				return res.jsend.fail({ statusCode: 500, message: "Incorrect email or password"});
			}
			crypto.pbkdf2(password, data.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
			if (err) { return cb(err); }
			if (!crypto.timingSafeEqual(data.encryptedPassword, hashedPassword)) {
				return res.jsend.fail({ statusCode: 500, message: "Incorrect email or password"});
			}
			let token;
			try {
				token = jwt.sign(
				{ id: data.id, email: data.email, name: data.userName },
				process.env.TOKEN_SECRET,
				{ expiresIn: "2h" }
				);
				console.log("token: ", token);
			} catch (err) {
				res.jsend.error({ statusCode: 500, message: 'Something whent wrong!!', data: err });
			}
				res.jsend.success({
					status: "success",
					statusCode: 200,
					data: {
						result: "You are logged in",
						email: data.email,
						name: data.userName,
						token: token
					}
				});
			});
		});
	}else if(!isValidateStringNotEmpty(userName)){

		// console.log("Call auth/login with userName"); Debug Line

		usersService.getOneUserName(userName).then((data) => {
			if(data === null) {
				return res.jsend.fail({ statusCode: 500, message: "Incorrect username or password"});
			}
			crypto.pbkdf2(password, data.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
			if (err) { return cb(err); }
			if (!crypto.timingSafeEqual(data.encryptedPassword, hashedPassword)) {
				return res.jsend.fail({ statusCode: 500, message: "Incorrect username or password"});
			}
			let token;
			try {
				token = jwt.sign(
				{ id: data.id, email: data.email, name: data.userName }, 
				process.env.TOKEN_SECRET,
				{ expiresIn: "2h" }
				);
			} catch (err) {
				//todo: check this up against remove TOKEN-SECRET to se if we can get the application not to crash but give message !!
				res.jsend.error({ statusCode: 500, message: 'Something whent wrong!!', data: err });
			}
			res.jsend.success({
				status: "success",
				statusCode: 200,
				data: {
					result: "You are logged in",
					email: data.email,
					name: data.userName,
					token: token
				}
			});
			});
		});
	}
});
module.exports = router;
