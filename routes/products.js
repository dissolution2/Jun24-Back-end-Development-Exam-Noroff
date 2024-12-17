var express = require('express');
// var jwt = require('jsonwebtoken');
var jsend = require('jsend');
const isAuth = require('../middleware/middleware');
var router = express.Router();
var db = require('../models');
// var crypto = require('crypto')

const UsersService = require("../services/UsersService");
var usersService = new UsersService(db);

const ProductsService = require("../services/ProductsService");
var productsService = new ProductsService(db);

const RoleService = require('../services/RoleService');
var roleService = new RoleService(db);

const CategoryService = require('../services/CategoryService');
var categoryService = new CategoryService(db);

const BrandService = require('../services/BrandService');
var brandService = new BrandService(db);

router.use(jsend.middleware);

function isValidateStringNotEmpty(strComp) {
    return (!strComp || /^\s*$/.test(strComp));
}

/** a Simple url check on image (imgUrl) */
function isValidUrl(url) {
    return !/^http:\/\/[a-z]+[^ ]*\.(png|jpg|gif)$/i.test(url);
}



/*
POST /products (adding new products)
GET /products (getting all products)
PUT or PATCH/products (editing/changing a product)
DELETE /products (delete/remove a product)
*/

/* GET /products (getting all products) */
/* 
 1. Guest Users can only view products but not add items to a cart or purchase any products.

 2. Registered users can view items and add them to their cart to check out once they wish to purchase the cart items. 
  - this is done on post /cart as spessified on post /cart
*/
/** GetAll() no Auth */
/** A raw SQL query must be used to return the category and brand names in one object for the 
 * GET /products route that returns all the products */
router.get('/', async function(req,res,next){
    /* 
		#swagger.tags = ['Products']
	    #swagger.description = 'Guest, User or Admin, no restrictions. Can get all products'
        
		#swagger.responses[200] = { description: 'statusCode: 200, data: { result: "product found", products }' }
    */
    const products = await productsService.getAllRawSQL();
    // console.log("product raw sql: ", products); // debug line
    return res.jsend.success({ statusCode: 200, data: { result: "product found", products }});  

});

/* 'Extra' getOne product by productId no Auth by params */
router.get('/:productId', async function(req,res,next){
    /* 
		#swagger.tags = ['Products']
	    #swagger.description = 'User or Admin, no restrictions. Can get one product by Id'
       #swagger.parameters['productId'] =  {
    		"in": "path",
            "required": true,
            "type": "number"
        }
        #swagger.responses[200] = { description: 'statusCode: 200, data: { result: "product found", products }' }
        #swagger.responses[500] = { description: 'statusCode": 500, result: {error: "Require productId, Not a integer value", input: productId }'}
    */
    const productId = Number(req.params.productId);

    if(!Number.isInteger(productId) || Number(productId) === 0 ){
        return res.jsend.fail({"statusCode": 500, result: {error: "Require productId, Not a integer value", input: productId }});
    }

    const products = await productsService.getOneRawSQL(productId);
    return res.jsend.success({ statusCode: 200, data: { result: "product found", products }});  

});

/* POST /products (adding new products) */
/** Assume: ProductId - get the id from the next available in the database example productId 14 is the last entry. we qury and get next id to use  */
router.post('/', isAuth, async function(req,res,next){
    /* 
		#swagger.tags = ['Products']
	    #swagger.description = 'Admin can add new product: productName, description, quantity, price, discount, imgUrl, categoryId, brandId'
        #swagger.parameters['body'] =  {
    		"name": "body",
    		"in": "body",
			"required": "true",
            "schema": {
        		$ref: "#/definitions/ProductsPost",
					}
        }
		#swagger.responses[200] = { description: 'statusCode: 200, result: { message: "New product has been added to the database" }'}
        #swagger.responses[500] = { description: 'statusCode: 500, result: { error: "Require categoryId or brandId, not in database create new Category or Brand", input: categoryId or brandId }'}
        #swagger.responses[403] = { description: 'statusCode: 403, result: { error: "Privileges Admin rights [Required] !!"}'}
    */
    const { productName, description, quantity, price, discount, imgUrl, categoryId, brandId, token } = req.body;

    if(token){
        // Get userId
        const user = await usersService.getOneId(token.email);
        let userId = user.dataValues.userId;
        let roleId = user.dataValues.roleId;

        let convertedQuantity = Number(quantity);
        let convertedPrice = Number(price);
        let convertedDiscount = Number(discount);
        let convertedCategoryId = Number(categoryId);
        let convertedBrandId = Number(brandId);


        // console.log("user ", user); // Debug Line
        // console.log("userId: ", userId); // Debug Line
        // console.log("roleId: ", roleId); // Debug Line

        const check_role = await roleService.getUserPrivName(roleId);
        let checkPrive = check_role.dataValues.roleName;

        if(checkPrive === "Admin"){
            // console.log("we have admin rights"); // debug line
        
            if(isValidateStringNotEmpty(productName)){
                return res.jsend.fail({"statusCode": 500, result: {error: "Require productName", input: productName }});
            }

            if(isValidateStringNotEmpty(description)){
                return res.jsend.fail({"statusCode": 500, result: {error: "Require description", input: description }});
            }

            if(!Number.isInteger(convertedQuantity) || Number(convertedQuantity) === 0 ){
                return res.jsend.fail({"statusCode": 500, result: {error: "Require quantity, Not a integer value", input: quantity }});
            }

            if(!Number.isInteger(convertedPrice) || Number(convertedPrice) === 0 ){
                return res.jsend.fail({"statusCode": 500, result: {error: "Require price, Not a integer value", input: convertedPrice }});
            }

            if(!Number.isInteger(convertedDiscount)){
                return res.jsend.fail({"statusCode": 500, result: {error: "Require discount, Not a integer value", input: discount }});
            }

            if(isValidateStringNotEmpty(imgUrl)){
                return res.jsend.fail({"statusCode": 500, result: {error: "Require imgUrl", input: imgUrl }});
            }

            if(isValidUrl(imgUrl)){
                return res.jsend.fail({"statusCode": 500, result: {error: "Require valid url ?", input: imgUrl }});
            }

            if(!Number.isInteger(convertedCategoryId) || Number(convertedCategoryId) === 0 ){
                return res.jsend.fail({"statusCode": 500, result: {error: "Require categoryId, Not a integer value", input: categoryId }});
            }

            if(!Number.isInteger(convertedBrandId) || Number(convertedBrandId) === 0 ){
                return res.jsend.fail({"statusCode": 500, result: {error: "Require brandId, Not a integer value", input: brandId }});
            }

            /** CategoryId check */
            const check_categoryId = await categoryService.findOneById(convertedCategoryId);
            if(!check_categoryId){
                return res.jsend.fail({"statusCode": 500, result: {error: "Require categoryId, not in database create new Category or change it", input: categoryId }});
            }
            /** BrandId check */
            const check_brandId = await brandService.findOneById(convertedBrandId);
            if(!check_brandId){
                return res.jsend.fail({"statusCode": 500, result: {error: "Require brandId, Not in database create new Brand or change it", input: brandId }}); 
            }

            
            const nextId = await productsService.findNextIndex_Not_IN_USE();
            // console.log("productId nextId: ", nextId); // debug line
            // console.log("productId nextId: ", Number(nextId[0].NextId)); // debug line
            const productId = Number(nextId[0].NextId);

            const add_new_product = await productsService.create(
                productId, productName, description, convertedQuantity, convertedPrice, convertedDiscount, imgUrl, convertedCategoryId, convertedBrandId, 0
            );

            if(add_new_product){
                return res.jsend.success({ statusCode: 200, result: { message: 'New product has been added to the database' }});
            }

            return res.jsend.fail({"statusCode": 500, result: {error: "Error creating New product to the database... !!"}});
        }
        return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});
    }else{
        return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});
    }

});

/* PUT or PATCH/products (editing/changing a product) */
router.put('/', isAuth, async function(req,res,next){
    /* 
		#swagger.tags = ['Products']
	    #swagger.description = 'Admin can update/change product { productId, productName, description, quantity, price, discount, imgUrl, categoryId, brandId }'
        #swagger.parameters['body'] =  {
    		"name": "body",
    		"in": "body",
			"required": "true",
            "schema": {
        		$ref: "#/definitions/ProductsPut",
					}
        }
		#swagger.responses[200] = { description: 'statusCode: 200, result: { message: "Updated/Changed post", updateObject: { true/false on updateded values } }'}
        #swagger.responses[304] = { description: 'statusCode: 304, result: { message: "No Updated/Changed to post done", updateObject }'}
        #swagger.responses[403] = { description: 'statusCode: 403, result: { error: "Privileges Admin rights [Required] !!"}'}
    */
    const { productId, productName, description, quantity, price, discount, imgUrl, categoryId, brandId, token } = req.body;

    // console.log("productId: ",
    //     productId, " productName: ", productName, " description: ", description,
    //     " quantity: ", quantity, " price: ", price,
    //     " discount: ", discount, " imgUrl: ", imgUrl,
    //     " categoryId: ", categoryId, " brandId: ", brandId
    // ); // debug line

    // return res.jsend.fail({"statusCode": 500, result: { error: "test:", 
    //     productId: productId, 
    //     productName: productName, description: description,
    //     quantity: quantity, price: price, discount: discount,
    //     imgUrl: imgUrl, categoryId: categoryId, brandId: brandId
    //    }}); // break code return line

    let update_productName;
	let update_description;
    let update_quantity;
    let update_price;
    let update_discount;
    let update_imgUrl;
    let update_categoryId;
    let update_brandId;

	
	let update_productName_info = "false";
	let update_description_info = "false";
    let update_quantity_info = "false";
    let update_price_info = "false";
    let update_discount_info = "false";
    let update_imgUrl_info = "false";
    let update_categoryId_info = "false"
    let update_brandId_info = "false"

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

        if(checkPrive === "Admin"){
            console.log("we have admin rights");

            

            if(productId != null && productId !== 0 && Number(productId) ){


                const check_product_exist = await productsService.getOne(productId);

                if(!check_product_exist){
                    return res.jsend.fail({"statusCode": 500, result: {error: "ProductId don't Exist"}});
                }


                if(productName != null && productName !== "" && typeof productName !== 'undefined' ){ 
                    update_productName = await productsService.updateProductName(productId, productName);
                    //update_name = false; // Testing 
                    if(update_productName){
                        update_productName_info = "true";
                    }else{ 
                        update_productName_info = "fail"
                    }
                }
                if(description != null && description !== "" && typeof description !== 'undefined'){
                    update_description = await productsService.updateProductDescription(productId, description);
                    if(update_description){
                        update_description_info = "true";
                    }else{ 
                        update_description_info = "fail"
                    }
                }
                /** we dont want quanity to be negative exstra test */
                if(quantity != null && quantity !== "" && typeof quantity !== 'undefined'){
                    let convertQuvantity = Number(quantity);
                    
                    if(convertQuvantity !== 0  && convertQuvantity < 0){ 
                        update_quantity_info = "fail"
                    }else{
                        update_quantity = await productsService.updateProductQuantity(productId, quantity);
                        if(update_quantity){
                            update_quantity_info = "true";
                        }else{ 
                            update_quantity_info = "fail"
                        }
                    }
                } 

                if(price != null && price !== "" && typeof price !== 'undefined'){

                    if(!Number(price)){
                        update_price_info = "fail"
                    }else{

                        update_price = await productsService.updateProductPrice(productId, price);
                        if(update_price){
                            update_price_info = "true";
                        }else{ 
                            update_price_info = "fail"
                        }
                    }
                } 

                if(discount != null && discount !== "" && typeof discount !== 'undefined'){
                    /** we allow discount to be 0 */
                    if(discount !== 0 && !Number(discount)){
                        update_discount_info = "fail"
                    }else{
                        update_discount = await productsService.updateProductDiscount(productId, discount);
                        if(update_discount){
                            update_discount_info = "true";
                        }else{ 
                            update_discount_info = "fail"
                        }
                    }
                } 

                if(imgUrl != null && imgUrl !== "" && typeof imgUrl !== 'undefined'){
                    update_imgUrl = await productsService.updateProductImgUrl(productId, imgUrl);
                    if(update_imgUrl){
                        update_imgUrl_info = "true";
                    }else{ 
                        update_imgUrl_info = "fail"
                    }
                } 

                if(categoryId != null && categoryId !== "" && typeof categoryId !== 'undefined'){
                    /** this dose not take into if the product isdeleted !! check */
                    
                    if(!Number(categoryId)){
                        update_categoryId_info = "fail"
                    }else{
                    
                        const check_category = await categoryService.findOneById(categoryId);

                        if(check_category){
                            update_categoryId = await productsService.updateProductCategoryId(productId, categoryId);
                            if(update_categoryId){
                                update_categoryId_info = "true";
                            }else{ 
                                update_categoryId_info = "fail"
                            }
                        }else{
                            update_categoryId_info = "fail" // Category don't exist !!
                        }
                    }
                } 

                if(brandId != null && brandId !== "" && typeof brandId !== 'undefined'){
                    /** this dose not take into if the product isdeleted !! check */

                    if(!Number(brandId)){
                        update_brandId_info = "fail"
                    }else{

                        const check_brandId = await brandService.findOneById(brandId);

                        if(check_brandId){
                            update_brandId = await productsService.updateProductBrandId(productId, brandId);
                            if(update_brandId){
                                update_brandId_info = "true";
                            }else{ 
                                update_brandId_info = "fail"
                            }
                        }else{
                            update_brandId_info = "fail" // Category don't exist !!
                        }
                    }
                } 

            }else{
                return res.jsend.fail({"statusCode": 500, result: {error: "ProductId is required"}});
            }

            let updateObject = { 
                update_productName: update_productName_info,
	            update_description: update_description_info,
                update_quantity: update_quantity_info,
                update_price: update_price_info,
                update_discount: update_discount_info,
                update_imgUrl: update_imgUrl_info,
                update_categoryId: update_categoryId_info,
                update_brandId: update_brandId_info
            }

            if(update_productName || update_description || update_quantity || update_price || update_discount || update_imgUrl || update_categoryId || update_brandId ){
                return res.jsend.success({ statusCode: 200, result: { message: "Updated/Changed post", updateObject }});
            }else{
                // no update at all fail on every level ??
                // console.log("all fail or false on update"); // Debug line
    
                // All update is false or fails.. no update done!
                return res.jsend.fail({ statusCode: 304, result: { message: "No Updated/Changed to post done", updateObject }});
            }


        }
        return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});
    }else{
        return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});
    }

});
/* DELETE /products (delete/remove a product) */
/* Soft delete set product to isdeleted = 1 */
router.delete('/', isAuth, async function(req,res,next){
    /* 
		#swagger.tags = ['Products']
	    #swagger.description = 'Admin can sett product (softe deleted)'
        #swagger.parameters['body'] =  {
    		"name": "body",
    		"in": "body",
			"required": "true",
            "schema": {
        		$ref: "#/definitions/ProductsDeleted",
					}
        }
		#swagger.responses[200] = { description: 'statusCode: 200, result: { message: "Product has been set active(soft) in the database" }'}
        #swagger.responses[500] = { description: 'statusCode": 500, result: { error: "Error setting product active(soft undeleteing) product from the database... !!"}'}
        #swagger.responses[403] = { description: 'statusCode: 403, result: { error: "Privileges Admin rights [Required] !!"}'}
    */
    const { productId, isdeleted, token } = req.body;

    // console.log("Called /product/delete ");
    // console.log("Called productId: ", productId);
    // console.log("Called isdeleted: ", isdeleted);


    let convertedProductId = Number(productId);
    let convertedIsdeleted = Number(isdeleted);

    // console.log("Called ConV productId: ", convertedProductId); // Debug Line
    // console.log("Called ConV isdeleted: ", convertedIsdeleted); // Debug Line


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

        if(checkPrive === "Admin"){
            console.log("we have admin rights");

            // more of a PostMan test we need to convert string from web-api to number
            // productId is converted here
            if(!Number.isInteger(convertedProductId) || Number(convertedProductId) === 0 ){
                return res.jsend.fail({"statusCode": 500, result: {error: "Require productId, Not a integer value", input: productId }});
            }

            //  check-If isdelted then do soft_delete_product, or unDeleteProduct
            if(Number(convertedIsdeleted) == 1){
                const soft_delete_product = await productsService.soft_delete_product(convertedProductId);
                if(soft_delete_product){
                    return res.jsend.success({ statusCode: 200, result: { message: 'Product has been removed(soft) from the database' }});
                }{
                    return res.jsend.fail({"statusCode": 500, result: {error: "Error removing(soft deleteing) product from the database... !!"}});
                }
            }
            if(Number(convertedIsdeleted) == 0){

                const unDeleteProduct = await productsService.soft_unDelete_product(convertedProductId);
                if(unDeleteProduct){
                    return res.jsend.success({ statusCode: 200, result: { message: 'Product has been set active(soft) in the database' }});
                }else{
                    return res.jsend.fail({"statusCode": 500, result: {error: "Error setting product active(soft undeleteing) product from the database... !!"}});
                }
            }
            

        }else{
            return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});        
        }
        return res.jsend.fail({"statusCode": 500, result: {error: "Error removing or activating(soft) product on the database... !!"}});
    }else{
        return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});
    }
});
module.exports = router;