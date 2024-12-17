const swaggerAutogen = require('swagger-autogen')()
const doc = {
    securityDefinitions: {
        apiKeyAuth: {
          type: 'apiKey',
          in: 'header', // can be 'header', 'query' or 'cookie'
          name: 'Authorization', // name of the header, query parameter or cookie
          scheme: "bearer",
          description: 'Bearer token'
        }
      },
    security: [ { apiKeyAuth: [] } ],
    info: {
        version: "1.0.0",
        title: "AUG22pt-ep1-dissolution2",
        description: "<b>Swagger Doc EP Noroff Backend API</b>."
    },
    host: "localhost:3000",

    definitions: {
        Register: {
            $firstName: "Robin",
            $lastName: "larsen",
            $userName: "dissolution",
            $address: "onlin",
            $telephonenumber: "45",
            $email: "test@test.com",
            $password: "12345"
        },
        LogIn: {
            $userName: "",
            $email: "admin@noroff.no",
            $password: "P@ssword2023",
        },
        BrandPost: {
            $brandName: "NewBrandName"
        },
        BrandPut: {
            $brandName: "NewBrandName",
            $newBrandName: "updatedBrandName"
        },
        BrandDelete: {
            $brandName: "updatedBrandName"
        },
        CartPost: {
            $productId: 1,
            $quantity: 1
        },
        CartPut: {
            $productId: 1,
            $quantity: 1
        },
        CartDelete: {
            $productId: 1
        },
        CategoryPost: {
            $categoryName: "categoryName"
        },
        CategoryPut: {
            $categoryName: "categoryName",
            $newCategoryName: "newCategoryName"
        },
        CategoryDelete: {
            $categoryName: "newCategoryName"
        },
        MemberShipPost:{
            $memberShipName: "Extra Virgine",
            $discount: 45
        },
        MemberShipPut: {
            $memberId: 4,
            $newMemberShipName: "Silver Upgraded",
            $newDiscount: 50
        },
        MemberShipDelete: {
            $memberId: 4,
            $memberShipName: "Silver Upgraded"
        },
        OrderPut:{
            $orderNumber: "uuid-string",
            $statusId: 1
        },
        OrderPost:{
            $userEmail: "test@test.no"
        },
        OrderDelete: {
            $orderNumber: "uud-string"
        },
        ProductsPost:{
           $productName: "Test_Product_Swagger",
           $description: "A prosject API",
           $quantity: 1,
           $price: 100,
           $discount: 0,
           $imgUrl: "http://notareal.png",
           $categoryId: 1,
           $brandId: 1,
        },
        ProductsPut:{
            $productId: 1,
            $productName: "iPhone 6s Plus 16Gb",
            $description: "3D Touch. 12MP photos. 4K video.",
            $quantity: 10,
            $price: 749,
            $discount: 0,
            $imgUrl: "http://images.restapi.co.za/products/product-iphone.png",
            $categoryId: 1,
            $brandId: 1,
        },
        ProductsDeleted:{
            $productId: 1,
            $isdeleted: 1
        },
        Search:{
            $productName: "a",
            $categoryName: "",
            $brandName: ""
        },
        UsersPut:{
            $userId: 2,
            $roleName: "Admin"
        },
        UsersDelete:{
            $userId: 2
        },
        UserHistoryPut:{
            $userId: 2,
            $updateHistory: 15
        },
        UserHistoryPost:{
            $userId: 2
        },
        UserHistoryDelete:{
            $userId: 2
        }
    }
    
}

const outputFile = './swagger-output.json'
const endpointsFiles = ['./app.js']

swaggerAutogen(outputFile, endpointsFiles, doc).then(()=>{
require('./bin/www');
});