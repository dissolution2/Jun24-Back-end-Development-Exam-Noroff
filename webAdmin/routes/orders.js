var express = require('express');
var jsend = require('jsend');

var router = express.Router();
router.use(jsend.middleware);

function isValidateStringNotEmpty(strComp) {
    return (!strComp || /^\s*$/.test(strComp));
}

/** GET /orders (getting all orders for the logged in user OR all orders for all users if an admin user is logged in) */
router.get('/', async function(req,res,next){ 

    //console.log("Called GET /orders");

  // this works but we want an exstra table for the products ??  
    const token = req.session.token;
    // console.log("token..: ", token); // debug line
    let value = 0;
    let resultQ;
    if(token){

      fetch('http://localhost:3000/orders', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(response => response.json())
        .then(callback_orders => {
          // Handle the response data
          // console.log(callback_orders); // debug line
          const DataOrders = callback_orders.data.data.orders;
          const DataList = callback_orders.data.data.listProducts;

          // console.log("DataOrders: ", DataOrders); // debug line
          // console.log("DataList: ", DataList); // debug line
          
          return res.render('orders', { DataOrders: DataOrders, DataList: DataList, resultQ: resultQ, popup: { value } });


        })
        .catch(err => {
          // Handle errors
          console.log(err);
          value = 1;
          resultQ = { message: "Error, something whent wrong!!: ", err };
          return res.render('orders', { DataOrders: null, DataList: null, resultQ: resultQ, popup: { value } });
        });
    }else{
      value = 1;
      resultQ = { message: "Session or Admin rights required!!"};
      res.render('index', { resultQ: resultQ, popup: { value } });
    }
});

/** PUT or PATCH/order (changing an order status admin only) */
router.post('/update', async function(req,res,next){ 

    // console.log("Called POST /orders/update"); // debug line

    const { orderNumber, status, statusIdOne, statusIdTwo, statusIdThree } = req.body;
    // console.log(
    //   "orderNumber: ", orderNumber,
    //   " status: ", status,
    //   " statusIdOne: ", statusIdOne,
    //   " statusIdTwo: ", statusIdTwo,
    //   " statusIdThree: ", statusIdThree
    // ); // debug line
    /** will use the statusIdOne etc ast a ref value that the status is ok!! - i think. tho shouldent need to. */

    const token = req.session.token;
    let value = 0;
    let resultQ;

    console.log("token: ", token);
    // let value = 1;
    // let resultQ;
    let statusId = status;

    if(token){
      
      const url_orders_updata = 'http://localhost:3000/orders';
      const url_orders = 'http://localhost:3000/orders';
        

        let url_data = new URLSearchParams();
        url_data.append(`orderNumber`, orderNumber);
        url_data.append(`statusId`, statusId);

        const option = {
            method: `PUT`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: url_data
        }; 

        fetch(url_orders_updata, option)
        .then(response => response.json())
        .then(async callback_update => {

            // console.log("callback_update: ", callback_update); // debug line
            value = 1;
            resultQ;
            resultQ = callback_update;

            // After the product is successfully updated, fetch other data
            const fetch_OrdersWithPromise = fetch(url_orders, { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } }).then(response => response.json());
            
            const [callback_orders] = await Promise.all([fetch_OrdersWithPromise]);
              
            const DataOrders = callback_orders.data.data.orders;
            const DataList = callback_orders.data.data.listProducts;
            // console.log("DataOrders: ", DataOrders); // debug line
            // Render the page with fetched data
            res.render('orders', { DataOrders: DataOrders, DataList: DataList, resultQ: resultQ, popup: { value } });
        })
        .catch(err => {
          console.log("Error: ", err);
          // Handle errors
          value = 1;
          resultQ = { message: "Error, something whent wrong!!: ", err };
          res.render('orders', { DataOrders: null, DataList: null, resultQ: resultQ, popup: { value } });
        });

    }else{
      value = 1;
      resultQ = { message: "Session or Admin rights required!!"};
      res.render('index', { resultQ: resultQ, popup: { value } });
    }

});

module.exports = router;