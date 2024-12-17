var express = require('express');

var jsend = require('jsend');
const isAuth = require('../middleware/middleware');
var router = express.Router();
var db = require('../models');

var UsersService = require("../services/UsersService");
var usersService = new UsersService(db);

const RoleService = require('../services/RoleService');
var roleService = new RoleService(db);

const BrandService = require('../services/BrandService');
var brandService = new BrandService(db);

const ProductsService = require('../services/ProductsService');
var productsService = new ProductsService(db);

router.use(jsend.middleware);

function isValidateStringNotEmpty(strComp) {
    return (!strComp || /^\s*$/.test(strComp));
}


router.get('/', async function(req,res,next){
    /* 
		#swagger.tags = ['Brands']
	    #swagger.description = 'Get all Brands in the database'
        
		#swagger.responses[200] = { description: 'statusCode: 200, data: { result: "brands found", brands }' }
        
  	*/
    // console.log("Called GET /brands"); // ok
    const brands = await brandService.getAll();
    console.log("all brands: ", brands);
    return res.jsend.success({ statusCode: 200, data: { result: "brands found", brands }});  
});

router.post('/', isAuth, async function(req,res,next){
    /* 
		#swagger.tags = ['Brands']
	    #swagger.description = 'Admin can Add new Brand [requires: token]'
		#swagger.parameters['body'] =  {
    		"name": "body",
    		"in": "body",
			"required": "true",
      		"schema": {
        		$ref: "#/definitions/BrandPost",
					}
    	}
		#swagger.responses[200] = { description: 'statusCode: 200, result: { message: "New brand has been added to the database", input: brandName }'}
        #swagger.responses[500] = { description: 'statusCode: 500, result: { error: "Require brandName", input: brandName }'}
        #swagger.responses[403] = { description: 'statusCode: 403, result: { error: "Privileges Admin rights [Required] !!"}'}
        #swagger.responses[500] = { description: 'statusCode: 500, result: { error: "brandName allready exist", input: categoryName }'}
  	*/
    // console.log("Called GET /brands"); // ok
    
    const { brandName, token  } = req.body;

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

            if(isValidateStringNotEmpty(brandName)){
                return res.jsend.fail({"statusCode": 500, result: {error: "Require brandName", input: brandName }});
            }

            const existe_brand = await brandService.findOne(brandName);
            console.log("check exist brand: ", existe_brand);

            if(existe_brand){
                return res.jsend.fail({"statusCode": 500, result: {error: "brandName allready exist", input: brandName }});
            }

            const add_new_brand = await brandService.create(brandName);
            console.log("newBrand: ", add_new_brand);

            if(add_new_brand){
                return res.jsend.success({ statusCode: 200, result: { message: 'New brand has been added to the database', input: brandName }});
            }else{
                return res.jsend.fail({"statusCode": 500, result: {error: "something whent wrong!! on adding new brand", input: brandName }});   
            }
        }else{
            return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}}); 
        }
    }
    return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});
});

router.put('/', isAuth, async function(req,res,next){
    /* 
		#swagger.tags = ['Brands']
	    #swagger.description = 'Admin can update/change Brand with brandName, newBrandName [requires: token]'
		#swagger.parameters['body'] =  {
    		"name": "body",
    		"in": "body",
			"required": "true",
      		"schema": {
        		$ref: "#/definitions/BrandPut",
					}
    	}
		#swagger.responses[200] = { description: 'statusCode: 200, result: { message: "brandName has been updated", input: brandName }'}
        #swagger.responses[500] = { description: 'statusCode: 500, result: { error: "newbrandName exist, please choose a newBrandName", input: newBrandName }'}
        #swagger.responses[403] = { description: 'statusCode: 403, result: { error: "Privileges Admin rights [Required] !!"}'}
        #swagger.responses[500] = { description: 'statusCode: 500, result: { error: "brandName allready exist", input: categoryName }'}
  	*/
    // console.log("Called GET /brands"); // ok

    const {  brandName, newBrandName, token  } = req.body;

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
            
            if(isValidateStringNotEmpty(brandName)){
                return res.jsend.fail({"statusCode": 500, result: {error: "Require brandName", input: brandName }});
            }

            if(isValidateStringNotEmpty(newBrandName)){
                return res.jsend.fail({"statusCode": 500, result: {error: "Require newBrandName", input: newBrandName }});
            }

            const new_brand_name_exist = await brandService.findOne(newBrandName);
            console.log("check new brand name: ", new_brand_name_exist);

            /** We check if the new brand name exist in the database */
            if(new_brand_name_exist){
                return res.jsend.fail({"statusCode": 500, result: {error: "newbrandName exist, please choose a newBrandName", input: newBrandName }}); 
            }

            const existe_brand = await brandService.findOne(brandName);
            console.log("check exist brand: ", existe_brand);

            /** We check if the brandName exist in the database to be updated with the newBrandName */
            if(existe_brand){

                const update_existing_brand = await brandService.updateByName(brandName, newBrandName);
                console.log("update_existing_brand: ", update_existing_brand);

                return res.jsend.success({ statusCode: 200, result: { message: 'brandName has been updated' }});
            }else{
                return res.jsend.fail({"statusCode": 500, result: {error: "brandName don't exist", input: brandName }}); 
            }

        }else{
            return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});
        }
    }
    return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});
});

router.delete('/', isAuth, async function(req,res,next){
    /* 
		#swagger.tags = ['Brands']
	    #swagger.description = 'Admin can delete Brand with brandName [requires: token]'
        #swagger.parameters['body'] =  {
    		"name": "body",
    		"in": "body",
			"required": "true",
            "schema": {
        		$ref: "#/definitions/BrandDelete",
					}
    	}

		#swagger.responses[200] = { description: 'statusCode: 200, result: { message: "brandName has been deleted", input: brandName }' }
        #swagger.responses[404] = { description: 'statusCode: 500, result: { error: "brand dont exist in database", input: brandName }' }
        #swagger.responses[403] = { description: 'statusCode: 403, result: { error: "Privileges Admin rights [Required] !!"}'}
  	*/
    // console.log("Called GET /brands"); // ok

    const {  brandName, token  } = req.body;

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
        
            if(isValidateStringNotEmpty(brandName)){
                return res.jsend.fail({"statusCode": 500, result: {error: "Require brandName", input: brandName }});
            }
            
            const existe_brand = await brandService.findOne(brandName);
            //console.log("check exist brand: ", existe_brand);
            
            /** We check if the brandName exist */
            if(existe_brand){
                
                let brandId = existe_brand.dataValues.brandId;
                const brand_check_associated_with_product = await productsService.getAllProductsWithBrandId(brandId);
                console.log("brand_check_associated_with_product: ", brand_check_associated_with_product);

                /** We check if the brandName is associated with any products [restricted for deleting] */
                if(brand_check_associated_with_product.length > 0){
                    return res.jsend.fail({"statusCode": 500, result: {error: "brand is associated with products, restricted for delete", input: brandName }});  
                }

                const delete_brand = await brandService.delete(brandId, brandName);
                console.log("delete_brand: ", delete_brand);

                /** check if the update is ok, feedback */
                if(delete_brand){
                    return res.jsend.success({ statusCode: 200, result: { message: 'brandName has been deleted', input: brandName }});
                }else{
                    return res.jsend.fail({"statusCode": 500, result: {error: "something whent wrong!! on deleting brand", input: brandName }});  
                }
            }else{
                return res.jsend.fail({"statusCode": 404, result: {error: "brand dont exist in database", input: brandName }});  
            }
        }else{
            return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});
        }

    }
    return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});
    
});

module.exports = router;