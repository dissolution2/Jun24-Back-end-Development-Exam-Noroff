var express = require('express');
var jsend = require('jsend');
const isAuth = require('../middleware/middleware');
var router = express.Router();
var db = require('../models');
var crypto = require('crypto')

var UsersService = require("../services/UsersService");
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

/** getting all the product items that has been added 
 * to the cart for the current logged in users active cart 
 * (Cart that has not been checked out)) 
 * */
router.get('/', isAuth, async function(req,res,next){
    /* 
		#swagger.tags = ['Cart']
	    #swagger.description = 'Admin get all Cart (including: softe deleted) User Get her/his Cart in the database [requires: token]'
        
		#swagger.responses[200] = { description: 'statusCode: 200, data: { result: "product found", products }' }
        #swagger.responses[401] = { description: 'statusCode: 401, result: { error: "Privileges Admin or user rights [Required] !!"}' }
    */
    const { token } = req.body;
    
    if(token){

        // Get userId
        const user = await usersService.getOneId(token.email);
        let userId = user.dataValues.userId;
        let roleId = user.dataValues.roleId;
        // console.log("userId: ", userId); // Debug Line
        // console.log("roleId: ", roleId); // Debug Line

        const check_role = await roleService.getUserPrivName(roleId);
        let checkPrive = check_role.dataValues.roleName;

        if(checkPrive === "Admin"){
            // console.log("we have admin rights"); // debug line
            const products = await cartService.getAllAdmin(userId);
            return res.jsend.success({ statusCode: 200, data: { result: "product found", products }}); 

        }

        if(checkPrive === "User"){
            // console.log("we have User rights"); // debug line
            const products = await cartService.getAll(userId);
            return res.jsend.success({ statusCode: 200, data: { result: "product found", products }});  
        }
    }else{
        return res.jsend.fail({"statusCode": 401, result: {error: "Privileges Admin or user rights [Required] !!"}});
    }

});


/** Assume: we get productId and user action on quantity of product */
router.post('/', isAuth, async function(req,res,next){
    /* 
		#swagger.tags = ['Cart']
	    #swagger.description = 'User can Add proudcts to a Cart with productId, quantity [requires: token]'
		#swagger.parameters['body'] =  {
    		"name": "body",
    		"in": "body",
			"required": "true",
      		"schema": {
        		$ref: "#/definitions/CartPost",
					}
    	}
		#swagger.responses[200] = { description: 'statusCode: 200, result: { message: "product added to cart" }' }
        #swagger.responses[404] = { description: 'statusCode: 404, result: { error: "Product dont exist in database or quantity asked, larger then product is in stock", input: productId or quantity }'}
        #swagger.responses[401] = { description: '"statusCode": 401, result: { error: "Privileges Admin or user rights [Required] !!"} '}
  	*/

    const { productId, quantity, token } = req.body;
    //console.log("token: ", token); // debugg Line

    // console.log("productId: ", productId); // debugg Line
    // console.log("quantity: ", quantity); // debugg Line

    
    if(!Number.isInteger(productId) || Number(productId) === 0 ){
        return res.jsend.fail({"statusCode": 500, result: {error: "Require productId, Not a integer value", input: productId }});
    }

    if(!Number.isInteger(quantity) || Number(quantity) === 0 ){
        return res.jsend.fail({"statusCode": 500, result: {error: "Require quantity, Not a integer value", input: quantity }});
    }

    if(token){
        // Get userId
        const user = await usersService.getOneId(token.email);
        let userId = user.dataValues.userId;
        let memberId = user.dataValues.memberId;
        
        //let userMemberId = user.dataValues.
        //console.log("userId: ", userId); // Debug Line
        //console.log("memberId: ", memberId); // Debug Line

        //todo: check user discount value !!
        // todo: check user discount befor we add the discount value || how to check discount on total product line i would guess
        // todo: so in this case we would have a input for every product added !!
        
        /** getting member discount value from member status first from user = memberId, then from memberShip what that id status will give  */
        const discount_from_user = await memberShipService.getMemeberShipDiscountValue(memberId);
        //console.log("user discount: ", discount_from_user);
        let discount = discount_from_user.dataValues.discount;

        const product = await productsService.getOne(productId);
        //console.log("product add to cart: ", product);
        
        if(!product){
            return res.jsend.fail({"statusCode": 404, result: {error: "Product dont exist in database", input: productId }});
        }
        
        let price = product.dataValues.price;
        //let productQuantity = product.dataValues.quantity;
        //console.log("product: ", product);

        let product_quantity = product.dataValues.quantity;
        // console.log("product quantity: ", product_quantity, " asked q: ", quantity);
        
        // Check if user asked quantity is ok.
        if(product_quantity === 0 || product_quantity < quantity){
            // console.log("Quantity is Bad: not that many in stock! ", product_quantity, quantity);
            return res.jsend.fail({"statusCode": 404, result: {Quantity: "quantity asked, larger then product is in stock."}});
        }
        const cart_produt_exsits = await cartService.getOne(userId, productId);
        // console.log("test product_in_cart: ", cart_produt_exsits);


        /** check product exist and if total quantity exsides product quantity | if exisit and don't exside quantiy we update it */
        if(cart_produt_exsits){
             let cartProductQuantity = cart_produt_exsits.dataValues.quantity
            
             let sum = cartProductQuantity + quantity;
            
             //if(sum > productQuantity){
            /** check quantity asked is >= to what is available in stock */
            if(product_quantity >= quantity )    {
                //  console.log("Quantity is Bad: not that many in stock! ", product_quantity, quantity);
                // return res.jsend.fail({"statusCode": 404, result: {Quantity: "quantity asked, larger then product is in stock."}}); 
                
                const new_quantity = product_quantity - quantity;
                const prouct_quantity_update = await productsService.updateProductQuantity(productId,new_quantity);
                const update_cart = await cartService.updateCartProductQuantity(userId, productId, sum);

                // console.log("Update quantity: ", update_cart);
                return res.jsend.success({ statusCode: 200, result: { message: "product added to cart" }}); 
            }else{
                console.log("Quantity is Bad: not that many in stock! ", product_quantity, quantity);
                return res.jsend.fail({"statusCode": 404, result: {Quantity: "quantity asked, larger then product is in stock."}}); 
                
                // const update_cart = await cartService.updateCartProductQuantity(userId, productId, sum);
                // // console.log("Update quantity: ", update_cart);
                // return res.jsend.success({ statusCode: 200, result: { message: "product added to cart" }}); 
            }
        }
        /** if product don't exsist in cart we add it and update product quantity */
        const new_quantity = product_quantity - quantity;
        const prouct_quantity_update = await productsService.updateProductQuantity(productId,new_quantity);
        const cart = await cartService.create(userId,productId, quantity, price, discount);

        // console.log("test create cart: ", cart); // debug line
        return res.jsend.success({ statusCode: 200, result: { message: "product added to cart" }}); 
    }else{
        return res.jsend.fail({"statusCode": 401, result: {error: "Privileges Admin or user rights [Required] !!"}});
    }
});

/** POST /cart/checkout/now (to check out the users cart) Make an Order in the DB etc.. */
router.post('/checkout', isAuth, async function(req,res,next){
    /* 
		#swagger.tags = ['Cart']
	    #swagger.description = 'User can check out there cart, An Order is made of the proudcts in the Cart [requires: token]'
		#swagger.parameters['body'] = {
            "name": "body",
            "in": "body",
            "required": false,
            "schema": {
                "type": "object",
                "properties": {}
            }
        }
		#swagger.responses[200] = { description: 'statusCode: 200, data: { result: "Order created"}' }

        #swagger.responses[404] = { description: 'statusCode: 404, result: {error: "No product in cart" }'}
        #swagger.responses[403] = { description: 'statusCode: 401, result: {error: "Privileges Admin or user rights [Required] !!"}'}
  	*/
    const { token } = req.body;

    if(token){

        // Get userId
        const user = await usersService.getOneId(token.email);
        let userId = user.dataValues.userId;
        let membersShipId = user.dataValues.memberId;
        let orderDiscountId = membersShipId;
        console.log("userId: ", userId, " M.shipId: ", membersShipId); // Debug Line

        const products = await cartService.getAll(userId);
        console.log("products: ", products);
        if(!products.length > 0 ){
            return res.jsend.fail({"statusCode": 404, result: {error: "No product in cart" }}); 
        }
        
        const cartId = products[0].dataValues.id;
        // console.log("cartId: ", cartId); // debug line
        // console.log(products[0].dataValues.price); // debug line

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
        // console.log("member_discount: ", member_discount); // debug line


        //let discount_value = member_discount.dataValues.discount;
        // ? NB If Admin change | remove the lowest discount 0 we essensialy sett discount_id = 0;
        let discount_id;
        if(member_discount === null ){
            discount_id = 0;
        }else{
            discount_id = member_discount.dataValues.memberId;
        }
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

        const uuid = crypto.randomUUID().split("-"); // ordernumber uniq 8 char string
        for(let i=0; i < products.length;i++){
            
            await orderService.create(
                uuid[0],
                userId,
                products[i].dataValues.productId,orderDiscountId,cartId); // ? checkking that discountId is updated ?? 

            await cartService.softDeleteCart(userId,products[i].dataValues.productId);
            
            /** 
              // ? moved (remove / add quanity) on post add product to a cart, and on update cart !!
              // ! this updates product quntity at check out !! -Bug with this on two user buying same product and only one item remains 
              // ! when order goes out we have then sold -1 item  !!
             */

            // let qunatityBouth = products[i].dataValues.quantity;
            // const qunatityOfproduct = await productsService.getOne(products[i].dataValues.productId);
            // let newQunatityOfProduct = qunatityOfproduct.dataValues.quantity - qunatityBouth;
            
            // // console.log("qunatityOfproduct: ", qunatityOfproduct.dataValues.quantity); // debug line
            // // console.log("qunatityBouth: ", qunatityBouth); // debug line
            // // console.log("newQuantityOfProduct: ", newQunatityOfProduct); // debug line
            // if(newQunatityOfProduct === 0){
            //     newQunatityOfProduct = 0;
            // }
            // await productsService.updateProductQuantity(products[i].dataValues.productId,newQunatityOfProduct);
        }
        return res.jsend.success({ statusCode: 200, data: { result: "Order created"}});  

    }else{
        return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin or user rights [Required] !!"}});
    }
    

});

/** PUT or PATCH /cart (editing/changing a cart product item quantity ) */
/** Assume: if quantity is sett to 0 / cero we remove it from the cart */
router.put('/', isAuth, async function(req,res,next){
    /* 
		#swagger.tags = ['Cart']
	    #swagger.description = 'User can update/remove products set in the cart [requires: token]'
		#swagger.parameters['body'] =  {
    		"name": "body",
    		"in": "body",
			"required": "true",
      		"schema": {
        		$ref: "#/definitions/CartPut",
					}
    	}
		#swagger.responses[200] = { description: 'statusCode: 200, data: { result: "product removed from cart or product quantity updated to cart"}' }

        #swagger.responses[404] = { description: 'statusCode: 404, result: {error: ""Product dont exist in cart", input: productId }'}
        #swagger.responses[401] = { description: 'statusCode: 401, result: {error: "Privileges Admin or user rights [Required] !!"}'}
  	*/
    const { productId , quantity, token } = req.body;

    if(token){

        if(!Number.isInteger(productId) || Number(productId) === 0 ){
            //console.log("test: return fail");
            return res.jsend.fail({"statusCode": 500, result: {error: "Require productId, Not a integer value", input: productId }});
        }
    
        // Assume: if quantity is === 0 then the product should be removed from the cart
        if(!Number.isInteger(quantity)){
            return res.jsend.fail({"statusCode": 500, result: {error: "Require quantity, Not a integer value", input: quantity }});
        }
        
        // Get userId
        const user = await usersService.getOneId(token.email);
        let userId = user.dataValues.userId;
        console.log("userId: ", userId); // Debug Line

        // check if product exist ?
        const cart_produt_exsits = await cartService.getOne(userId, productId);
        //console.log("test product_in_cart: ", cart_produt_exsits);

        /** check product exist and if total quantity exsides product quantity | if exisit and don't exside quantiy we update it */
        if(!cart_produt_exsits){
            return res.jsend.fail({"statusCode": 404, result: {error: "Product dont exist in cart", input: productId }});
        }


        /** get the quantity and add it back to product quantity */
        const get_cart_product_quantity = await cartService.getOne(userId, productId);
        console.log("test cart product quantity: ", get_cart_product_quantity.dataValues.quantity);
        let cart_product_quantity = get_cart_product_quantity.dataValues.quantity;
        
        let get_product_quantity = await productsService.getOne(productId);
        console.log("test product quantity: ", get_product_quantity.dataValues.quantity);
        let product_quantity =  get_product_quantity.dataValues.quantity;
        
        let update_new_quantity = 0;
        if(quantity === 0 ){
            
            update_new_quantity = Number(cart_product_quantity) + Number(product_quantity);
            console.log("new prouct qua: ", Number(update_new_quantity));

            const update_quantiy_add = await productsService.updateProductQuantity(productId,update_new_quantity);
            console.log("update_quantiy_add: ", update_quantiy_add);
            
            const remove_item = await cartService.removeItemZeroQuantity(userId, productId);
            // console.log("remove_item: ", remove_item); // Debug Line
            return res.jsend.success({ statusCode: 200, result: { message: "product removed from cart" }});  
        }else{

            /** check if qunatity is ok */
            let sum_quantity_cart_pluss_prouctQuantity_left = product_quantity + cart_product_quantity;
            if(sum_quantity_cart_pluss_prouctQuantity_left >= quantity){

                /** when updating quantity we check the amount in cart and what is available of quantity in product */
                update_new_quantity = sum_quantity_cart_pluss_prouctQuantity_left - quantity;

                const update_quantiy_remove = await productsService.updateProductQuantity(productId,update_new_quantity);
                console.log("update_quantiy_remove: ", update_quantiy_remove);

                const update_cart = await cartService.updateCartProductQuantity(userId, productId, quantity);
                // console.log("Update quantity: ", update_cart); // Debug Line
                return res.jsend.success({ statusCode: 200, result: { message: "product quantity updated to cart" }}); 
            }else{
                return res.jsend.fail({"statusCode": 404, result: {error: "Not enough Proudct quantity in stock"}});
            }
        }
    }else{
        return res.jsend.fail({"statusCode": 401, result: {error: "Privileges Admin rights [Required] !!"}});
    }
});

/** DELETE /cart (delete/remove a product item from the current logged in users active cart) */
router.delete('/', isAuth, async function(req,res,next){
    /* 
		#swagger.tags = ['Cart']
	    #swagger.description = 'User can remove products set in the cart [requires: token]'
		#swagger.parameters['body'] =  {
    		"name": "body",
    		"in": "body",
			"required": "true",
      		"schema": {
        		$ref: "#/definitions/CartDelete",
					}
    	}
		#swagger.responses[200] = { description: 'statusCode: 200, data: { result: "product removed from cart"}' }

        #swagger.responses[404] = { description: 'statusCode: 404, result: {error: ""Product dont exist in cart", input: productId }'}
        #swagger.responses[401] = { description: 'statusCode: 401, result: {error: "Privileges Admin or user rights [Required] !!"}'}
        #swagger.responses[401] = { description: 'statusCode: 500, result: {error: "Require productId, Not a integer value", input: productId }'}
  	*/
    const { productId, token } = req.body;
    // console.log("call delete /cart: ", productId, token); // Debug line

    if(token){

        if(!Number.isInteger(productId) || Number(productId) === 0 ){
            //console.log("test: return fail");
            return res.jsend.fail({"statusCode": 500, result: {error: "Require productId, Not a integer value", input: productId }});
        }

        // Get userId
        const user = await usersService.getOneId(token.email);
        let userId = user.dataValues.userId;
        console.log("userId: ", userId); // Debug Line

        // check if product exist ?
        const cart_produt_exsits = await cartService.getOne(userId, productId);
        console.log("test product_in_cart: ", cart_produt_exsits);
        let removed_item_quantity = cart_produt_exsits.quantity;//.dataValues.quantity;

        /** check product exist and if total quantity exsides product quantity | if exisit and don't exside quantiy we update it */
        if(!cart_produt_exsits){
            return res.jsend.fail({"statusCode": 404, result: {error: "Product dont exist in cart", input: productId }});
        }
        
        const remove_item = await cartService.removeItemZeroQuantity(userId, productId);
        // console.log("remove_item: ", remove_item); // Debug Line

        const get_product_quantity = await productsService.getOne(productId);
        let product_quantity = get_product_quantity.dataValues.quantity;
        
        let update_product_quantity = Number(removed_item_quantity) + Number(product_quantity);

        const add_product_quantity = await productsService.updateProductQuantity(productId,update_product_quantity);
        // console.log("add_product_quantity: ", add_product_quantity); // debug Line
        return res.jsend.success({ statusCode: 200, result: { message: "product removed from cart" }});  
    }else{
        return res.jsend.fail({"statusCode": 401, result: {error: "Privileges Admin rights [Required] !!"}});
    }
});

module.exports = router;