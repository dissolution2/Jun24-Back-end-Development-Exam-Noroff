require('dotenv').config();
var express = require('express');
var jsend = require('jsend');
var crypto = require('crypto')
const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');


// var jsend = require('jsend');

var db = require('../models');

/** Product & Category & Brand */
var ProductsService = require("../services/ProductsService");
var productsService = new ProductsService(db);
var BrandService = require("../services/BrandService");
var brandService = new BrandService(db);
var CategoryService = require("../services/CategoryService");
var categoryService = new CategoryService(db);
var StatusService = require("../services/StatusService");
var statusService = new StatusService(db);


/** User & Role & MemberShip */
var UsersService = require("../services/UsersService");
var usersService = new UsersService(db);
var RoleService = require("../services/RoleService");
var roleService = new RoleService(db);
var MemberShipService = require("../services/MemberShipService");
var memberShipService = new MemberShipService(db);

var router = express.Router();
router.use(jsend.middleware);

let class_list =[];
class api_class_data{
    
    constructor(brand, category, date_added,
         description, id, imgurl,
        name, price, quantity){
            this.brand = brand;
            this.category = category;
            this.date_added = date_added;
            this.description = description;
            this.id = id;
            this.imgurl = imgurl;
            this.name = name;
            this.price = price;
            this.quantity = quantity;
        }
    
        getBrand(){
            return this.brand;
        }
    
        getCategory(){
            return this.category;
        }
    
        getDateAdded(){
            return this.date_added;
        }

        getDescription(){
            return this.description;
        }

        getId(){
            return this.id;
        }

        getImgUrl(){
            return this.imgurl;
        }

        getName(){
            return this.name;
        }

        getPrice(){
            return this.price;
        }

        getQuantity(){
            return this.quantity;
        }
}

router.post('/', async function(req, res, next) {
    /* 
		#swagger.tags = ['Init']
	    #swagger.description = ''
        #swagger.parameters['body'] = {
            "name": "body",
            "in": "body",
            "required": false,
            "schema": {
                "type": "object",
                "properties": {}
            }
        }
		#swagger.responses[200] = { description: 'statusCode: 200, result: { message: "Database synchronized, Admin Created and Tables: Role, MemberShip, Status Value default updated"}'}
        #swagger.responses[500] = { description: 'statusCode": 500, result: {error: "Error setting the database... !!"}'}
    */
    // console.log("Call post /init"); //Debug Line
    
    db.sequelize.sync({ force: false })
    .then(() => {
        console.log('Tables are synchronized.');
        let sync_run = 0; // if database is allready synced and Tables been populated 'return response Database is allready sync... etc
    
        // check if database is populated return json message if so.
        async function initDB(){
            
            const innsertValuesCeck = await sequelize.query(
                `SELECT * FROM examen.Role;`
                , { type: QueryTypes.SELECT });
            
                
            if(innsertValuesCeck.length == 0){
                sync_run = 1; // if database are setting up the Values to the tables return response 'Database Created with Admin user...etc

                /** NB there are to fue INSERT, any larger we would make .json file and read them inn!! */
                await roleService.create('Admin');
                await roleService.create('User');

                await memberShipService.create(1,'Bronze',0);
                await memberShipService.create(2,'Silver',15);
                await memberShipService.create(3,'Gold',30);

                
                await statusService.create(1,'In Progress');
                await statusService.create(2,'Ordered');
                await statusService.create(3,'Completed');

                async function settAdmin(){
                var password ="P@ssword2023"
                var salt = crypto.randomBytes(16);
                    crypto.pbkdf2(password, salt, 310000, 32, 'sha256', function(error, hashedPassword){
                        if(error){
                            return next(error);
                        }
                        async function run_admin_db(hashedPassword, salt){
                            const admin_user = await usersService.create(1,1,"Admin","Support","Admin","Online",911,"admin@noroff.no",hashedPassword,salt);
                            // console.log("test admin_create: ", admin_user); // Debug Line
                        }
                        run_admin_db(hashedPassword,salt);
                    });
                }
                settAdmin();

                const api_url = 'http://backend.restapi.co.za/items/products'

                async function getRestapiProducts(api_url) {
                    // Storing response
                    try {
                        const response = await fetch(api_url);
                        show(await response.text());
                    } catch (error) {
                        console.log("api error ", error);
                    }
                }

                getRestapiProducts(api_url);

                async function show(data) {
                    let myJson = JSON.parse(data);
                    //console.log("test api: ", myJson);

                    for(let i=0; i < myJson.data.length;i++){
                        class_list.push(
                            new api_class_data(
                                myJson.data[i].brand,
                                myJson.data[i].category,
                                myJson.data[i].date_added,
                                myJson.data[i].description,
                                myJson.data[i].id,
                                myJson.data[i].imgurl,
                                myJson.data[i].name,
                                myJson.data[i].price,
                                myJson.data[i].quantity
                            ));
                    }
                
                    for(let i=0; i < class_list.length;i++){ 
                        /** Debug Lines */
                        // console.log('create new Product: '); 
                        // console.log('id: ', class_list[i].getId() );
                        // console.log('name: ', class_list[i].getName());
                        // console.log('description: ', class_list[i].getDescription());
                        // console.log('quantity: ', class_list[i].getQuantity());
                        // console.log('price: ', class_list[i].getPrice());
                        // console.log('discount: ', 0);
                        // console.log('imgUrl: ', class_list[i].getImgUrl());
                        // console.log('dateAdded: ', class_list[i].getDateAdded());
                        // console.log('categoryId: ',i+1);
                        // console.log('brandId: ', i+1);
                        // console.log('isdeleted: ', 0);

                        // console.log('create new Brand: ', JSON.parse(JSON.stringify(await brandService.create(i+1,myJson.data[i].brand))));
                        // console.log('create new Category: ', JSON.parse(JSON.stringify(await categoryService.create(i+1,myJson.data[i].category))));

                        let check_brand = await brandService.findOne(class_list[i].getBrand());
                        //console.log("Check brandName test: ", check_brand);

                        
                        if(check_brand == null){
                            await brandService.create(class_list[i].getBrand());
                        }

                        let check_category = await categoryService.findOne(class_list[i].getCategory());
                        // console.log("Check brandName test: ", check_category); // Debug Line 
                        
                        if(check_category == null){
                            await categoryService.create(class_list[i].getCategory());
                        }

                        /** get brandId where name = brand(name)  usage: when we crate a Product from api */
                        let brand_id = JSON.parse(JSON.stringify(await brandService.getId(class_list[i].getBrand())));
                        // console.log("brand_id: ", brand_id[0].brandId); // Debug Line [ { brandId: 1 } ]
                        
                        /** get categoryId where name = category(name)  usage: when we crate a Product from api */
                        let category_id = JSON.parse(JSON.stringify(await categoryService.getId(class_list[i].getCategory())));
                        //console.log("category_id: ", category_id[0].categoryId); // Debug Line [ { categoryId: 3 } ]

                        // first 0 = discount , second 0 = isdeleted
                        await productsService.create(
                            class_list[i].getId(),
                            class_list[i].getName(),
                            class_list[i].getDescription(),
                            class_list[i].getQuantity(),
                            class_list[i].getPrice(),
                            0,
                            class_list[i].getImgUrl(),
                            //class_list[i].getDateAdded(), have createdAt // timestamp: true, but keap for now like this just in case!
                            category_id[0].categoryId,
                            brand_id[0].brandId,
                            0
                        );
                    }
                }
            }
        } 
        initDB().then(() =>{
            /** returns the response */
            if(sync_run === 1){
                return res.jsend.success({ statusCode: 200, result: { message: 'Database synchronized, Admin Created and Tables: Role, MemberShip, Status Value default updated' }});
            }else{
                return res.jsend.success({ statusCode: 200, result: { message: 'Database is allready synchronized.. change force to true if needed to re-initialize the database!!' }});
            }
        });
    }).catch((err)=>{
        console.log("error initDB: ", err); // Debug Line
        return res.jsend.fail({"statusCode": 500, result: {error: "Error setting the database... !!"}});
    });
});
  
module.exports = router;

