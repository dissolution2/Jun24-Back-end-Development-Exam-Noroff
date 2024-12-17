var express = require('express');
var jwt = require('jsonwebtoken');
var jsend = require('jsend');
const isAuth = require('../middleware/middleware');
var router = express.Router();
var db = require('../models');
var crypto = require('crypto')

const UsersService = require('../services/UsersService');
var usersService = new UsersService(db);

const RoleService = require('../services/RoleService');
var roleService = new RoleService(db);

const CategoryService = require('../services/CategoryService');
var categoryService = new CategoryService(db);

const ProductsService = require('../services/ProductsService');
var productsService = new ProductsService(db);

router.use(jsend.middleware);

function isValidateStringNotEmpty(strComp) {
    return (!strComp || /^\s*$/.test(strComp));
}


/**
 POST /categories (adding new categories)
GET /categories (getting all categories)
PUT or PATCH/categories (editing/changing a category)
DELETE /categories (delete/remove a category)
All CRUD operations for categories must be implemented:

Only Admins can change categories and assign or remove products from categories.
Anyone can view categories.
 */

router.get('/', async function(req,res,next){
    /* 
		#swagger.tags = ['Categories']
	    #swagger.description = 'Get all Categorys in the database'
        
		#swagger.responses[200] = { description: 'statusCode: 200, data: { result: "category found", category }' }
  	*/
    // console.log("Called GET /categories "); // Debug Line

    const categories = await categoryService.getAll();
    console.log("categories: ", categories); // debug line
    return res.jsend.success({ statusCode: 200, data: { result: "categories found", categories }});
    
})

router.post('/', isAuth, async function(req,res,next){
    /* 
		#swagger.tags = ['Categories']
	    #swagger.description = 'Admin can Add a Category to the database [requires: token]'
        #swagger.parameters['body'] =  {
    		"name": "body",
    		"in": "body",
			"required": "true",
            "schema": {
        		$ref: "#/definitions/CategoryPost",
					}
    	}
		#swagger.responses[200] = { description: 'statusCode: 200, result: { message: "New category has been added to the database", input: categoryName }' }
        #swagger.responses[403] = { description: 'statusCode: 401, result: {error: "Privileges Admin rights [Required] !!"}'}
        #swagger.responses[500] = { description: 'statusCode: 500, result: {error: "categoryName allready exist", input: categoryName }'}
  	*/
    // console.log("Called POST /categories "); // debug line

    const { categoryName, token  } = req.body;
    console.log("categoryName, token: ", categoryName, token); // debug line

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

            if(isValidateStringNotEmpty(categoryName)){
                return res.jsend.fail({"statusCode": 500, result: {error: "Require categoryName", input: categoryName }});
            }

            const existe_categoryName = await categoryService.findOne(categoryName);
            console.log("check exist brand: ", existe_categoryName); // debug line

            if(existe_categoryName){
                return res.jsend.fail({"statusCode": 500, result: {error: "categoryName allready exist", input: categoryName }});
            }

            const add_new_category = await categoryService.create(categoryName);
            console.log("newCategory: ", add_new_category); // debug line

            if(add_new_category){
                return res.jsend.success({ statusCode: 200, result: { message: 'New category has been added to the database', input: categoryName }});
            }else{
                return res.jsend.fail({"statusCode": 500, result: {error: "something whent wrong!! on adding new category", input: categoryName }});   
            }
        }else{
            return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});        
        }
    }
    return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});
    
})

router.put('/', isAuth, async function(req,res,next){
    /* 
		#swagger.tags = ['Categories']
	    #swagger.description = 'Update/Change a Category to the database'
        #swagger.parameters['body'] =  {
    		"name": "body",
    		"in": "body",
			"required": "true",
            "schema": {
        		$ref: "#/definitions/CategoryPut",
					}
    	}
		#swagger.responses[200] = { description: 'statusCode: 200, result: { message: "categoryName has been updated", input: newCategoryName }' }
        #swagger.responses[403] = { description: 'statusCode: 401, result: { error: "Privileges Admin rights [Required] !!"}'}
        #swagger.responses[500] = { description: 'statusCode: 500, result: { error: "categoryName dont exist", input: categoryName }'}
  	*/
    // console.log("Called PUT /categories "); // degu Line

    const {  categoryName, newCategoryName, token  } = req.body;

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
        
            if(isValidateStringNotEmpty(categoryName)){
                return res.jsend.fail({"statusCode": 500, result: {error: "Require categoryName", input: categoryName }});
            }

            if(isValidateStringNotEmpty(newCategoryName)){
                return res.jsend.fail({"statusCode": 500, result: {error: "Require newCategoryName", input: newCategoryName }});
            }

            const new_category_name_exist = await categoryService.findOne(newCategoryName);
            // console.log("check new category name: ", new_category_name_exist); // debug line

            /** We check if the new category name exist in the database */
            if(new_category_name_exist){
                return res.jsend.fail({"statusCode": 500, result: {error: "newCategoryName exist, please choose a newCategoryName", input: newCategoryName }}); 
            }

            const existe_category = await categoryService.findOne(categoryName);
            // console.log("check exist category: ", existe_category); // debug Line

            /** We check if the categoryName exist in the database to be updated with the newCategoryName */
            if(existe_category){

                const update_existing_category = await categoryService.updateByName(categoryName, newCategoryName);
                // console.log("update_existing_brand: ", update_existing_category); // debug line

                return res.jsend.success({ statusCode: 200, result: { message: 'categoryName has been updated', input: newCategoryName }});
            }else{
                return res.jsend.fail({"statusCode": 500, result: {error: "categoryName don't exist", input: categoryName }}); 
            }
        }else{
            return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});        
        }
    }
    return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});
});

router.delete('/', isAuth, async function(req,res,next){
    /* 
		#swagger.tags = ['Categories']
	    #swagger.description = 'Delete a Category from the database'
        #swagger.parameters['body'] =  {
    		"name": "body",
    		"in": "body",
			"required": "true",
            "schema": {
        		$ref: "#/definitions/CategoryDelete",
					}
    	}
		#swagger.responses[200] = { description: 'statusCode: 200, result: { message: "categoryName has been deleted", input: categoryName }' }
        #swagger.responses[403] = { description: 'statusCode: 403, result: { error: "Privileges Admin rights [Required] !!"}'}
        #swagger.responses[500] = { description: 'statusCode": 500, result: { error: "category is associated with products, restricted for delete", input: categoryName }'}
  	*/
    // console.log("Called DELETE /categories "); // debug line

    const {  categoryName, token  } = req.body;

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
        
            if(isValidateStringNotEmpty(categoryName)){
                return res.jsend.fail({"statusCode": 500, result: {error: "Require categoryName", input: categoryName }});
            }
            
            const existe_category = await categoryService.findOne(categoryName);
            // console.log("check exist categoryName: ", existe_category); // debug line
            
            /** We check if the categoryName exist */
            if(existe_category){
                let categoryId = existe_category.dataValues.categoryId;
                const category_check_associated_with_product = await productsService.getAllProductsWithCategoryId(categoryId);
                // console.log("category_check_associated_with_product: ", category_check_associated_with_product); // debug line

                /** We check if the categoryName is associated with any products [restricted for deleting] */
                if(category_check_associated_with_product.length > 0 ){
                    return res.jsend.fail({"statusCode": 500, result: {error: "category is associated with products, restricted for delete", input: categoryName }});  
                }
                
                    /** if check_associated is Larger then 0 then itsAssociated  */
                    const delete_category = await categoryService.delete(categoryId, categoryName);
                    // console.log("delete_category: ", delete_category); // debug line
                

                    /** check if the update is ok, feedback */
                    if(delete_category){
                        return res.jsend.success({ statusCode: 200, result: { message: 'categoryName has been deleted', input: categoryName }});
                    }else{
                        return res.jsend.fail({"statusCode": 500, result: {error: "something whent wrong!! on deleting category", input: categoryName }});  
                    }
                

            }else{
                return res.jsend.fail({"statusCode": 404, result: {error: "category dont exist in database", input: categoryName }});  
            }
        }else{
            return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});    
        }

    }
    return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});
    
});


module.exports = router;