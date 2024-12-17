var express = require('express');
var jsend = require('jsend');
const isAuth = require('../middleware/middleware');
var router = express.Router();
var db = require('../models');
var crypto = require('crypto')

const UsersService = require('../services/UsersService');
var usersService = new UsersService(db);

const RoleService = require('../services/RoleService');
var roleService = new RoleService(db);

const CartService = require('../services/CartService');
var cartService = new CartService(db);

const ProductsService = require('../services/ProductsService');
var productsService = new ProductsService(db);

const OrderService = require('../services/OrdersService');
var orderService = new OrderService(db);

const MemberShipService = require('../services/MemberShipService');
var memberShipService = new MemberShipService(db);

const UserDiscountLogg = require('../services/UserDiscountLoggService');
var userDiscountLogg = new UserDiscountLogg(db);

router.use(jsend.middleware);

function isValidateStringNotEmpty(strComp) {
    return (!strComp || /^\s*$/.test(strComp));
}

function isValidEmail(email) {
	const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
	if(!regex.test(email)){
	  return false;
	}else{
	  return true;
	}
  }

/** GET /orders (getting all orders for the logged in user OR all orders for all users if an admin user is logged in) */
router.get('/', isAuth, async function(req,res,next){ 
    /* 
		#swagger.tags = ['Order']
	    #swagger.description = 'Admin get all orders, User get her/his orders [token required]'
        
		#swagger.responses[200] = { description: 'statusCode: 200, data: { orders: "Orders found", orders }'}
        #swagger.responses[403] = { description: 'statusCode: 403, result: {error: "Privileges Admin or user rights [Required] !!"}'}
    */

    const { token } = req.body;
    // console.log("Called GET /orders"); // debug line


    if(token){

        // Get userId
        const user = await usersService.getOneId(token.email);
        let userId = user.dataValues.userId;
        let roleId = user.dataValues.roleId;

        // console.log("user ", user); // Debug Line
        // console.log("userId: ", userId); // Debug Line
        // console.log("roleId: ", roleId); // Debug Line

        const check_role = await roleService.getUserPrivName(roleId);
        let checkPrive = check_role.dataValues.roleName;

        /** We get all Orders As Admin */
        if(checkPrive === "Admin"){
            //console.log("we have admin rights");
            const orders = await orderService.getAllRawSQLByOrderOfAdmin();
            // console.log("Grupped the order by user: ", orders); // debug Line

            let listProducts = [];
            let orderProductList = [];
            for(let i=0; i < orders.length;i++){
                if(orders[i] !== null ){
                    orderProductList.push(orders[i].productItemIds);
                }
            }
            
            //console.log("proudctsList test_list: ", orderProductList);
            let splitList = orderProductList.flatMap(item => item.split(','));
            let uniqList = [...new Set(splitList)];
            // console.log("uniqTest: ", uniqList);
            /** 
               proudctsList test_list:  [ '1', '10,14', '10', '1' ]
               uniqTest:  [ '1', '10', '14' ]
             */
            for(let i=0; i < uniqList.length;i++){
                const product = await productsService.getOneByIdAllStatus(uniqList[i]);
                listProducts.push(product);
            }
            return res.jsend.success({ statusCode: 200, data: { orders: "Orders found", orders, listProducts }}); 
        }
        /** We get all Orders of the logged in User  */
        if(checkPrive === "User"){
            // console.log("we have user rights"); // debug line

            const orders = await orderService.getAllRawSQLByOrderOfUser(userId);
            // console.log("test gruped the order by user: ",orders); // debut line
            return res.jsend.success({ statusCode: 200, data: { orders: "Orders found", orders }}); 
        }
        return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin or user rights [Required] !!"}});
    }else{
        return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin or user rights [Required] !!"}});
    }

});

/** PUT or PATCH/order (changing an order status admin only) */
router.put('/', isAuth, async function(req,res,next){ // , 
    /* 
		#swagger.tags = ['Order']
	    #swagger.description = 'Admin update/change order status [token required]'
        #swagger.parameters['body'] =  {
    		"name": "body",
    		"in": "body",
			"required": "true",
            "schema": {
        		$ref: "#/definitions/OrderPut",
					}
        }
		#swagger.responses[200] = { description: 'statusCode: 200, data: { result: "Orders to be updated", updateOrderList, orderList }'}
        #swagger.responses[500] = { description: 'statusCode: 500, result: { error: "Require statusId, Not a integer value, value between 1 - 3", input: statusId }'}
        #swagger.responses[403] = { description: 'statusCode: 403, result: {error: "Privileges Admin or user rights [Required] !!"}'}
    */
    const { orderNumber, statusId, token } = req.body;
    // console.log("Called GET /orders: orderNumber: ", orderNumber, " statusId: ", statusId); // debug line
    let convertedStatusId = Number(statusId);

    if(token){

        // Get userId
        const user = await usersService.getOneId(token.email);
        let userId = user.dataValues.userId;
        let roleId = user.dataValues.roleId;

        // console.log("user ", user); // Debug Line
        // console.log("userId: ", userId); // Debug Line
        // console.log("roleId: ", roleId); // Debug Line

        const check_role = await roleService.getUserPrivName(roleId);
        let checkPrive = check_role.dataValues.roleName;

        /** We get all Orders As Admin */
        if(checkPrive === "Admin"){
            // console.log("we have admin rights"); // debug line

            if(isValidateStringNotEmpty(orderNumber)){
                return res.jsend.fail({"statusCode": 500, result: {error: "Require orderNumber", input: orderNumber }});
            }

            if(!Number.isInteger(convertedStatusId) || Number(convertedStatusId) < 1 || Number(convertedStatusId) > 3 ){
                return res.jsend.fail({"statusCode": 500, result: {error: "Require statusId, Not a integer value, value between 1 - 3", input: statusId }});
            }
            
            const updateOrderList = await orderService.updateAdminOrderStatus(orderNumber, statusId);
            // console.log("Updated: ", updateOrderList); // debug line

            const orderList = await orderService.getOneByOrderNumber(orderNumber);
            // console.log("admin_test_put Check what this is again ?: ",orderList); // debug line

            return res.jsend.success({ statusCode: 200, data: { result: "Orders to be updated", updateOrderList, orderList }}); 
        }
        return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});
    }else{
        return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});
    }
});


/** All tables that are created must have CRUD endpoinst */
/** Assume: we are making DELETE route but should not be used!! Orders have status to be followed.  */
/** Assume: But if an order is canceled i se this can be used, but should have a record of it !! [Not inplemented] in Admin front end*/
router.delete('/', isAuth, async function(req,res,next){
    /*   
		#swagger.tags = ['Order']
        #swagger.description = 'Admin can delete a Order by OrderNumber (All tables that are created must have CRUD endpoints)'
        #swagger.parameters['body'] =  {
    		"name": "body",
    		"in": "body",
			"required": "true",
            "schema": {
        		$ref: "#/definitions/OrderDelete",
					}
        }
        #swagger.responses[200] = { description: 'statusCode": 200, data: { result: "Order deleted from database"}'}
        #swagger.responses[404] = { description: 'statusCode": 404 data: { error: "OrderNumber not found", input: orderNumber }'}
        #swagger.responses[500] = { description: 'statusCode": 500, result: {error: "Require orderNumber", input: orderNumber }'}
        #swagger.responses[403] = { description: 'statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}'}

    */
    const { orderNumber, token } = req.body;
    // console.log("Called DELETE /orders: orderNumber: ", orderNumber); // debug line
    
    if(token){

        const admin_user = await usersService.getOneId(token.email);
        let roleId = admin_user.dataValues.roleId;

        const check_role = await roleService.getUserPrivName(roleId);
        let checkPrive = check_role.dataValues.roleName;

        // We get all Orders As Admin 
        if(checkPrive === "Admin"){
            console.log("we have admin rights");

            if(isValidateStringNotEmpty(orderNumber)){
                return res.jsend.fail({"statusCode": 500, result: {error: "Require orderNumber", input: orderNumber }});
            }

            const delete_order = await orderService.delete(orderNumber);
            if(delete_order){
                return res.jsend.success({ statusCode: 200, data: { result: "Order deleted from database"}});  
            }
            return res.jsend.fail({"statusCode": 404, result: {error: "OrderNumber not found", input: orderNumber }});

        }
        return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});
    }else{
        return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}}); 
    }
});


/** All tables that are created must have CRUD endpoints. */
/** Main application Order is generated with Cart /checkout as instructed, so this is extra because All tables... CRUD etc */
/** It will work as /cart/checkout except -userInput is User Email and Admin Token check */
/** Checks user 'email' inputed by admin if user has a cart, then that cart is turned into an Order  */
router.post('/', isAuth, async function(req,res,next){
    /* 
		#swagger.tags = ['Order']
	    #swagger.description = 'Admin can change a cart to an Order. -Orders are usally Made throue /cart/checkout !! extra !!'
        #swagger.parameters['body'] =  {
    		"name": "body",
    		"in": "body",
			"required": "true",
            "schema": {
        		$ref: "#/definitions/OrderPost",
					}
        }
		#swagger.responses[200] = { description: 'statusCode: 200, data: { result: "Order created"}'}
        #swagger.responses[500] = { description: 'statusCode: 500, result: { email: "Email is required, check format."}'}
        #swagger.responses[403] = { description: 'statusCode: 403, result: {error: "Privileges Admin rights [Required] !!"}'}
        #swagger.responses[404] = { description: 'statusCode: 404, result: {error: "No product in cart" }'}
    */
const { userEmail, token} = req.body;

    /** As Order is usally created in cart /checkout we only give Admin this rights here!!*/
    if(token){

        if(isValidateStringNotEmpty(userEmail)){
            return res.jsend.fail({"statusCode": 500, result: {error: "UserEmail is required" }}); 
        }

        if(!isValidEmail(userEmail)){
            return res.jsend.fail({"statusCode": 500, result: {email: "Email is required, check format."}});
        }

        const admin_user = await usersService.getOneId(token.email);
        let roleId = admin_user.dataValues.roleId;

        const check_role = await roleService.getUserPrivName(roleId);
        let checkPrive = check_role.dataValues.roleName;

        if(checkPrive === "Admin"){
            // console.log("we have admin rights"); // debug line
            // Get userId
            const user = await usersService.getOneId(userEmail);

            let userId = user.dataValues.userId;
            let membersShipId = user.dataValues.memberId;
            let orderDiscountId = membersShipId;
            // console.log("userId: ", userId, " M.shipId: ", membersShipId); // Debug Line

            const products = await cartService.getAll(userId);
            // console.log("products: ", products); // debug line
            if(!products.length > 0){
                return res.jsend.fail({"statusCode": 404, result: {error: "No product in cart" }});  
            }
            
            const cartId = products[0].dataValues.id;
            // console.log("cartId: ", cartId); // debug line

            /** get user Discount history */
            /** if not exist create it */
            const check_user_discount_exist = await userDiscountLogg.checkExits(userId);

            if(!check_user_discount_exist){
                const create_history = await userDiscountLogg.create(userId,0);
                // console.log("created history: ", create_history); // debug line
            }

            /** get user bouth history count  */
            const user_history_logg = await userDiscountLogg.getHistoryDiscount(userId);
            let discount_history = user_history_logg.dataValues.historyPurchures;
            // console.log("discount_history: ", discount_history); // debug line


            // ? NB Befor we make the order, Should User get any discount !!
            /** Checks user discount history up agains memberShip Discount */
            const member_discount = await memberShipService.checkDiscount(discount_history);
            //let discount_value = member_discount.dataValues.discount;
            let discount_id = member_discount.dataValues.memberId;
            
            
            // console.log("member_discount: ", member_discount); // we get 0, 15 or 30 ? and we use memberShipId to use.
            /** check 1 - 2 - 3 */
            if(membersShipId < discount_id){
            
                const update_user_discount_id = await usersService.updateUserDiscountId(userId,discount_id);
                // console.log("user memberShip id change to: ", update_user_discount_id); // debug line
                orderDiscountId = discount_id;
            }
            
            //console.log("check product length: ", products.length);
            
            /** update user history count */
            let countProudcts = 0;
            for(let c=0; c < products.length;c++){
                countProudcts += products[c].dataValues.quantity;
            }

            let sumHistory = discount_history + countProudcts;
            const updateHistory = await userDiscountLogg.update(userId, sumHistory);
            // console.log("updateHistory purchuses: ", updateHistory); // debug line
            // console.log("countProudcts: ", countProudcts); // debug line

            // todo: need to update all the products quantity !!
            const uuid = crypto.randomUUID().split("-"); // ordernumber uniq 8 char string
            for(let i=0; i < products.length;i++){
                
                await orderService.create(
                    uuid[0],
                    userId,
                    products[i].dataValues.productId,orderDiscountId,cartId); // ? checkking that discountId is updated ?? 

                await cartService.softDeleteCart(userId,products[i].dataValues.productId);
                let qunatityBouth = products[i].dataValues.quantity;
                const qunatityOfproduct = await productsService.getOne(products[i].dataValues.productId);
                let newQunatityOfProduct = qunatityOfproduct.dataValues.quantity - qunatityBouth;
                
                // console.log("qunatityOfproduct: ", qunatityOfproduct.dataValues.quantity); // debug line
                // console.log("qunatityBouth: ", qunatityBouth); // debug line
                // console.log("newQuantityOfProduct: ", newQunatityOfProduct); // debug line
                if(newQunatityOfProduct === 0){
                    newQunatityOfProduct = 0;
                }
                await productsService.updateProductQuantity(products[i].dataValues.productId,newQunatityOfProduct);
            }
            // todo: change to correct message to front end !!
            return res.jsend.success({ statusCode: 200, data: { result: "Order created"}});  
        }
        // end admin Check
        return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});
    }else{
        return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});
    }



});

module.exports = router;