var express = require('express');
var jsend = require('jsend'); 
var router = express.Router();
router.use(jsend.middleware); 

function isValidateStringNotEmpty(strComp) {
  return (!strComp || /^\s*$/.test(strComp));
}

/** MemberShip  */
router.get('/', function(req,res,next){
    
    const token = req.session.token;

    if(token){
      let value = 0;
      let resultQ;

      // console.log("token..: ", token);
      
      fetch('http://localhost:3000/memberShip', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(response => response.json())
        .then(callback_memberShip => {
          // Handle the response data
          // console.log(callback_memberShip); // debug line
          const DataMemberShip = callback_memberShip.data.data.membership;
          const DataCollectionList = callback_memberShip.data.data.DataCollectionList;
          // console.log("DataMemberShip: ", DataMemberShip); // debug line
          res.render('memberships', { DataMemberShip: DataMemberShip, DataCollectionList: DataCollectionList, resultQ: resultQ, popup: { value } });

        })
        .catch(err => {
          // Handle errors
          console.log(err);
          value = 1;
          resultQ = { message: "Error, something whent wrong!!: ", err };
          res.render('memberships', { DataMemberShip: null, DataCollectionList: null, resultQ: resultQ, popup: { value } });
        });
      
      // const { token } = req.body;
      //console.log("Called GET /brands"); // ok
      //return res.jsend.success({ statusCode: 200, data: { result: "Called GET /brands" }}); 
    }else{
      value = 1;
      resultQ = { message: "Session or Admin rights required!!"};
      res.render('index', { resultQ: resultQ, popup: { value } });
    }

    //res.render('memberships');

});


router.post('/update', function(req,res,next){
    
  const { updateId, memberShipNameUpdate, newMemberShipName,  discount, newDiscount } = req.body;
  
    // console.log("updateId: ", updateId); // debug line
    // console.log("memberShipNameUpdate: ", memberShipNameUpdate); // debug line
    // console.log("newMemberShipName: ", newMemberShipName); // debug line
    // console.log("Discount: ", discount); // debug line
    // console.log("newDiscount: ", newDiscount); // debug line
    const token = req.session.token; 
    // console.log("token..: ", token);
  
    if(token){
      let value = 0;
      let resultQ;

      /** extra check had, change input form from text to number min, max */
      //todo: remove on code clean up stage!! 
      let convertedDiscount = Number(newDiscount);
      // console.log("convertedDiscount: ", convertedDiscount); // debug line

      if(typeof convertedDiscount !== 'number'){
        //todo: check this out !!
        value = 1;
        resultQ = { message: "Input not numnber!!", input: newDiscount};
        res.render('memberships', { DataMemberShip: null, DataCollectionList: null, resultQ: resultQ, popup: { value } });
      }

      const url_membership_update = 'http://localhost:3000/membership';
      const url_membership = 'http://localhost:3000/membership';
      
      let url_data = new URLSearchParams();
        url_data.append(`memberId`, updateId);
        url_data.append(`MemberShipName`, memberShipNameUpdate);
        url_data.append(`newMemberShipName`, newMemberShipName);
        url_data.append(`discount`, discount);
        url_data.append(`newDiscount`, newDiscount);
        const option = {
            method: `PUT`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: url_data
        }; 
      
        fetch(url_membership_update, option)
        .then(response => response.json())
        .then(async callback_update => {

          // console.log("callback_update: ", callback_update); // debug line
          value = 1;
          let resultQ = callback_update;

          const fetch_MemberShipWithPromise = fetch(url_membership, { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } }).then(response => response.json());
          
          const [callback_memberShip] = await Promise.all([fetch_MemberShipWithPromise]);
          // console.log("callback_memberShip: ", callback_memberShip); // debug line

          const DataMemberShip = callback_memberShip.data.data.membership;
          const DataCollectionList = callback_memberShip.data.data.DataCollectionList;
          // console.log("DataMemberShip: ", DataMemberShip); // debug line
          // console.log("DataCollectionList: ", DataCollectionList); // debug line
          

            // Render the page with fetched data
            res.render('memberships', { DataMemberShip: DataMemberShip, DataCollectionList: DataCollectionList, resultQ: resultQ, popup: { value } });
        })
        .catch(err => {
          console.log("Error: ", err);
          // Handle errors
          value = 1;
          resultQ = { message: "Error, something whent wrong!!: ", err };
          res.render('memberships', { DataMemberShip: null, DataCollectionList: null, resultQ: resultQ, popup: { value } });
        });
      
    }else{
      // res.render('index');
      value = 1;
      resultQ = { message: "Session or Admin rights required!!"};
      res.render('index', { resultQ: resultQ, popup: { value } });
    }
  });

router.post('/add', function(req,res,next){
    
  const { addId, memeberShipNameAdd, memeberShipDiscountAdd } = req.body;
  let value = 0;
  let resultQ;

  // console.log("memeberShipNameAdd: ", memeberShipNameAdd); // debug line
  // console.log("memeberShipDiscountAdd: ", memeberShipDiscountAdd); // debug line
  
  const token = req.session.token;
  // console.log("token..: ", token);

  if(token){
    
    const url_membership_add = 'http://localhost:3000/membership';
    const url_membership = 'http://localhost:3000/membership';
    
    let url_data = new URLSearchParams();
      url_data.append(`memberShipName`, memeberShipNameAdd);
      url_data.append(`discount`, memeberShipDiscountAdd);
      
      const option = {
          method: `POST`,
          headers: {
              'Authorization': `Bearer ${token}`
          },
          body: url_data
      }; 
    
      fetch(url_membership_add, option)
      .then(response => response.json())
      .then(async callback_add => {

        console.log("callback_update: ", callback_add);
        let value = 1;
        let resultQ = callback_add;

        const fetch_MemberShipWithPromise = fetch(url_membership, { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } }).then(response => response.json());
        
        const [callback_memberShip] = await Promise.all([fetch_MemberShipWithPromise]);
        // console.log("callback_memberShip: ", callback_memberShip); // debug line
 
        const DataMemberShip = callback_memberShip.data.data.membership;
        const DataCollectionList = callback_memberShip.data.data.DataCollectionList;
        // console.log("DataMemberShip: ", DataMemberShip); // debug line
        // console.log("DataCollectionList: ", DataCollectionList); // debug line
        

          // Render the page with fetched data
          res.render('memberships', { DataMemberShip: DataMemberShip, DataCollectionList: DataCollectionList, resultQ: resultQ, popup: { value } });
      })
      .catch(err => {
        console.log("Error: ", err);
        // Handle errors
        value = 1;
        resultQ = { message: "Error, something whent wrong!!: ", err };
        res.render('memberships', { DataMemberShip: null, DataCollectionList: null, resultQ: resultQ, popup: { value } });
      });
    
  }else{
    value = 1;
    resultQ = { message: "Session or Admin rights required!!"};
    res.render('index', { resultQ: resultQ, popup: { value } });
  }

  
});



router.post('/delete', function(req,res,next){

  const { deleteId, memberShipNameDelete } = req.body;
  const token = req.session.token;
  // console.log("token..: ", token);

  let value = 0;
  let resultQ;
  // console.log("deleteId ",deleteId); // debug line
  // console.log("memberShipNameDelete ",memberShipNameDelete); // debug line

    if(token){
      
      const url_membership_delete = 'http://localhost:3000/membership';
      const url_membership = 'http://localhost:3000/membership';
      
      let url_data = new URLSearchParams();
        url_data.append(`memberId`, deleteId);
        url_data.append(`memberShipName`, memberShipNameDelete);
        
        const option = {
            method: `DELETE`,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: url_data
        }; 
      
        fetch(url_membership_delete, option)
        .then(response => response.json())
        .then(async callback_delete => {
  
          // console.log("callback_delete: ", callback_delete); // debug line
          value = 1;
          resultQ = callback_delete;
  
          const fetch_MemberShipWithPromise = fetch(url_membership, { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } }).then(response => response.json());
          
          const [callback_memberShip] = await Promise.all([fetch_MemberShipWithPromise]);
          // console.log("callback_memberShip: ", callback_memberShip); // debug line
  
          const DataMemberShip = callback_memberShip.data.data.membership;
          const DataCollectionList = callback_memberShip.data.data.DataCollectionList;
          // console.log("DataMemberShip: ", DataMemberShip); // debug line
          // console.log("DataCollectionList: ", DataCollectionList); // debug line
          
  
            // Render the page with fetched data
            res.render('memberships', { DataMemberShip: DataMemberShip, DataCollectionList: DataCollectionList, resultQ: resultQ, popup: { value } });
        })
        .catch(err => {
          console.log("Error: ", err);
          // Handle errors
          value = 1;
          resultQ = { message: "Error, something whent wrong!!: ", err };
          res.render('memberships', { DataMemberShip: null, DataCollectionList: null, resultQ: resultQ, popup: { value } });
        });
      
    }else{
      value = 1;
      resultQ = { message: "Session or Admin rights required!!"};
      res.render('index', { resultQ: resultQ, popup: { value } });
    }
  
  });

module.exports = router;