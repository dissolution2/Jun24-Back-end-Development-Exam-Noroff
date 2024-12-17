var express = require('express');
var jsend = require('jsend'); // test postman
var router = express.Router();
router.use(jsend.middleware); // test postman


/**
 * POST /categories (adding new categories)
GET /categories (getting all categories)
PUT or PATCH/categories (editing/changing a category)
DELETE /categories (delete/remove a category)
 */
router.get('/', function(req,res,next){
    
    const token = req.session.token;
    let value = 0;
    let resultQ;
    

    if(token){
      // console.log("token..: ", token); // Debug Line
      
      fetch('http://localhost:3000/brands', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(response => response.json())
        .then(callback_brands => {
          // Handle the response data
          // console.log(callback_brands); // debug line
          const DataBrands = callback_brands.data.data.brands;

          res.render('brands', { DataBrands: DataBrands, resultQ: resultQ, popup: { value } });

        })
        .catch(err => {
          // Handle errors
          console.log("Error: ", err);
          value = 1;
          resultQ = { message: "Error, something whent wrong!!: ", err };
          res.render('brands', { DataBrands: null, resultQ: resultQ, popup: { value } });
        });
    }else{
      value = 1;
    resultQ = { message: "Session or Admin rights required!!"};
    res.render('index', { resultQ: resultQ, popup: { value } });
    }
});


router.post('/delete', function(req,res,next){
    
  const { deleteId, brandNameDelete } = req.body;

  // console.log("deleteId: ", deleteId); // debug line
  // console.log("brandNameDelete: ", brandNameDelete); // debug line

  const token = req.session.token;
  // console.log("token..: ", token);
  let value = 1;
  let resultQ;
  let brandName = brandNameDelete;
  if(token){
  
    const url_brands_delete = 'http://localhost:3000/brands';
    const url_brands = 'http://localhost:3000/brands';

    let url_data = new URLSearchParams();
        url_data.append(`brandName`, brandName);
        
        const option = {
            method: `DELETE`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: url_data
        }; 

        fetch(url_brands_delete, option)
        .then(response => response.json())
        .then(async callback_delete => {

          // console.log("callback_delete: ", callback_delete); // debug line
          resultQ = callback_delete;

          const fetch_BrandsWithPromise = fetch(url_brands, { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } }).then(response => response.json());
          
          const [callback_brands] = await Promise.all([fetch_BrandsWithPromise]);
            
          const DataBrands = callback_brands.data.data.brands;
          
            // console.log("DataBrands: ", DataBrands); // debug line
            // Render the page with fetched data
            res.render('brands', { DataBrands: DataBrands, resultQ: resultQ, popup: { value } });
        })
        .catch(err => {
          console.log("Error: ", err);
          value = 1;
          resultQ = { message: "Error, something whent wrong!!: ", err };
          res.render('brands', { DataBrands: null, resultQ: resultQ, popup: { value } });
        });
  }else{
    value = 1;
    resultQ = { message: "Session or Admin rights required!!"};
    res.render('index', { resultQ: resultQ, popup: { value } });
  }
});

router.post('/add', function(req,res,next){
    
  const { brandNameAdd  } = req.body;

  // console.log("brandNameAdd: ", brandNameAdd); // debug line
  
  const token = req.session.token;
  if(token){
  
    const url_brands_add = 'http://localhost:3000/brands';
    const url_brands = 'http://localhost:3000/brands';

    let url_data = new URLSearchParams();
        url_data.append(`brandName`, brandNameAdd);
        const option = {
            method: `POST`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: url_data
        }; 

        fetch(url_brands_add, option)
        .then(response => response.json())
        .then(async callback_add_new => {

          // console.log("callback_add_new: ", callback_add_new); // debug line
          let value = 1;
          let resultQ;
          resultQ = callback_add_new;

          const fetch_BrandsWithPromise = fetch(url_brands, { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } }).then(response => response.json());
          
          const [callback_brands] = await Promise.all([fetch_BrandsWithPromise]);
            
          const DataBrands = callback_brands.data.data.brands;
          
            // console.log("DataBrands: ", DataBrands); // debug line
            // Render the page with fetched data
            res.render('brands', { DataBrands: DataBrands, resultQ: resultQ, popup: { value } });
        })
        .catch(err => {
          console.log("Error: ", err);
          value = 1;
          resultQ = { message: "Error, something whent wrong!!: ", err };
          res.render('brands', { DataBrands: null, resultQ: resultQ, popup: { value } });
        });
  }else{
    value = 1;
    resultQ = { message: "Session or Admin rights required!!"};
    res.render('index', { resultQ: resultQ, popup: { value } });
  }
  
});

router.post('/update', function(req,res,next){
    
  const { updateId, brandName, newBrandName } = req.body;

  // console.log("updateId: ", updateId); // debug line
  // console.log("brandName: ", brandName); // debug line
  // console.log("newBrandName: ", newBrandName); // debug line
  const token = req.session.token;
  // console.log("token..: ", token);

  if(token){
  
    const url_brands_update = 'http://localhost:3000/brands';
    const url_brands = 'http://localhost:3000/brands';

    let url_data = new URLSearchParams();
        url_data.append(`brandName`, brandName);
        url_data.append(`newBrandName`, newBrandName);
        const option = {
            method: `PUT`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: url_data
        }; 

        fetch(url_brands_update, option)
        .then(response => response.json())
        .then(async callback_update => {

          console.log("callback_update: ", callback_update);
          let value = 1;
          let resultQ;
          resultQ = callback_update;

          const fetch_BrandsWithPromise = fetch(url_brands, { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } }).then(response => response.json());
          
          const [callback_brands] = await Promise.all([fetch_BrandsWithPromise]);
            
          const DataBrands = callback_brands.data.data.brands;
          
            // console.log("DataBrands: ", DataBrands); // debug line
            // Render the page with fetched data
            res.render('brands', { DataBrands: DataBrands, resultQ: resultQ, popup: { value } });
        })
        .catch(err => {
          // Handle errors
          console.log("Error: ", err);
          value = 1;
          resultQ = { message: "Error, something whent wrong!!: ", err };
          res.render('brands', { DataBrands: null, resultQ: resultQ, popup: { value } });
        });
  }else{
    value = 1;
    resultQ = { message: "Session or Admin rights required!!"};
    res.render('index', { resultQ: resultQ, popup: { value } });
  }
});


module.exports = router;