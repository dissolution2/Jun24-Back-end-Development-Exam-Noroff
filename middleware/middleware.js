// Middleware function to determine if the API endpoint request is from an authenticated user
var jwt = require('jsonwebtoken');
require('dotenv').config();

//toDo: Done check -final commit- !
function isAuth(req, res, next) {
	try {
		// console.log("headers: ", req.headers); // Debug Line
		// console.log("body: ", req.body); // Debug Line
		const token = req.headers.authorization?.split(' ')[1];
		// console.log("token: ", token); //Debug Line
		if(token){
			const decodeToken = jwt.verify(token, process.env.TOKEN_SECRET);
			//console.log("token id: ",decodeToken); // Debug Line
			req.body.token = decodeToken;
		}
		next();
	} catch (error) {
		console.error('JWT verification error:', error.message);
		res.jsend.error({ statusCode: "error", message: 'you session have expired', result: "error!"});
    }
}
module.exports = isAuth;