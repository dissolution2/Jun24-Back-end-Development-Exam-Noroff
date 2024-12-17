var express = require('express');
var jsend = require('jsend'); // test postman
var router = express.Router();
router.use(jsend.middleware); // test postman


/** MemberShip  */
router.get('/', function(req,res,next){
    
    // const token = req.session.token;

    // if(token){
    //   console.log("token..: ", token);
      
    //   fetch('http://localhost:3000/brands', {
    //       method: 'GET',
    //       headers: {
    //         'Authorization': `Bearer ${token}`
    //       }
    //     })
    //     .then(response => response.json())
    //     .then(callback_brands => {
    //       // Handle the response data
    //       console.log(callback_brands);
    //       const DataBrands = callback_brands.data.data.brands;

    //       res.render('brands', { DataBrands: DataBrands });

    //     })
    //     .catch(error => {
    //       // Handle errors
    //       console.log(error);
    //     });
      
    //   // const { token } = req.body;
    //   //console.log("Called GET /brands"); // ok
    //   //return res.jsend.success({ statusCode: 200, data: { result: "Called GET /brands" }}); 
    // }else{
    //   res.render('index');
    // }
});


router.post('/delete', function(req,res,next){
    
//   const { deleteId, brandNameDelete } = req.body;

//   console.log("deleteId: ", deleteId);
//   console.log("brandNameDelete: ", brandNameDelete);
//   const token = req.session.token;
//   // console.log("token..: ", token);

//   if(token){
    
//     fetch('http://localhost:3000/membership', {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       })
//       .then(response => response.json())
//       .then(callback_brands => {
//         // Handle the response data
//         console.log(callback_brands);
//         const DataBrands = callback_brands.data.data.brands;

//         res.render('brands', { DataBrands: DataBrands });

//       })
//       .catch(error => {
//         // Handle errors
//         console.log(error);
//       });
    
//     // const { token } = req.body;
//     //console.log("Called GET /brands"); // ok
//     //return res.jsend.success({ statusCode: 200, data: { result: "Called GET /brands" }}); 
//   }else{
//     res.render('index');
//   }
});

router.post('/add', function(req,res,next){
    
//   const { brandNameAdd } = req.body;

  console.log("brandNameAdd: ", brandNameAdd);
  
  const token = req.session.token;
  // console.log("token..: ", token);

  // if(token){
    
  //   fetch('http://localhost:3000/brands', {
  //       method: 'GET',
  //       headers: {
  //         'Authorization': `Bearer ${token}`
  //       }
  //     })
  //     .then(response => response.json())
  //     .then(callback_brands => {
  //       // Handle the response data
  //       console.log(callback_brands);
  //       const DataBrands = callback_brands.data.data.brands;

  //       res.render('brands', { DataBrands: DataBrands });

  //     })
  //     .catch(error => {
  //       // Handle errors
  //       console.log(error);
  //     });
    
  //   // const { token } = req.body;
  //   //console.log("Called GET /brands"); // ok
  //   //return res.jsend.success({ statusCode: 200, data: { result: "Called GET /brands" }}); 
  // }else{
  //   res.render('index');
  // }
});

router.post('/update', function(req,res,next){
    
//   const { updateId, brandNameUpdate } = req.body;

  console.log("updateId: ", updateId);
  console.log("brandNameUpdate: ", brandNameUpdate);
  const token = req.session.token;
  // console.log("token..: ", token);

  // if(token){
    
  //   fetch('http://localhost:3000/brands', {
  //       method: 'GET',
  //       headers: {
  //         'Authorization': `Bearer ${token}`
  //       }
  //     })
  //     .then(response => response.json())
  //     .then(callback_brands => {
  //       // Handle the response data
  //       console.log(callback_brands);
  //       const DataBrands = callback_brands.data.data.brands;

  //       res.render('brands', { DataBrands: DataBrands });

  //     })
  //     .catch(error => {
  //       // Handle errors
  //       console.log(error);
  //     });
    
  //   // const { token } = req.body;
  //   //console.log("Called GET /brands"); // ok
  //   //return res.jsend.success({ statusCode: 200, data: { result: "Called GET /brands" }}); 
  // }else{
  //   res.render('index');
  // }
});


module.exports = router;