var express = require('express');
var jsend = require('jsend');
var router = express.Router();
router.use(jsend.middleware);

function isValidateStringNotEmpty(strComp) {
    return (!strComp || /^\s*$/.test(strComp));
}


/** From api-server!!
 POST /categories (adding new categories)
GET /categories (getting all categories)
PUT or PATCH/categories (editing/changing a category)
DELETE /categories (delete/remove a category)
All CRUD operations for categories must be implemented:

Only Admins can change categories and assign or remove products from categories.
Anyone can view categories.
 */
router.get('/', function(req,res,next){
    
    const token = req.session.token;
    //console.log("token..: ", token);
    let value = 0;
    let resultQ;

    if(token){
    
      fetch('http://localhost:3000/categories', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(response => response.json())
        .then(callback_categorys => {
          // Handle the response data
          // console.log(callback_categorys); // debug line
          const DataCategory = callback_categorys.data.data.categories;

          res.render('category', { DataCategory: DataCategory, resultQ: resultQ, popup: { value } });

        })
        .catch(err => {
          // Handle errors
          console.log("Error: ", err);
          value = 1;
          resultQ = { message: "Error, something whent wrong!!: ", err };
          res.render('category', { DataCategory: null, resultQ: resultQ, popup: { value } });
        });
    }else{
      value = 1;
      resultQ = { message: "Session or Admin rights required!!"};
      res.render('index', { resultQ: resultQ, popup: { value } });
    }
});

router.post('/delete', function(req,res,next){
    
  const { deleteId, categoryNameDelete } = req.body;

  // console.log("deleteId: ", deleteId); // debug line
  // console.log("categoryNameDelete: ", categoryNameDelete); // debug line

  const token = req.session.token;
  // console.log("token..: ", token);
  let value = 1;
  let resultQ;
  // let dName = brandNameDelete;
  if(token){
  
    const url_category_delete = 'http://localhost:3000/categories';
    const url_category = 'http://localhost:3000/categories';

    let url_data = new URLSearchParams();
        url_data.append(`categoryName`, categoryNameDelete);
        
        const option = {
            method: `DELETE`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: url_data
        }; 

        fetch(url_category_delete, option)
        .then(response => response.json())
        .then(async callback_delete => {

          console.log("callback_delete: ", callback_delete);
          resultQ = callback_delete;

          const fetch_CategorysWithPromise = fetch(url_category, { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } }).then(response => response.json());
          
          const [callback_category] = await Promise.all([fetch_CategorysWithPromise]);
            
          const DataCategory = callback_category.data.data.categories;
          
            // console.log("DataCategory: ", DataCategory); // debug line
            // Render the page with fetched data
            res.render('category', { DataCategory: DataCategory, resultQ: resultQ, popup: { value } });
        })
        .catch(err => {
          console.log("Error: ", err);
          // Handle errors
          value = 1;
          resultQ = { message: "Error, something whent wrong!!: ", err };
          res.render('category', { DataCategory: null, resultQ: resultQ, popup: { value } });
        });
  }else{
      value = 1;
      resultQ = { message: "Session or Admin rights required!!"};
      res.render('index', { resultQ: resultQ, popup: { value } });
      // res.render('index');
  }
});

router.post('/update', function(req,res,next){
    
  const { updateId, categoryNameUpdate, newCategoryName } = req.body;

  // console.log("updateId: ", updateId); // debug line
  // console.log("categoryNameUpdate: ", categoryNameUpdate); // debug line
  // console.log("newCategoryName: ", newCategoryName); // debug line
  const token = req.session.token;
  // console.log("token..: ", token); // debug line


  if(token){
  
    const url_category_update = 'http://localhost:3000/categories';
    const url_category = 'http://localhost:3000/categories';

    let url_data = new URLSearchParams();
        url_data.append(`categoryName`, categoryNameUpdate);
        url_data.append(`newCategoryName`, newCategoryName);
        const option = {
            method: `PUT`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: url_data
        }; 

        fetch(url_category_update, option)
        .then(response => response.json())
        .then(async callback_update => {

          // console.log("callback_update: ", callback_update); // debug line
          let value = 1;
          let resultQ;
          resultQ = callback_update;

          const fetch_CategorysWithPromise = fetch(url_category, { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } }).then(response => response.json());
          
          const [callback_categorys] = await Promise.all([fetch_CategorysWithPromise]);
            
          const DataCategory = callback_categorys.data.data.categories;
          
            // console.log("DataCategory: ", DataCategory); // debug line
            // Render the page with fetched data
            res.render('category', { DataCategory: DataCategory, resultQ: resultQ, popup: { value } });
        })
        .catch(err => {
          console.log("Error: ", err);
          // Handle errors
          value = 1;
          resultQ = { message: "Error, something whent wrong!!: ", err };
          res.render('category', { DataCategory: null, resultQ: resultQ, popup: { value } });
        });
  }else{
    value = 1;
    resultQ = { message: "Session or Admin rights required!!"};
    res.render('index', { resultQ: resultQ, popup: { value } });
    //  res.render('index');
  }
});


router.post('/add', function(req,res,next){
    
  const { categoryNameAdd  } = req.body;

  // console.log("categoryNameAdd: ", categoryNameAdd); // debug line
  
  const token = req.session.token;
  let value = 0;
  let resultQ;
  if(token){
  
    const url_category_add = 'http://localhost:3000/categories';
    const url_category = 'http://localhost:3000/categories';

    let url_data = new URLSearchParams();
        url_data.append(`categoryName`, categoryNameAdd);
        
        const option = {
            method: `POST`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: url_data
        }; 

        fetch(url_category_add, option)
        .then(response => response.json())
        .then(async callback_update => {

          // console.log("callback_update: ", callback_update); // debug line
          value = 1;
          resultQ = callback_update;

          const fetch_CategorysWithPromise = fetch(url_category, { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } }).then(response => response.json());
          
          const [callback_categorys] = await Promise.all([fetch_CategorysWithPromise]);
            
          const DataCategory = callback_categorys.data.data.categories;
          
            // console.log("DataCategory: ", DataCategory); // debug line
            // Render the page with fetched data
            res.render('category', { DataCategory: DataCategory, resultQ: resultQ, popup: { value } });
        })
        .catch(err => {
          console.log("Error: ", err);
          // Handle errors
          value = 1;
          resultQ = { message: "Error, something whent wrong!!: ", err };
          res.render('category', { DataCategory: null, resultQ: resultQ, popup: { value } });
        });
  }else{
    value = 1;
    resultQ = { message: "Session or Admin rights required!!"};
    res.render('index', { resultQ: resultQ, popup: { value } });
    //  res.render('index');
  }
  
  
});

module.exports = router;