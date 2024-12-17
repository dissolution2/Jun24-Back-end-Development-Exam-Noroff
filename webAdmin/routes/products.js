var express = require('express');
var jsend = require('jsend'); // for postman testing
// const { token } = require('morgan');
var router = express.Router();
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
    
    const token = req.session.token;
    // console.log("token..: ", token); // debug line
    let value = 0;
    let resultQ;
    if(token){
    
        const url_products = 'http://localhost:3000/products';
        const url_category = 'http://localhost:3000/categories';
        const url_brands = 'http://localhost:3000/brands';
        
        const fetch_ProductWithPromise = fetch(url_products, { method: 'GET', headers: {
            'Authorization': `Bearer ${token}`
            } }).then(response => response.json());
        const fetch_CategoryWithPromise = fetch(url_category, { method: 'GET', headers: {
            'Authorization': `Bearer ${token}`
            }}).then(response => response.json());
        const fetch_BrandsWithPromise = fetch(url_brands, { method: 'GET', headers: {
            'Authorization': `Bearer ${token}`
            }}).then(response => response.json());

        Promise.all([fetch_ProductWithPromise, fetch_CategoryWithPromise, fetch_BrandsWithPromise])
        .then(([calback_product,callback_category,calback_brands]) => {

            // console.log("product: ", calback_product);
            // console.log("category: ", callback_category);
            // console.log("brands: ", calback_brands);

            // console.log("category.length: ", callback_category.data.data.categories.length); // debug line
            const DataCategory = callback_category.data.data.categories;
            // console.log("DataCategory: ", DataCategory); // debug line

            // console.log("brands.length: ", calback_brands.data.data.brands.length); // debug line
            const DataBrands = calback_brands.data.data.brands;
            // console.log("DataBrands: ", DataBrands); // debug line

            // console.log("products.length: ", calback_product.data.data.products.length); // debug line
            const DataProduct = calback_product.data.data.products;
            // console.log("DataProduct: ", DataProduct); // debug line

            
            // testing form window module etc... popup etc...
            //res.render('products', { DataProduct: DataProduct, DataCategory: DataCategory, DataBrands: DataBrands, resultQ: resultQ, popup: { value } });
            res.render('products', { DataProduct: DataProduct, DataCategory: DataCategory, DataBrands: DataBrands, resultQ: resultQ, popup: { value } });

        }).catch(err => {

            value = 1;
            resultQ = { message: "Error, something whent wrong!!: ", err };
            console.log("err: ", err);
            res.render('products', { DataProduct: null, DataCategory: null, DataBrands: null, resultQ: resultQ, popup: { value } });
        });


    }else{
        //return res.jsend.success({ statusCode: 200, data: { result: "Token expired !! Called GET /products" }}); 
        value = 1;
        resultQ = { message: "Session or Admin rights required!!"};
        res.render('index', { resultQ: resultQ, popup: { value } });
    }

    
    
    // need to send error or in catch error yeas !! 
});

/* 'Extra' getOne product by productId no Auth by params */
// wont implemnet this on this side!!!
// router.get('/:productId', async function(req,res,next){
//     const productId = Number(req.params.productId);
// });


router.post('/add', async function(req,res,next){
    
    const { productName, description, quantity, price, discount, imgUrl, categoryIdDropDown, brandIdDropDown } = req.body;
    // console.log("post Called /products/add"); // debug line
    // console.log("productName ", productName,
    // " description: ", description,
    // " quantity: ", quantity,
    // " price: ", price,
    // " discount: ", discount,
    // " imgUrl: ", imgUrl,
    // " categoryIdDropDown: ", categoryIdDropDown,
    // " brandIdDropDown: ", brandIdDropDown ); // debug line

    let isdeleted = 0;

    const token = req.session.token;

    if(token){
        let value = 0;
        let resultQ;

        const url_products = 'http://localhost:3000/products';
        const url_category = 'http://localhost:3000/categories';
        const url_brands = 'http://localhost:3000/brands';


        let url_data = new URLSearchParams();
        url_data.append(`productName`, productName);
        url_data.append(`description`, description);
        url_data.append(`quantity`,  quantity);
        url_data.append(`price`, price);
        url_data.append(`discount`, discount);
        url_data.append(`imgUrl`, imgUrl);
        // url_data.append(`categoryId`, categoryId);
        url_data.append(`categoryId`, categoryIdDropDown);
        // url_data.append(`brandId`, brandId);
        url_data.append(`brandId`, brandIdDropDown);
        url_data.append(`isdeleted`, isdeleted);

        const option = {
            method: `POST`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: url_data
        };

        fetch(url_products, option)
        .then(response => response.json())
        .then(async calback_newProduct => {
            value = 1;
            resultQ = calback_newProduct;

          // After the product is successfully updated, fetch other data
          const fetch_ProductWithPromise = fetch(url_products, { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } }).then(response => response.json());
          const fetch_CategoryWithPromise = fetch(url_category, { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } }).then(response => response.json());
          const fetch_BrandsWithPromise = fetch(url_brands, { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } }).then(response => response.json());
      
          const [calback_product, callback_category, calback_brands] = await Promise.all([fetch_ProductWithPromise, fetch_CategoryWithPromise, fetch_BrandsWithPromise]);
            // Process fetched data
            //   console.log("product: ", calback_product);
            //   console.log("category: ", callback_category);
            //   console.log("brands: ", calback_brands);
            //console.log("category.length: ", callback_category.data.data.categories.length);
            const DataCategory = callback_category.data.data.categories;
            //console.log("DataCategory: ", DataCategory);
            //console.log("brands.length: ", calback_brands.data.data.brands.length);
            const DataBrands = calback_brands.data.data.brands;
            //console.log("DataBrands: ", DataBrands);
            //console.log("products.length: ", calback_product.data.data.products.length);
            const DataProduct = calback_product.data.data.products;
            //console.log("DataProduct: ", DataProduct);
            // Render the page with fetched data
            res.render('products', { DataProduct: DataProduct, DataCategory: DataCategory, DataBrands: DataBrands, resultQ: resultQ, popup: { value } });
        })
        .catch(err => {
          console.log("Error: ", err);
          // Handle errors
          value = 1;
          resultQ = { message: "Error, something whent wrong!!: ", err };
          res.render('products', { DataProduct: null, DataCategory: null, DataBrands: null, resultQ: resultQ, popup: { value } });
        });


    }else{
        value = 1;
        resultQ = { message: "Session or Admin rights required!!"};
        res.render('index', { resultQ: resultQ, popup: { value } });
    }

});

/* POST /products (adding new products) */
/** Assume: ProductId - get the id from the next available in the database example productId 14 is the last entry. we qury and get next id to use  */
router.post('/delete', async function(req,res,next){

    const { isdeletedId, isdeleted} = req.body;
    
    // console.log("post Called /products/deleted") // debug line
    // console.log("test input isdeletedId: ", 
    // isdeletedId, " isdeleted: ", isdeleted ); // debug line

    let isdeletedValue = Number(isdeleted);
    let value = 0;
    let resultQ;

    
    if(isdeleted === 1 || isdeleted === "1"){
        console.log("we delete the product");
        isdeletedValue = 1;
    }

    if(isdeleted === null || isdeleted === "" || typeof isdeleted === 'undefined' || isdeleted === "0"){
        console.log("we sett the product active");
        isdeletedValue = 0;
    }

    const token = req.session.token;

    if(token){

        // console.log("Admin is here, "); // debug line
        
        const url_products = 'http://localhost:3000/products';
        const url_category = 'http://localhost:3000/categories';
        const url_brands = 'http://localhost:3000/brands';

        let url_data = new URLSearchParams();
        url_data.append(`productId`, isdeletedId);
        url_data.append(`isdeleted`, isdeletedValue);

        const option = {
            method: `DELETE`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: url_data
        };


        fetch(url_products, option)
        .then(response => response.json())
        .then(async calback_Delete => {

            resultQ = calback_Delete;

          // After the product is successfully updated, fetch other data
          const fetch_ProductWithPromise = fetch(url_products, { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } }).then(response => response.json());
          const fetch_CategoryWithPromise = fetch(url_category, { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } }).then(response => response.json());
          const fetch_BrandsWithPromise = fetch(url_brands, { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } }).then(response => response.json());
      
          const [calback_product, callback_category, calback_brands] = await Promise.all([fetch_ProductWithPromise, fetch_CategoryWithPromise, fetch_BrandsWithPromise]);
            // Process fetched data
            //   console.log("product: ", calback_product);
            //   console.log("category: ", callback_category);
            //   console.log("brands: ", calback_brands);
            //console.log("category.length: ", callback_category.data.data.categories.length);
            const DataCategory = callback_category.data.data.categories;
            //console.log("DataCategory: ", DataCategory);
            //console.log("brands.length: ", calback_brands.data.data.brands.length);
            const DataBrands = calback_brands.data.data.brands;
            //console.log("DataBrands: ", DataBrands);
            //console.log("products.length: ", calback_product.data.data.products.length);
            const DataProduct = calback_product.data.data.products;
            //console.log("DataProduct: ", DataProduct);
            // Render the page with fetched data
            res.render('products', { DataProduct: DataProduct, DataCategory: DataCategory, DataBrands: DataBrands, resultQ: resultQ, popup: { value } });
        })
        .catch(err => {
          console.log("Error: ", err);
          // Handle errors
          value = 1;
          resultQ = { message: "Error, something whent wrong!!: ", err };
          res.render('products', { DataProduct: null, DataCategory: null, DataBrands: null, resultQ: resultQ, popup: { value } });
        });

    }else{
        value = 1;
        resultQ = { message: "Session or Admin rights required!!"};
        res.render('index', { resultQ: resultQ, popup: { value } });
    }
    

});

/** call api-put  */
router.post('/update', async function(req,res,next){


    // const { id, pname, description, quantity, price, discount, imgUrl, categoryId, categoryIdDropDownUpdate, brandId, brandIdDropDownUpdate } = req.body;
    const { id, pname, description, quantity, price, discount, imgUrl, categoryIdDropDownUpdate, brandIdDropDownUpdate } = req.body;
    let productName = pname;
    
    
    //  console.log("test input: ",
    //  id, " productName: ", productName, " description: ", description,
    //  " quantity: ", quantity, " price: ", price, " discount: ", discount,
    //  " imgUrl: ", imgUrl, 
    //  " categoryIdDropDownUpdate: ", categoryIdDropDownUpdate,
    //  " brandIdDropDownUpdate: ", brandIdDropDownUpdate  ); // debug line

    // console.log("post Called /products/update"); // debug line 

    const token = req.session.token;

    if(productName === null || productName === ""){
        productName = "";
    }

    if(token){

        // console.log("Admin is here, "); // debug line
        let value = 0;
        let resultQ;


        //const url_products_update = 'http://localhost:3000/products';

        const url_products = 'http://localhost:3000/products';
        const url_category = 'http://localhost:3000/categories';
        const url_brands = 'http://localhost:3000/brands';

        let url_data = new URLSearchParams();
        url_data.append(`productId`, id);
        url_data.append(`productName`, productName);
        url_data.append(`description`, description);
        url_data.append(`quantity`,  quantity);
        url_data.append(`price`, price);
        url_data.append(`discount`, discount);
        url_data.append(`imgUrl`, imgUrl);
        url_data.append(`categoryId`, categoryIdDropDownUpdate);
        url_data.append(`brandId`, brandIdDropDownUpdate);

        const option = {
            method: `PUT`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: url_data
        };

        

        /** Do the update of the product be for we retrive back products, category, brands to the product page */
        fetch(url_products, option)
        .then(response => response.json())
        .then(async calback_Update => {

            value = 1;
            resultQ = calback_Update;

          // After the product is successfully updated, fetch other data
          const fetch_ProductWithPromise = fetch(url_products, { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } }).then(response => response.json());
          const fetch_CategoryWithPromise = fetch(url_category, { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } }).then(response => response.json());
          const fetch_BrandsWithPromise = fetch(url_brands, { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } }).then(response => response.json());
      
          const [calback_product, callback_category, calback_brands] = await Promise.all([fetch_ProductWithPromise, fetch_CategoryWithPromise, fetch_BrandsWithPromise]);
            // Process fetched data
            //   console.log("product: ", calback_product);
            //   console.log("category: ", callback_category);
            //   console.log("brands: ", calback_brands);
            //console.log("category.length: ", callback_category.data.data.categories.length);
            const DataCategory = callback_category.data.data.categories;
            //console.log("DataCategory: ", DataCategory);
            //console.log("brands.length: ", calback_brands.data.data.brands.length);
            const DataBrands = calback_brands.data.data.brands;
            //console.log("DataBrands: ", DataBrands);
            //console.log("products.length: ", calback_product.data.data.products.length);
            const DataProduct = calback_product.data.data.products;
            //console.log("DataProduct: ", DataProduct);
            // Render the page with fetched data
            res.render('products', { DataProduct: DataProduct, DataCategory: DataCategory, DataBrands: DataBrands, resultQ: resultQ, popup: { value } });
        })
        .catch(err => {
          console.log("Error: ", err);
          // Handle errors
          value = 1;
          resultQ = { message: "Error, something whent wrong!!: ", err };
          res.render('products', { DataProduct: null, DataCategory: null, DataBrands: null, resultQ: resultQ, popup: { value } });
        });

    }else{
        value = 1;
        resultQ = { message: "Session or Admin rights required!!"};
        res.render('index', { resultQ: resultQ, popup: { value } });
    }
});

module.exports = router;