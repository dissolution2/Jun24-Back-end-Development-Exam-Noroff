var express = require('express');
var jsend = require('jsend');
var router = express.Router();
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



/** only for Admin not a User !! */
router.post('/login', async function(req,res, next){

	const { userNameORemail, password } = req.body;
	// console.log("Called /login: ", userNameORemail, password); // debug line
	let userName="";
	let email="";
	
	if(isValidateStringNotEmpty(userNameORemail)){
		return res.jsend.fail({ statusCode: 500, message: "userName or email is required"});	
	}

	if(!isValidEmail(userNameORemail)){
		userName = userNameORemail;
	}else{
		email = userNameORemail;
	}
	if(isValidateStringNotEmpty(password)){
		return res.jsend.fail({ statusCode: 500, message: "password is required"});	
	}

		let value = 0;
		let resultQ;
    	// console.log("Call auth/login"); // Debug Line 
		const login_admin_user = 'http://localhost:3000/auth/login'

		let url_data = new URLSearchParams();
		url_data.append(`userName`, userName);
		url_data.append(`email`, email);
		url_data.append(`password`, password);
		
		const option = {
			method: `POST`,
			body: url_data
		};
		async function settAdminUser(url, opt) {
			// Storing response
			try {
				const response = await fetch(url,opt);
				show(await response.text());
			} catch (error) {
				value = 1;
				console.log("api error ", error);
				resultQ = { message: "Api-server migth be down!!", error };
				res.render('index', { resultQ: resultQ, popup: { value } }); // // todo send res.render('index', { message: "Sorry not Admin user"});
			}
		}

		settAdminUser(login_admin_user, option);
			
		async function show(data_sett_admin) {
			let apicallback = JSON.parse(data_sett_admin);

			// console.log("Login Admin user: ", apicallback); // debug line
			const status = apicallback.status;
			const data = apicallback.data;
			const statusCode = data.statusCode;
			const name = data.name;
			const token = data.token;

			// console.log("data: ", data);
			// console.log("status: ", status);
			// console.log("name: ", name);

			//check calback on login
			if(statusCode == 500 || status === "fail" ){
				// console.log("token on fail: ", token); // debug line
				value = 1;
				resultQ = { message: "StatusCode 500, fail api server denied access check user credentials"};
				res.render('index', { resultQ: resultQ, popup: { value } });
				return;
			}else{
				// and check if user is infact an Admin since only Admin should be able to logg in here!!
				// dubble check we have a valid token!!
				if(token){
					if(name === "Admin" || name === "admin"){
						value = 0;
						resultQ;
						req.session.token = token;
						// console.log("token on not fail: ", token); // Debug Line
						res.render('admin');
					}else{
						// we have a User but not an Admin user!!!
						// console.log("Correct we have a user but not Admin!!"); login_admin_user
						value = 1;
						resultQ = { message: "Not admin priv" };
						res.render('index', { resultQ: resultQ, popup: { value } });  // // todo send res.render('index', { message: "Sorry not Admin user"});
						return;	
					}
				}else{
					value = 1;
					resultQ = { message: "Not admin priv" };
					// console.log("token on fail: ", token); // Debug Line
					res.render('index', { resultQ: resultQ, popup: { value } });
					return;
				}
			}
			// testing with postman!!
			//res.jsend.success({ status: status, statusCode: 200, result, email, name, token });
		}
});
module.exports = router;
