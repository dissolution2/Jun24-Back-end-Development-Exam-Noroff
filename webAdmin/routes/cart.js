var express = require('express');
var jsend = require('jsend');
var router = express.Router();
router.use(jsend.middleware);

function isValidateStringNotEmpty(strComp) {
	return (!strComp || /^\s*$/.test(strComp));
  }

//todo: Decided not to implement this with the webAdmin - keep for future ref(history)  

/** getting all the product items that has been added 
 * to the cart for the current logged in users active cart 
 * (Cart that has not been checked out)) 
 * */
router.get('/', async function(req,res,next){


});

/** POST /cart (adding a product to a logged in users cart) */
/** Require: "For example, if a user wants 10 product items, and the product quantity is only 2,
 *  the product cannot be added to their cart and the cart cannot be checked out." 
 */

//todo: The current discount should be calculated on the items in the cart (I.e., discount based on the current membership status). DONE !! 
/** Assume: we get productId and user action on quantity of product */
router.post('/', async function(req,res,next){
    

});

/** POST /cart/checkout/now (to check out the users cart)
 * Make an Order in the DB etc.. 
 * 
 */
router.post('/checkout', async function(req,res,next){

    

});

/** PUT or PATCH /cart (editing/changing a cart product item quantity ) */
/** Assume: if quantity is sett to 0 / cero we remove it from the cart */
router.put('/', isAuth, async function(req,res,next){

    

    
});

/** DELETE /cart (delete/remove a product item from the current logged in users active cart) */
router.delete('/', isAuth, async function(req,res,next){
    
    
    
});

module.exports = router;