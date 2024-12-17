var express = require('express');
var jsend = require('jsend');
const isAuth = require('../middleware/middleware');
var router = express.Router();
var db = require('../models');


// const UsersService = require('../services/UsersService');
// var usersService = new UsersService(db);

const ProductsService = require('../services/ProductsService');
var productsService = new ProductsService(db);

const CategoryService = require('../services/CategoryService');
var categoryService = new CategoryService(db);

const BrandService = require('../services/BrandService');
var brandService = new BrandService(db);


router.use(jsend.middleware);

function isValidateStringNotEmpty(strComp) {
    return (!strComp || /^\s*$/.test(strComp));
}

/**
 * This endpoint is used to search for records in the database. Results should be returned as a JSON object.

The search endpoint should as a minimum be able to:

// todo: done!!
1. Search for a partial product name 
    NB!! (it does not need to be the full product name)

// todo: done!!
2. Search for a product with a specific category name - 
   * The result should be all the products for the searched category.

// todo: done!!
3. Search for a product with a specific brand name - 
   * The result should be all the products for the searched brand.

NB!! The searches must be done with raw SQL queries. No ORM search functionality can be used for search queries other than the query method.

NB!! The search results should return the items found in the result object, as well as the number of records found.

 */
router.post('/', isAuth, async function(req,res,next){
    /* 
		#swagger.tags = ['Search']
	    #swagger.description = | 'Any user can Search. Admin can Search (Webadmin) or User/guest on example a (Product webpage) on partial product name example: {"product": "a", "categoryName": "", "brandName": ""} <br>
        Search only on category: {"product": "", "categoryName": "TVs", "brandName": "" } <br>
        Search only on brand: {"product": "", "categoryName": "", "brandName": "Samsung"}' <br>
        
        #swagger.parameters['body'] =  {
    		"name": "body",
    		"in": "body",
			"required": "true",
            "schema": {
        		$ref: "#/definitions/Search",
                }
        }
		#swagger.responses[200] = { description: 'statusCode: 200, data: { result: "product found", products, count: products.length }' }
        #swagger.responses[500] = { description: 'statusCode: 500, result: {error: "Require productName or categoryName or brandName", productName: productName, categoryName: categoryName, brandName: brandName }'}
    */

    // console.log("Called POST productName (partsials... ) /search"); // ok
    // const { productName } = req.params.productName;
    const { productName, categoryName, brandName, token } = req.body;
    // console.log("/search api productName: ", productName); // debug line
    // console.log("/search api categoryName: ", categoryName); // debug line
    // console.log("/search api brandName: ", brandName); // debug line

    // if(token){
// // todo: 1.
        if(!isValidateStringNotEmpty(productName)){

            /** Searhing with '%' */
            const products = await productsService.searchAllPartRawSQL(productName);
            // console.log("search_product_partName: ", products);
            if(products){
                return res.jsend.success({ statusCode: 200, data: { result: "product found", products, count: products.length }});  
            }else{
                return res.jsend.fail({"statusCode": 500, result: {error: "Error something whent wrong!!"}});  
            }
        }
// // todo: 2.
        if(categoryName !== "empty" && !isValidateStringNotEmpty(categoryName)){
            // console.log("we test on categoryName"); // debug line
            /** Raw SQL */
            const get_categoryId = await categoryService.getId(categoryName);
            // console.log("get categoryId: ", get_categoryId); // debug line

            if(get_categoryId.length > 0){
                let categoryId = Number(get_categoryId[0].categoryId);
                // console.log("categoryId: ", categoryId); // debug line

                /** Raw SQL */
                const products = await productsService.searchAllProductsWithCategoryId(categoryId);
                // console.log("products On Category: ", products); // debug line
                /** returns 0 if no proudct is found with that categoryId, returns product if found */
                return res.jsend.success({statusCode: 200, data: { result: "product found", products, count: products.length }});

                /** this is just a fail safe, the Category are send pre listed from DB from Webpage drop down List,
                 *  but if tested with postman or othere api should return a response */
            }else if(get_categoryId.length === 0){
                return res.jsend.fail({"statusCode": 404, result: {error: "Error no categoryName in the database... !!"}});
            }
        }
// // todo: 3.
        if(brandName !== "empty" && !isValidateStringNotEmpty(brandName)){
            // console.log("we test on brandName"); // debug line
            
            /** Raw SQL */
            const get_brandId = await brandService.getId(brandName);
            // console.log("get brandId: ", get_brandId); // debug line

            if(get_brandId.length > 0){
                let brandId = Number(get_brandId[0].brandId);
                // console.log("brandId: ", brandId); // debug line
                
                /** Raw SQL */
                const products = await productsService.searchAllProductsWithBrandId(brandId);
                // console.log("products On Brands: ", products); // debug line
                /** returns 0 if no proudct is found with that brandId, returns product if found */
                return res.jsend.success({statusCode: 200, data: { result: "product found", products, count: products.length }});

                /** this is just a fail safe, the Brands are send pre listed from DB from Webpage drop down List,
                 *  but if tested with postman or othere api should return a response */
            }else if(get_brandId.length === 0){
                return res.jsend.fail({"statusCode": 404, result: {error: "Error no brandName in the database... !!"}});
            }
        }

        if(isValidateStringNotEmpty(productName) && isValidateStringNotEmpty(categoryName) && isValidateStringNotEmpty(brandName)){
            return res.jsend.fail({"statusCode": 500, result: {error: "Require productName or categoryName or brandName", productName: productName, categoryName: categoryName, brandName: brandName }});  
        }

    // }
    // return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights or User [Required] !!"}});



});

module.exports = router;