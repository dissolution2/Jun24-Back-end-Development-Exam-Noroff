const request = require("supertest");
const URL = 'http://localhost:3000';


/*
! Assume: test best run on clean db, at first run after npm run start, and exicute post: localhost:3000/init
*/
describe('testing-prosject-routes', () => {
    /* 
      ?  Login with a user ( Use Admin to get Admin rights for next test's )
      !    1. fail 
      *    2. success
    */
    test('POST / - auth/login (1) jsend.fail', async () =>{
        const { body, status } = await request(URL).post('/auth/login').send({userName: "test", email: "", password: "12345"});
        expect(status).toBe(200); // Assuming successful request!
        // console.log("body: ", body);
        // console.log("status: ", status);
        expect(body).toHaveProperty("status", "fail");
        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("statusCode", 500);
        expect(body.data).toHaveProperty("message", "Incorrect username or password");
    });

    token='';
    test('POST / - auth/login (2) jsend.succsses', async () =>{
        const { body, status } = await request(URL).post('/auth/login').send({userName: "", email: "admin@noroff.no", password: "P@ssword2023"});
        // console.log("body: ", body);
        // console.log("status: ", status);
        expect(status).toBe(200); // Assuming successful request!
        expect(body).toHaveProperty("status", "success");
        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("result", "You are logged in");
        expect(body.data).toHaveProperty('email');
        expect(body.data).toHaveProperty('name');
        expect(body.data).toHaveProperty('token');
        token = body.data.token;
        console.log(token);

    });

    /*
      *  All CRUD operations for categories (Use category name "TEST_CATEGORY")
    */

    test('GET / - category (1) jsend.succsses', async () =>{
        const { body, status } = await request(URL).get('/categories');
        expect(status).toBe(200); // Assuming successful request!
        // console.log("body: ", body);
        // console.log("status: ", status);
        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("data.categories");
        expect(body.data).toHaveProperty("data.categories", [{"categoryId": 1, "categoryName": "Phones"}, {"categoryId": 2, "categoryName": "TVs"}, {"categoryId": 3, "categoryName": "Watches"}, {"categoryId": 4, "categoryName": "Desktops"}, {"categoryId": 5, "categoryName": "Laptops"}, {"categoryId": 6, "categoryName": "Tablets"}]);
        expect(body.data).toHaveProperty("statusCode",200);
        expect(body).toHaveProperty("status","success");
    });

    /** POST: Add the Category "TEST_CATEGORY" */
    test('POST / - category (2) jsend.succsses', async () =>{
        const { body, status } = await request(URL).post('/categories').set('Authorization', `Bearer ${token}`).send({categoryName: "TEST_CATEGORY" });
        expect(status).toBe(200); // Assuming successful request!
        // console.log("body: ", body);
        // console.log("status: ", status);
        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("result");
        expect(body.data.result).toHaveProperty("message","New category has been added to the database");
        expect(body.data).toHaveProperty("statusCode",200);
        expect(body).toHaveProperty("status","success");
    });

    /** PUT: Update the Category "PUT_CHANGE_NAME_TEST_CATEGORY" */
    test('PUT / - category (3) jsend.succsses', async () =>{
        const { body, status } = await request(URL).put('/categories').set('Authorization', `Bearer ${token}`).send({categoryName: "TEST_CATEGORY",newCategoryName: "PUT_CHANGE_NAME_TEST_CATEGORY" }); 
        expect(status).toBe(200); // Assuming successful request!
        // console.log("body: ", body);
        // console.log("status: ", status);
        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("result");
        expect(body.data.result).toHaveProperty("message","categoryName has been updated");
        expect(body.data).toHaveProperty("statusCode",200);
        expect(body).toHaveProperty("status","success");
    });

    // ? NB!! category delete is at bottom because we us it in products jest  
    
    /*
      * ALL CRUD operations for products (Use Product name "TEST_PRODUCT" with a category of "TEST_CATEGORY")
    */

    test('GET / - products (1) jsend.succsses', async () =>{
        const { body, status } = await request(URL).get('/products');
        expect(status).toBe(200); // Assuming successful request!
        // console.log("body: ", body);
        // console.log("status: ", status);
        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("data.products");
        expect(body.data).toHaveProperty("statusCode",200);
        expect(body).toHaveProperty("status","success");
    });

    /** Assume: We know that categoryId next is 7 : if any othere test or post made this value must be changed !! */
    test('POST / - products (2) jsend.succsses', async () =>{
        const { body, status } = await request(URL).post('/products').set('Authorization', `Bearer ${token}`).send({ productName: "TEST_PRODUCT", description: "JEST_TEST_PRODUCT", quantity: 10, price: 100, discount: 0, imgUrl: 'http://image.png', categoryId: 7, brandId: 1 }); 
        expect(status).toBe(200); // Assuming successful request!
        // console.log("body: ", body);
        // console.log("status: ", status);
        expect(body.data).toHaveProperty("result");
        expect(body.data.result).toHaveProperty("message","New product has been added to the database");
        expect(body.data).toHaveProperty("statusCode",200);
        expect(body).toHaveProperty("status","success");
    });


    /** Assume: we update the product with jest, update: name, quantity, price, and categoryId | CategoryId becasue we must delete Category to full fill required CRUD Jest test on Category DELETE !!  */
    test('PUT / - products (3) jsend.succsses', async () =>{
        const { body, status } = await request(URL).put('/products').set('Authorization', `Bearer ${token}`).send({ productId: 15,productName: "TEST_PRODUCT_PUT", description: "", quantity: 100, price: 1000000, discount: 0, imgUrl: '', categoryId: 1, brandId: null }); 
        expect(status).toBe(200); // Assuming successful request!
        // console.log("body: ", body);
        // console.log("status: ", status);
        expect(body.data).toHaveProperty("result");
        expect(body.data.result).toHaveProperty("message","Updated/Changed post");
        expect(body.data).toHaveProperty("statusCode",200);
        expect(body).toHaveProperty("status","success");
    });


    test('DELETE / - products (4) jsend.succsses', async () =>{
        const { body, status } = await request(URL).delete('/products').set('Authorization', `Bearer ${token}`).send({ productId: 15, isdeleted: 1 }); 
        expect(status).toBe(200); // Assuming successful request!
        // console.log("body: ", body);
        // console.log("status: ", status);
        expect(body.data).toHaveProperty("result");
        expect(body.data.result).toHaveProperty("message","Product has been removed(soft) from the database");
        expect(body.data).toHaveProperty("statusCode",200);
        expect(body).toHaveProperty("status","success");
    });

    /** DELETE: Remove the Category "PUT_CHANGE_NAME_TEST_CATEGORY" */
    test('DELETE / - category (4) jsend.succsses', async () =>{
        const { body, status } = await request(URL).delete('/categories').set('Authorization', `Bearer ${token}`).send({categoryName: "PUT_CHANGE_NAME_TEST_CATEGORY" }); 
        expect(status).toBe(200); // Assuming successful request!
        // console.log("body: ", body);
        // console.log("status: ", status);
        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("result");
        expect(body.data.result).toHaveProperty("message","categoryName has been deleted");
        expect(body.data).toHaveProperty("statusCode",200);
        expect(body).toHaveProperty("status","success");
    });

    
});