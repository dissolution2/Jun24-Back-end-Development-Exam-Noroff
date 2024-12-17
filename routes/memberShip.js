var express = require('express');
var jwt = require('jsonwebtoken');
var jsend = require('jsend');
const isAuth = require('../middleware/middleware');
var router = express.Router();
var db = require('../models');
// var crypto = require('crypto')

const UsersService = require("../services/UsersService");
var usersService = new UsersService(db);

const RoleService = require('../services/RoleService');
var roleService = new RoleService(db);

const UserDiscountLoggService = require('../services/UserDiscountLoggService');
var userDiscountLoggService = new UserDiscountLoggService(db);


const MemberShipService = require('../services/MemberShipService');
var memberShipService = new MemberShipService(db);

router.use(jsend.middleware);


function isValidateStringNotEmpty(strComp) {
    return (!strComp || /^\s*$/.test(strComp));
}



/** Get MemberShip Data: Admin[ we get all user's data with the MemeberShip Data ] */
/** Get MemberShip Data: User's[ we get User: id, userName, memeberShipName, discount, purchureHistory  ] */
router.get('/', isAuth, async function(req,res,next){ // isAuth, 
    /* 
		#swagger.tags = ['MemberShip']
	    #swagger.description = 'Admin get All Memberships and data on users. Users get there Own data: {userId, userName, memberShipName, discount ,purchureHistory}'
        
		#swagger.responses[200] = { description: 'statusCode: 200, data: { membership: memberShip, DataCollectionList: DataCollectionList }' }
        #swagger.responses[403] = { description: 'statusCode: 403, result: {error: "Privileges Admin or user rights [Required] !!"}'}
    */
    const { token } = req.body;
    // console.log("Called GET /memberships"); // Debut Line

    if(token){

        const users = await usersService.getOneId(token.email);
        let userId = users.dataValues.userId;
        let roleId = users.dataValues.roleId;

        // console.log("user ", users); // Debug Line
        // console.log("userId: ", userId); // Debug Line
        // console.log("roleId: ", roleId); // Debug Line

        const check_role = await roleService.getUserPrivName(roleId);
        let checkPrive = check_role.dataValues.roleName;

        /** We get all Orders As Admin */
        if(checkPrive === "Admin"){


            const memberShip = await memberShipService.getAll();
            // console.log("memberShip: ", memberShip);

            const userHistory = await userDiscountLoggService.getALLUserHistory();
            // console.log("userHistory: ", userHistory);

            const users = await usersService.getAll();
            // console.log("users: ", users);  

            let DataCollectionList = [];
            
            for(let i=0; i < users.length;i++){

                const DataCollection =  {
                    "userId": users[i].dataValues.userId,
                    "userName": users[i].dataValues.userName,
                    "memberId": users[i].dataValues.memberId,
                    "memberShipName": '',
                    "discountValue": '',
                    "purchureCount": '',
                }
                DataCollectionList.push(DataCollection);
            }
            //console.log("1. DatacollectionList: ", DataCollectionList);
            for(let i=0; i < memberShip.length;i++){

                for(let dataColl=0; dataColl < DataCollectionList.length;dataColl++){

                    if(DataCollectionList[dataColl].memberId == memberShip[i].memberId){
                        DataCollectionList[dataColl].memberShipName = memberShip[i].MemberShipName;
                        DataCollectionList[dataColl].discountValue = memberShip[i].discount;
                    }
                }
            }


            for(let i=0; i < userHistory.length;i++){

                for(let dataColl=0; dataColl < DataCollectionList.length;dataColl++){

                    if(DataCollectionList[dataColl].userId == userHistory[i].userId){
                        // console.log("user history count: ", userHistory[i].historyPurchures) // debug line
                        DataCollectionList[dataColl].purchureCount = userHistory[i].historyPurchures;
                    }
                }
            }
            // console.log("2. DatacollectionList: ", DataCollectionList);
            return res.jsend.success({ statusCode: 200, data: { membership: memberShip, DataCollectionList: DataCollectionList }});
        }

        if(checkPrive === "User"){
            // console.log("we have user rights: ", users ); // Debug line

            const memberId = users.dataValues.memberId;
            // console.log("memberId: ", memberId);

            const memberShip = await memberShipService.getInfoToUser(memberId);
            // console.log("memberShip: ", memberShip);

            const userHistory = await userDiscountLoggService.getHistoryDiscount(userId);
            // console.log("userHistory: ", userHistory);

            const purchureCount = await userDiscountLoggService.getHistoryDiscount(userId);

            const membership = {
                "userId": userId,
                "userName": users.dataValues.userName,
                "memberShipName": memberShip.dataValues.MemberShipName,
                "discount": memberShip.dataValues.discount,
                "purchureHistory": purchureCount.dataValues.historyPurchures
            }
            return res.jsend.success({ statusCode: 200, data: { membership: membership }});
        }
        return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin or user rights [Required] !!"}});
    }else{
        return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin or user rights [Required] !!"}});
    }
});

router.post('/', isAuth, async function(req,res,next){
    /* 
		#swagger.tags = ['MemberShip']
	    #swagger.description = 'Admin Add new Memberships: On index Gap: new membership use gap, else Highest index + 1 NB ! no consideration on Discount value Admins dicretion '
        #swagger.parameters['body'] =  {
    		"name": "body",
    		"in": "body",
			"required": "true",
            "schema": {
        		$ref: "#/definitions/MemberShipPost",
					}
        }
		#swagger.responses[200] = { description: 'statusCode: 200, result: { message: "New memberShip has been added to the database", memberShip: memberShip }' }
        #swagger.responses[403] = { description: 'statusCode: 403, result: { error: "Privileges Admin rights [Required] !!"}'}
    */
    // console.log("Call post /memeberShip"); // debug line

    // old const { memberId, memberShipName, discount, token } = req.body;
    const { memberShipName, discount, token } = req.body;

    if(token){

        // Get userId
        const user = await usersService.getOneId(token.email);
        let userId = user.dataValues.userId;
        let roleId = user.dataValues.roleId;

        // console.log("user ", user); // Debug Line
        // console.log("userId: ", userId); // Debug Line
        // console.log("roleId: ", roleId); // Debug Line

        const check_role = await roleService.getUserPrivName(roleId);
        let checkPrive = check_role.dataValues.roleName;

        if(checkPrive === "Admin"){
            // console.log("we have admin rights"); // debug line

            // let convertedMemberId = Number(memberId);
            let converteDiscount = Number(discount);

            if(isValidateStringNotEmpty(memberShipName)){
                return res.jsend.fail({"statusCode": 500, result: {error: "Require MemberShipName", input: memberShipName }});
            }

            // check for number but can all so be 0 value
            if(typeof converteDiscount !== 'number'){
                return res.jsend.fail({"statusCode": 500, result: {error: "Require discount, Not a integer value", input: discount }});
            }

            const check_memberShipName_inUse = await memberShipService.getByName(memberShipName);

            if(check_memberShipName_inUse){
                return res.jsend.fail({ statusCode: 500, result: { message: "MemeberShip restricted, MemeberShip exist." }});
            }
                const getMembershipAll = await memberShipService.getAll();
                // console.log("getMembershipAll: ", getMembershipAll);

                let newIndext_toUse;
                let memberShipList = [];
                if(getMembershipAll){
                    
                    for(let i=0; i < getMembershipAll.length;i++){
                        const memberShipObject = {
                            "memberId": getMembershipAll[i].dataValues.memberId,
                            "name": getMembershipAll[i].dataValues.MemberShipName,
                            "discount": getMembershipAll[i].dataValues.discount
                        }
                        memberShipList.push(memberShipObject);
                    }
                }
                /** check our memberShipList Object  */
                // console.log("memberShipList: ", memberShipList);
                let indexMissing;
                for(let i=1; i < memberShipList.length + 1;i++){

                    //console.log("i: ", i , " memberId: ", memberShipList[i - 1].memberId);
                    if(memberShipList[i - 1].memberId !== i){
                        indexMissing = i;
                        //console.log("indexMissing: ", indexMissing);
                        break;
                    }

                }

                if(indexMissing){
                    // console.log("we have a index gap! ", indexMissing); // debug line

                    // discount value must be over index gap and
                    // discount value must be under index + 1 to gap. 
                    newIndext_toUse = indexMissing;
                    const memberShip = await memberShipService.create(newIndext_toUse, memberShipName, discount );
                    if(memberShip){
                        // console.log("crated new memberShip with gapId: ", memberShip); // debug line
                        return res.jsend.success({ statusCode: 200, result: { message: 'New memberShip has been added to the database', memberShip: memberShip }}); 
                    }

                }else{
                    // console.log("we get the next index from the db!!"); // debug line
                    const nextId = await memberShipService.findNextIndex_Not_IN_USE();
                    // console.log("productId nextId: ", nextId); // debug line
                    // console.log("productId nextId: ", Number(nextId[0].NextId)); // debug line
                    newIndext_toUse = Number(nextId[0].NextId);

                    const memberShip = await memberShipService.create(newIndext_toUse, memberShipName, discount );
                    if(memberShip){
                        // console.log("crated new memberShip with nextId: ", memberShip); // debug line
                        return res.jsend.success({ statusCode: 200, result: { message: 'New memberShip has been added to the database', memberShip: memberShip  }}); 
                    }
                }
                // console.log("newIndex_toUse: ", newIndext_toUse); // debug line
            
            return res.jsend.fail({"statusCode": 500, result: {error: "Error something whent wrong with creating new memberShip", memberShipList: null }});
        }
        return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});
    }


});

router.put('/', isAuth, async function(req,res,next){
    /* 
		#swagger.tags = ['MemberShip']
	    #swagger.description = 'Admin Update/change Memberships'
        #swagger.parameters['body'] =  {
    		"name": "body",
    		"in": "body",
			"required": "true",
            "schema": {
        		$ref: "#/definitions/MemberShipPut",
					}
        }
		#swagger.responses[200] = { description: 'statusCode: 200, result: { message: "memberShip has been updated/changed", memberShip: memberShip }' }
        #swagger.responses[400] = { description: 'statusCode: 400, result: { message: "No Updated/Changed to post done", updateObject }'}
        #swagger.responses[403] = { description: 'statusCode: 403, result: { error: "Privileges Admin rights [Required] !!"}'}
    */
    // console.log("Call put /memeberShip") // debug line

    const { memberId, newMemberShipName, newDiscount, token } = req.body;

    // console.log("memberId: ", memberId, 
    // " MemberShipName: ", MemberShipName,
    // " newMemberShipName: ", newMemberShipName,
    // " discount: ", discount,
    // " newdiscount: ", newDiscount
    //  ); Debug Line
     
    if(token){

        let update_MemberShipName;
        let update_discount;

        let update_MemberShipName_info = "false";
	    let update_discount_info = "false";

        const user = await usersService.getOneId(token.email);
        let userId = user.dataValues.userId;
        let roleId = user.dataValues.roleId;

        // console.log("user ", user); // Debug Line
        // console.log("userId: ", userId); // Debug Line
        // console.log("roleId: ", roleId); // Debug Line

        const check_role = await roleService.getUserPrivName(roleId);
        let checkPrive = check_role.dataValues.roleName;

        if(checkPrive === "Admin"){
            // console.log("we have admin rights"); // debug line
            if(memberId != null && memberId !== 0 && Number(memberId) ){

                const check_memeberShip_exist = await memberShipService.getOneId(memberId);
                if(!check_memeberShip_exist){
                    return res.jsend.fail({"statusCode": 500, result: {error: "MemeberShip don't Exist"}});
                }

                if(newMemberShipName !== null && newMemberShipName !== "" && typeof newMemberShipName !== 'undefined' ){ 
                    const check_memberShipName_inUse = await memberShipService.getByName(newMemberShipName);
                    if(check_memberShipName_inUse){
                        update_MemberShipName_info = "fail" // if allready exist!!
                    }else{
                        update_MemberShipName = await memberShipService.updateMemberShipName(memberId,newMemberShipName);
                        //update_name = false; // Testing 
                        if(update_MemberShipName){
                            update_MemberShipName_info = "true";
                        }else{ 
                            update_MemberShipName_info = "fail"
                        }
                    }
                }
                
                if(newDiscount != null && newDiscount !== "" && typeof newDiscount !== 'undefined'){
                    let discount = Number(newDiscount);
                    console.log("discount: ", discount);
                    if(Number.isNaN(discount)){
                        update_discount_info = "fail"
                        // console.log("fail update newDiscount: ", discount ); // debug line
                    }else{

                        update_discount = await memberShipService.updateMemberShipDiscount(memberId, discount);
                        // console.log("update_discount: ", update_discount); // debug line
                        if(update_discount){
                            update_discount_info = "true";
                        }else{ 
                            update_discount_info = "fail"
                        }
                    }
                }

            }else{
                return res.jsend.fail({"statusCode": 500, result: {error: "MemberId is required"}});
            } 

            let updateObject = { 
                update_MemberShipName: update_MemberShipName_info,
	            update_discount: update_discount_info
            }
            if(update_MemberShipName || update_discount){
                // console.log("success updateObject: ", updateObject); // debug line
                return res.jsend.success({ statusCode: 200, result: { message: "Updated/Changed post", updateObject }});
            }else{
                // All update is false or fails.. no update done!
                // console.log("fail updateObject: ", updateObject); // debug line
                return res.jsend.fail({ statusCode: 400, result: { message: "No Updated/Changed to post done", updateObject }});
            }
        }
        return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});
    }else{
        return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});
    }

});

// check if MemeberShip is in use !!
router.delete('/', isAuth, async function(req,res,next){
    /* 
		#swagger.tags = ['MemberShip']
	    #swagger.description = 'Admin Delete Memberships if not in use'
        #swagger.parameters['body'] =  {
    		"name": "body",
    		"in": "body",
			"required": "true",
            "schema": {
        		$ref: "#/definitions/MemberShipDelete",
					}
        }
		#swagger.responses[200] = { description: 'statusCode: 200, result: { message: "Removed MemeberShip from database!!" }' }
        #swagger.responses[500] = { description: 'statusCode: 500, result: { message: "Delete restricted, MemeberShip in use.." }'}
        #swagger.responses[403] = { description: 'statusCode: 403, result: { error: "Privileges Admin rights [Required] !!"}'}
    */
    // console.log("Call delete /memeberShip"); // debut line

    const { memberId, memberShipName, token } = req.body;

    // console.log("memberId ",memberId); // Debug Line
    // console.log("On delete memberShipName ",memberShipName); // Debug Line

    if(token){

        // Get userId
        const user = await usersService.getOneId(token.email);
        let userId = user.dataValues.userId;
        let roleId = user.dataValues.roleId;
        

        // console.log("user ", user); // Debug Line
        // console.log("userId: ", userId); // Debug Line
        // console.log("roleId: ", roleId); // Debug Line

        const check_role = await roleService.getUserPrivName(roleId);
        let checkPrive = check_role.dataValues.roleName;

        if(checkPrive === "Admin"){
            // console.log("we have admin rights"); //Debug line

            /** validation */
            if(isValidateStringNotEmpty(memberShipName)){
                return res.jsend.fail({"statusCode": 500, result: {error: "Require MemberShipName, check format", input: memberShipName }});
            }

            let convertMemberId = Number(memberId);
            if(Number.isNaN(convertMemberId)){
                return res.jsend.fail({"statusCode": 500, result: {error: "Require memberId, check format", input: memberId }});
            }

            if(memberId !== 1){  // MemberShip id 1 is of Defualt in use!!
                const check_assosicated_use = await usersService.checkUserForMemberShipInUse(memberId);
                // console.log("check_assosicated_use: ", check_assosicated_use ); // Debug Line

                if(check_assosicated_use.length > 0 ){
                    return res.jsend.fail({ statusCode: 500, result: { message: "Delete restricted, MemeberShip in use.." }});
                }

                const delete_memeberShip = await memberShipService.removeMemberShip(memberId,memberShipName);
                // console.log("delete_memeberShip:", delete_memeberShip); // Debug Line

                if(delete_memeberShip){
                    return res.jsend.success({ statusCode: 200, result: { message: "Removed MemeberShip from database!!" }}); 
                }
            }else{
                return res.jsend.fail({ statusCode: 500, result: { message: "Delete restricted, MemeberShip in use.." }});
            }

        }
        return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});
    }else{
        return res.jsend.fail({"statusCode": 403, result: {error: "Privileges Admin rights [Required] !!"}});
    }
});

module.exports = router;