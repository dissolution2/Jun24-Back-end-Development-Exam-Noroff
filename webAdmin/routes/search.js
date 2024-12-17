var express = require('express');
var jsend = require('jsend');
var router = express.Router();
router.use(jsend.middleware);

function isValidateStringNotEmpty(strComp) {
    return (!strComp || /^\s*$/.test(strComp));
}

router.post('/', function(req,res,next){

    const { productName, category, brand } = req.body;
    const token = req.session.token;
    
    let value = 0;
    let resultQ;
        
    // console.log("productName from search: ", productName); // debug line
    // console.log("categoryName from search: ", category);// debug line
    // console.log("brandName from search: ", brand);// debug line
    // console.log("token: ", token);// debug line

    if(token){
        let categoryName =""
        let brandName ="";
        if (typeof category !== 'undefined') {
            categoryName = category; 
        }
        if (typeof brand !== 'undefined') {
            brandName = brand; 
        }

        if(productName  == "" && category == "empty" && brand == "empty"){
            // console.log("productName = \"\" category == empty brand == empty test 4"); // debug line
            /** no search to do: no paramaters input call refresh on categoryDropDown and BrandDropDown info to user Admin Empty input !! */ 

            const url_category = 'http://localhost:3000/categories';
            const url_brands = 'http://localhost:3000/brands';
            
            const fetch_CategoryWithPromise = fetch(url_category, { method: 'GET', headers: {
                'Authorization': `Bearer ${token}`
                }}).then(response => response.json());
            const fetch_BrandsWithPromise = fetch(url_brands, { method: 'GET', headers: {
                'Authorization': `Bearer ${token}`
                }}).then(response => response.json());

            Promise.all([fetch_CategoryWithPromise, fetch_BrandsWithPromise])
            .then(([callback_category,calback_brands]) => {

                
                // console.log("category: ", callback_category); // debug line
                // console.log("brands: ", calback_brands); // debug line

                // console.log("category.length: ", callback_category.data.data.categories.length); // debug line
                const DataCategory = callback_category.data.data.categories;
                // console.log("DataCategory: ", DataCategory); // debug line

                // console.log("brands.length: ", calback_brands.data.data.brands.length); // debug line
                const DataBrands = calback_brands.data.data.brands;
                // console.log("DataBrands: ", DataBrands); // debug line

                // let value = 1;
                // let resultQ;
                value = 1;
                resultQ = { "Message": "No Search input....!! "};

                return res.render('products', { DataProduct: null, DataCategory: DataCategory, DataBrands: DataBrands, resultQ: resultQ, popup: { value } });

            }).catch(err => {

                console.log("err: ", err);
                value = 1;
                resultQ = { message: "Error, something whent wrong!!: ", err };
                return res.render('products', { DataProduct: null, DataCategory: null, DataBrands: null, resultQ: resultQ, popup: { value } });
    
            });
            
        }else{
/** Here we call the search if there is paramaters to search ON */
        
            const url_products = 'http://localhost:3000/search';

            let url_data = new URLSearchParams();
            url_data.append(`productName`, productName);
            url_data.append(`categoryName`, categoryName);
            url_data.append(`brandName`, brandName);
            
            const option = {
                method: `POST`,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: url_data
            };

            const url_category = 'http://localhost:3000/categories';
            const url_brands = 'http://localhost:3000/brands';
            
            const fetch_ProductWithPromise = fetch(url_products, option ).then(response => response.json());

            const fetch_CategoryWithPromise = fetch(url_category, { method: 'GET', headers: {
                'Authorization': `Bearer ${token}`
                }}).then(response => response.json());
            const fetch_BrandsWithPromise = fetch(url_brands, { method: 'GET', headers: {
                'Authorization': `Bearer ${token}`
                }}).then(response => response.json());

            Promise.all([fetch_ProductWithPromise, fetch_CategoryWithPromise, fetch_BrandsWithPromise])
            .then(([calback_product,callback_category,calback_brands]) => {

                let value = 0;
                let resultQ;

                // console.log("product: ", calback_product); // debug line
                // console.log("category: ", callback_category); // debug line
                // console.log("brands: ", calback_brands);// debug line

                // console.log("category.length: ", callback_category.data.data.categories.length); // debug line
                const DataCategory = callback_category.data.data.categories;
                // console.log("DataCategory: ", DataCategory); // debug line

                // console.log("brands.length: ", calback_brands.data.data.brands.length); // debug line
                const DataBrands = calback_brands.data.data.brands;
                // console.log("DataBrands: ", DataBrands); // debug line

                // console.log("products.length: ", calback_product.data.data.products.length); // debug line
                const DataProduct = calback_product.data.data.products;
                // console.log("DataProduct: ", DataProduct); // debug line
                
                res.render('products', { DataProduct: DataProduct, DataCategory: DataCategory, DataBrands: DataBrands, resultQ: resultQ, popup: { value } });

            }).catch(err => {

                console.log("err: ", err);
                value = 1;
                resultQ = { message: "Error, something whent wrong!!: ", err };
                return res.render('products', { DataProduct: null, DataCategory: null, DataBrands: null, resultQ: resultQ, popup: { value } });

            });
        }

    }else{
        // test only
        //return res.jsend.fail({"statusCode": 500, result: {error: "Privileges Admin rights [Required] !!"}});
        value = 1;
        resultQ = { message: "Session or Admin rights required!!"};
        res.render('index', { resultQ: resultQ, popup: { value } });
    } 

});


module.exports = router;