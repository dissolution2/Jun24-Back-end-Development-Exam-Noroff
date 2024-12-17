![admin_welcome_screen2](https://github.com/noroff-backend-1/aug22pt-ep1-dissolution2/assets/10289341/829c8b01-27e5-4b77-aff8-fcad9a78def1)
## Back-end Development Year 1
### EP - Course Assignment
# AUG22PT-SD-API-CA-DISSOLUTION2

# Server API
https://localhost:3000 { Auth Get {Bearer Token}:After Login [required: users,  Rols: Admin, Users] }
<br>
# Admin Web API
https://localhost:5000/admin { API Auth Get {Bearer Token}:After Login [required: users, Rols: Admin] }

## Table of Contents
- [INSTALL](#install)
- [INIT](#init)
- [JEST](#jest)
- [AUTH REGISTER LOGIN](#auth-register-login)
- [API PRODUCTS](#api-products)
- [API CATEGORIES](#api-categories)
- [API BRANDS](#api-brands)
- [API SEARCH](#api-search)
- [API CART](#api-cart)
- [API ORDERS](#api-orders)
- [API USERS](#api-users)
- [API ROLES](#api-roles)
- [API MEMBERSHIPS](#api-memberships)
- [API USERDISCOUNTLOGG](#api-userdiscountlogg)
- [ENV](#env)
- [API SERVER PACKAGE INSTALLED](#api-server-package-installed)
- [VERSION](#version)
- [API WEBADMIN](#api-webadmin)
- [REFERENCES](#references)

# INSTALL

clone or down load zip.

Clone!<br>
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://github.com/noroff-backend-1/aug22pt-ep1-dissolution2.git)

Zip!<br>
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://github.com/noroff-backend-1/aug22pt-ep1-dissolution2/archive/refs/heads/main.zip)

```bash
manualy clone / zip url's:
(git clone https://github.com/noroff-backend-1/aug22pt-ep1-dissolution2.git)
(download the zip: https://github.com/noroff-backend-1/aug22pt-ep1-dissolution2/archive/refs/heads/main.zip)

Use npm install (install all the dependencies of the project) in terminal of visual studio code

API Server: (on localhost:3000)
    npm i or npm install (in folder aug22pt-ep1-dissolution2)
run: npm with -
    npm run start - (starts application with node)
    npm run test - (starts jest test run)
    npm run doc - (starts swagger doc to view on http://localhost:3000/doc)
WebAdmin: (on localhost:5000/admin)
    npm i or npm install (in folder aug22pt-ep1-dissolution2/webAdmin)
run: npm with -
    npm run start - (starts application with node)
```

# INIT
```bash
(post) /init/ 'initialize Database'
 -swagger 'POST /init/' on http://localhost:3000/doc body{} Auth: none // sync force: false
 -postman 'POST: http://localhost:3000/init'
```
-Returns Eks.
```JSON
{
  "status": "success",
  "data": {
    "statusCode": 200,
    "result": {
      "message": "Database synchronized, Admin Created and Tables: Role, MemberShip, Status Value default updated"
    }
  }
}
{
  "status": "success",
  "data": {
    "statusCode": 200,
    "result": {
      "message": "Database is allready synchronized.. change force to true if needed to clean the database!!"
    }
  }
}
```

# JEST
![jset test screenShoot](https://github.com/noroff-backend-1/aug22pt-ep1-dissolution2/assets/10289341/e5fe9131-8689-4940-a30f-afab6a7ac68c)

```bash
After: 'INIT post aug22pt-ep1-dissolution2 do:
Run: npm run test
note:
    run jest test on a clean datebase ( Test use: "TEST_CATEGORY", When adds "TEST_PRODUCTS" )
    Test: POST: Add the Category "TEST_CATEGORY" adds new Category ( with index 7, witch is the next index )
    Test: POST: Add New Product uses Category index 7 (index 7 is manualy used on test)'
```
>[!NOTE]
>Jest test console.log() output in collapsed section!!
<details>

<summary>View Test output</summary>

### Commented Out console.log() in test!!

<!-- You can add text within a collapsed section.  -->
<!-- You can add an image or a code block, too. -->

```bash
   > jest

  console.log
    body:  {
      status: 'fail',
      data: { statusCode: 500, message: 'Incorrect username or password' }
    }

      at Object.log (test/prosject.test.js:17:17)

  console.log
    status:  200

      at Object.log (test/prosject.test.js:18:17)

  console.log
    body:  {
      status: 'success',
      data: {
        result: 'You are logged in',
        email: 'admin@noroff.no',
        name: 'Admin',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQG5vcm9mZi5ubyIsIm5hbWUiOiJBZG1pbiIsImlhdCI6MTcxNTQxNzUwMSwiZXhwIjoxNzE1NDI0NzAxfQ.AknNU4ADkh6xo20wHT08iEwfKoeqbesfOmm5gPqM2vw'
      }
    }

      at Object.log (test/prosject.test.js:28:17)

  console.log
    status:  200

      at Object.log (test/prosject.test.js:29:17)

  console.log
    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQG5vcm9mZi5ubyIsIm5hbWUiOiJBZG1pbiIsImlhdCI6MTcxNTQxNzUwMSwiZXhwIjoxNzE1NDI0NzAxfQ.AknNU4ADkh6xo20wHT08iEwfKoeqbesfOmm5gPqM2vw

      at Object.log (test/prosject.test.js:38:17)

  console.log
    body:  {
      status: 'success',
      data: {
        statusCode: 200,
        data: { result: 'categories found', categories: [Array] }
      }
    }

      at Object.log (test/prosject.test.js:49:17)

  console.log                                                                                                                       
    status:  200                                                                                                                    

      at Object.log (test/prosject.test.js:50:17)

  console.log                                                                                                                       
    body:  {                                                                                                                        
      status: 'success',
      data: {
        statusCode: 200,
        result: {
          message: 'New category has been added to the database',
          input: 'TEST_CATEGORY'
        }
      }
    }

      at Object.log (test/prosject.test.js:62:17)

  console.log                                                                                                                       
    status:  200                                                                                                                    

      at Object.log (test/prosject.test.js:63:17)

  console.log
    body:  {
      status: 'success',
      data: {
        statusCode: 200,
        result: {
          message: 'categoryName has been updated',
          input: 'PUT_CHANGE_NAME_TEST_CATEGORY'
        }
      }
    }

      at Object.log (test/prosject.test.js:75:17)

  console.log                                                                                                                       
    status:  200                                                                                                                    

      at Object.log (test/prosject.test.js:76:17)

  console.log                                                                                                                       
    body:  {                                                                                                                        
      status: 'success',
      data: {
        statusCode: 200,
        data: { result: 'product found', products: [Array] }
      }
    }

      at Object.log (test/prosject.test.js:93:17)

  console.log                                                                                                                       
    status:  200                                                                                                                    

      at Object.log (test/prosject.test.js:94:17)

  console.log
    body:  {
      status: 'success',
      data: {
        statusCode: 200,
        result: { message: 'New product has been added to the database' }
      }
    }

      at Object.log (test/prosject.test.js:105:17)

  console.log                                                                                                                       
    status:  200                                                                                                                    

      at Object.log (test/prosject.test.js:106:17)

  console.log
    body:  {
      status: 'success',
      data: {
        statusCode: 200,
        result: { message: 'Updated/Changed post', updateObject: [Object] }
      }
    }

      at Object.log (test/prosject.test.js:118:17)

  console.log                                                                                                                       
    status:  200                                                                                                                    

      at Object.log (test/prosject.test.js:119:17)

  console.log
    body:  {
      status: 'success',
      data: {
        statusCode: 200,
        result: { message: 'Product has been removed(soft) from the database' }
      }
    }

      at Object.log (test/prosject.test.js:130:17)

  console.log                                                                                                                       
    status:  200                                                                                                                    

      at Object.log (test/prosject.test.js:131:17)

  console.log                                                                                                                       
    body:  {                                                                                                                        
      status: 'success',
      data: {
        statusCode: 200,
        result: {
          message: 'categoryName has been deleted',
          input: 'PUT_CHANGE_NAME_TEST_CATEGORY'
        }
      }
    }

      at Object.log (test/prosject.test.js:142:17)

  console.log                                                                                                                       
    status:  200                                                                                                                    

      at Object.log (test/prosject.test.js:143:17)
```
</details>


# API SERVER

Discriptions on GET | POST | PUT | DELETE on Api server with Postman and Swagger return JSON Objects

## AUTH REGISTER LOGIN

### POST Register
```bash
(post) /auth/register '- Register new users with { firstName: string, lastName: string, userName: string, address: string, telephonenumber: string, email: string, password: string }' 
 -swagger 'http://localhost:3000/doc POST /auth/register [required] body { "firstName": "Robin", "lastName": "larsen", "userName": "dissolution", "address": "onlin", "telephonenumber": "45", "email": "test@test.com", "password": "12345" } (JSON)'
 -postman 'http://localhost:3000/auth/register [required] body { "firstName": "Robin", "lastName": "larsen", "userName": "dissolution", "address": "onlin", "telephonenumber": "45", "email": "test@test.com", "password": "12345" } (JSON)'
```
-Returns Eks.
```JSON
{
  "status": "success",
  "data": {
    "statusCode": 200,
    "result": {
      "message": "Your account has been crated!!"
    }
  }
}
{
  "status": "error",
  "message": "There was an error crating you account, User name or email is allready in use!"
}
```
### POST Login
```bash
(post) /auth/login '- User login with UserName or Email and password {userName: string, email: string, password: string }'
-swagger 'http://localhost:3000/doc POST /auth/login [required] body { "userName": "", "email": "admin@noroff.no", "password": "P@ssword2023" } (JSON)'
 -postman 'http://localhost:3000/auth/login [required] body { "userName": "dissolution", "email": "", "password": "12345" } (JSON)'
```
-Returns Eks.
```JSON
{
  "status": "success",
  "data": {
    "result": "You are logged in",
    "email": "test@test.com",
    "name": "dissolution",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJuYW1lIjoiZGlzc29sdXRpb24iLCJpYXQiOjE3MTU0MjM0OTQsImV4cCI6MTcxNTQzMDY5NH0.I7MyqBpyaoqt3WvlG4sUhzDy9rYngonxizkkOL1kd_Y"
  }
}
{
  "status": "success",
  "data": {
    "result": "You are logged in",
    "email": "admin@noroff.no",
    "name": "Admin",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQG5vcm9mZi5ubyIsIm5hbWUiOiJBZG1pbiIsImlhdCI6MTcxNTQyMzM3NCwiZXhwIjoxNzE1NDMwNTc0fQ.9cEUZtfCKUoPNjmNpJvpvVfy2hfym_f06-Lj7wT1i10"
  }
}
{
  "status": "fail",
  "data": {
      "statusCode": 500,
      "message": "Incorrect username or password"
  }
}
```

# API PRODUCTS

### GET PARAM {productId}
```bash
(get) /products/{productId} '- Guest, User or Admin, no restrictions. Can get product by Id'
-swagger 'http://localhost:3000/doc GET /products/{productId} No Auth, No body {}, [required](path params productId), return (JSON)' 
-postman 'http://localhost:3000/products/1 GET No Auth, No body {}, [required](path params productId), return (JSON)'
```
-Returns Eks.
```JSON
{
  "status": "success",
  "data": {
      "statusCode": 200,
      "data": {
          "result": "product found",
          "products": [
              {
                  "productId": 1,
                  "productName": "iPhone 6s Plus 16Gb",
                  "description": "3D Touch. 12MP photos. 4K video.",
                  "quantity": 100,
                  "price": 749,
                  "discount": 0,
                  "imgUrl": "http://images.restapi.co.za/products/product-iphone.png",
                  "categoryId": 1,
                  "brandId": 1,
                  "isdeleted": 0,
                  "createdAt": "2024-05-11T07:22:04.000Z",
                  "updatedAt": "2024-05-13T02:03:47.000Z",
                  "categoryName": "Phones",
                  "brandName": "Apple"
              }
          ]
      }
  }
}
```

### GET
```bash
(get) /products '- Guest, User or Admin, no restrictions. Can get all products'
-swagger 'http://localhost:3000/doc GET /products No Auth, No body {}, return (JSON)'
-postman 'http://localhost:3000/products GET No Auth, No body {}, return (JSON)'
```
-Returns Eks.
```JSON
{
  "status": "success",
  "data": {
    "statusCode": 200,
    "data": {
      "result": "product found",
      "products": [
        {
          "productId": 15,
          "productName": "TEST_PRODUCT_PUT",
          "description": "JEST_TEST_PRODUCT",
          "quantity": 100,
          "price": 1000000,
          "discount": 0,
          "imgUrl": "http://image.png",
          "categoryId": 1,
          "brandId": 1,
          "isdeleted": 1,
          "createdAt": "2024-05-11T08:51:41.000Z",
          "updatedAt": "2024-05-11T08:51:41.000Z",
          "categoryName": "Phones",
          "brandName": "Apple"
        },
        {
          "productId": 1,
          "productName": "iPhone 6s Plus 16Gb",
          "description": "3D Touch. 12MP photos. 4K video.",
          "quantity": 2,
          "price": 649,
          "discount": 0,....More products
```
### Post
```bash
(post) /products '- Admin can add new product body{ "productName": string, "description": string, "quantity": integer, "price": integer, "discount": integer, "imgUrl": string, "categoryId": integer, "brandId": integer}, return (JSON)'
 -swagger 'http://localhost:3000/doc POST /products Auth Token User role required['Admin'], body { "productName": "Test_Product_Swagger", "description": "A prosject API", "quantity": 1, "price": 100, "discount": 0, "imgUrl": "http://notareal.png", "categoryId": 1, "brandId": 1 }, (JSON)'
 -postman 'http://localhost:3000/products POST Auth Token User role required['Admin'], body {"productName": "Test_Product_Swagger", "description": "A prosject API", "quantity": 1, "price": 100, "discount": 0, "imgUrl": "http://notareal.png", "categoryId": 1, "brandId": 1 } (JSON)'
```
-Returns Eks.
```JSON
{
  "status": "success",
  "data": {
    "statusCode": 200,
    "result": {
      "message": "New product has been added to the database"
    }
  }
}
{
    "status": "fail",
    "data": {
        "statusCode": 500,
        "result": {
            "error": "Require categoryId, not in database create new Category or change it",
            "input": 10
        }
    }
}
{
    "status": "fail",
    "data": {
        "statusCode": 500,
        "result": {
            "error": "Require brandId, Not in database create new Brand or change it",
            "input": 22
        }
    }
}
{
    "status": "fail",
    "data": {
        "statusCode": 500,
        "result": {
            "error": "Require quantity, Not a integer value",
            "input": "1f"
        }
    }
}
{
  "status": "fail",
  "data": {
    "statusCode": 403,
    "result": {
      "error": "Privileges Admin rights [Required] !!"
    }
  }
}
```
### Put
> [!IMPORTANT]
> * true equal [Updated]
> * false equal [not Updated]
> * fail equal [not Updated (error on input)] <br>
> to not update some of the values in Products, Admin can sett input :
> * "" (empty string)
> * null (value null)
> <br>
> this will equal false on Update.
> used postman to show example data and returns (-Returns Eks 2).
```bash
(put) /products '- Admin can update/change product { "productId": integer, "productName": string, "description": string, "quantity": integer, "price": integer, "discount": integer, "imgUrl": string, "categoryId": integer, "brandId": integer }'
-swagger 'http://localhost:3000/doc PUT /products Auth Token User role required['Admin'], body { "productId": 1, "productName": "iPhone 6s Plus 16Gb", "description": "3D Touch. 12MP photos. 4K video.",
  "quantity": 10,
  "price": 749,
  "discount": 0,
  "imgUrl": "http://images.restapi.co.za/products/product-iphone.png",
  "categoryId": 1,
  "brandId": 1
} (JSON)'

-postman 'http://localhost:3000/products PUT Auth Token User role required['Admin'], body { 
    "productId": 1, 
    "productName": "",
    "description": "3D Touch. 12MP photos. 4K video.",
    "quantity": 100,
    "price": null,
    "discount": null,
    "imgUrl": null,
    "categoryId": "2e",
    "brandId": null
} (JSON)' 
```
-Returns Eks.
```JSON
{
  "status": "success",
  "data": {
    "statusCode": 200,
    "result": {
      "message": "Updated/Changed post",
      "updateObject": {
        "update_productName": "true",
        "update_description": "true",
        "update_quantity": "true",
        "update_price": "true",
        "update_discount": "true",
        "update_imgUrl": "true",
        "update_categoryId": "true",
        "update_brandId": "true"
      }
    }
  }
}
{
  "status": "success",
  "data": {
      "statusCode": 200,
      "result": {
          "message": "Updated/Changed post",
          "updateObject": {
              "update_productName": "false",
              "update_description": "true",
              "update_quantity": "true",
              "update_price": "false",
              "update_discount": "false",
              "update_imgUrl": "false",
              "update_categoryId": "fail",
              "update_brandId": "false"
          }
      }
  }
}
```
### Delete
```bash
(delete) /products '- Admin can delete(soft) products body {"productId": integer, "isdeleted": integer }, isdeleted value { 0 = is active, 1 = isdeleted true }'
-swagger 'http://localhost:3000/doc DELETE /products Auth Token User role required['Admin'], body {
    "productId": 1,
    "isdeleted": 1
}, return (JSON)'
-postman 'http://localhost:3000/products DELETE Auth Token User role required['Admin'], body {"productId": 1,
    "isdeleted": 0
}, return (JSON)'
```
-Returns Eks.
```JSON
{
    "status": "success",
    "data": {
        "statusCode": 200,
        "result": {
            "message": "Product has been removed(soft) from the database"
        }
    }
}
{
  "status": "success",
  "data": {
      "statusCode": 200,
      "result": {
          "message": "Product has been set active(soft) in the database"
      }
  }
}
// input wrong:
{
    "status": "fail",
    "data": {
        "statusCode": 500,
        "result": {
            "error": "Error removing or activating(soft) product on the database... !!"
        }
    }
}
```
# API CATEGORIES

### GET
```bash
(get) /categories '- Get all Categorys in the database'
-swagger 'http://localhost:3000/doc GET /categories/ No Auth, No body {}, return (JSON )'
-postman 'http://localhost:3000/categories GET /categories No Auth, No body {}, return (JSON )'
```
-Returns Eks.
```JSON
{
  "status": "success",
  "data": {
    "statusCode": 200,
    "data": {
      "result": "categories found",
      "categories": [
        {
          "categoryId": 1,
          "categoryName": "Phones"
        },
        {
          "categoryId": 2,
          "categoryName": "TVs"
        },
        {
          "categoryId": 3,
          "categoryName": "Watches"
        },
        {
          "categoryId": 4,
          "categoryName": "Desktops"
        },
        {
          "categoryId": 5,
          "categoryName": "Laptops"
        },
        {
          "categoryId": 6,
          "categoryName": "Tablets"
        }
      ]
    }
  }
}
```
### Post
```bash
(post) /categories '- Admin can Add new Category with categoryName to the database, Auth Token User role required['Admin'], body {"categoryName": string }, return (JSON)'
 -swagger 'http://localhost:3000/doc POST /categories/ Auth Token User role required['Admin'], body {"categoryName": "categoryName"}, return (JSON )'
 -postman 'http://localhost:3000/categories POST /categories Auth Token User role required['Admin'], body {"categoryName": "categoryName"}, return (JSON )'
```
-Returns Eks.
```JSON
{
  "status": "success",
  "data": {
    "statusCode": 200,
    "result": {
      "message": "New category has been added to the database",
      "input": "categoryName"
    }
  }
}
{
    "status": "fail",
    "data": {
        "statusCode": 500,
        "result": {
            "error": "categoryName allready exist",
            "input": "Desktops"
        }
    }
}
```
### Put
```bash
(put) /categories '- Admin can update/change Category with categoryName, newCategoryName, Auth Token User role required['Admin'], body {"categoryName": string,
  "newCategoryName": string }, retun (JSON)'
-swagger 'http://localhost:3000/doc PUT /categories/ Auth Token User role required['Admin'], body {"categoryName": "categoryName",
  "newCategoryName": "newCategoryName"}, return (JSON)'
-postman 'http://localhost:3000/doc PUT /categories Auth Token User role required['Admin'], body {"categoryName": "categoryName",
  "newCategoryName": "newCategoryName"}, return (JSON)'
```
-Returns Eks.
```JSON
{
  "status": "success",
  "data": {
    "statusCode": 200,
    "result": {
      "message": "categoryName has been updated",
      "input": "newCategoryName"
    }
  }
}
{
  "status": "fail",
  "data": {
    "statusCode": 500,
    "result": {
      "error": "newCategoryName exist, please choose a newCategoryName",
      "input": "newCategoryName"
    }
  }
}
{
  "status": "fail",
  "data": {
    "statusCode": 500,
    "result": {
      "error": "categoryName don't exist",
      "input": "dontExistcategoryName"
    }
  }
}
```
### Delete
```bash
(delete) /categories '- Admin can delete Category (if not in use) with categoryName, Auth Token User role required['Admin'], body {"categoryName": string }, return (JSON)'
-swagger 'http://localhost:3000/doc DELETE /categories/ Auth Token User role required['Admin'], body {"categoryName": "categoryName"}, return (JSON)'
-postman 'http://localhost:3000/categories DELETE /categories Auth Token User role required['Admin'], body {"categoryName": "categoryName"}, return (JSON)'
```
-Returns Eks.
```JSON
{
  "status": "success",
  "data": {
    "statusCode": 200,
    "result": {
      "message": "categoryName has been deleted",
      "input": "newCategoryName"
    }
  }
}
{
  "status": "fail",
  "data": {
    "statusCode": 404,
    "result": {
      "error": "category dont exist in database",
      "input": "DontExistCategoryName"
    }
  }
}
{
  "status": "fail",
  "data": {
    "statusCode": 500,
    "result": {
      "error": "category is associated with products, restricted for delete",
      "input": "Desktops"
    }
  }
}
```


# API BRANDS

### Get
```bash
(get) /brands '- Get all Brands in the database'
-swagger 'http://localhost:3000/doc GET /brands/ No Auth, No body {}, return (JSON )'
-postman 'http://localhost:3000/brands GET /brands No Auth, No body {}, return (JSON )'
```
-Returns Eks.
```JSON
{
  "status": "success",
  "data": {
    "statusCode": 200,
    "data": {
      "result": "brands found",
      "brands": [
        {
          "brandId": 1,
          "brandName": "Apple"
        },
        {
          "brandId": 2,
          "brandName": "Samsung"
        },
        {
          "brandId": 3,
          "brandName": "Xiaomi"
        },
        {
          "brandId": 4,
          "brandName": "MXQ"
        }
      ]
    }
  }
}
```
#### Post
```bash
(post) /brands '- Admin can Add new Brand with brandName Auth Token User role required['Admin'], body {"brandName": string }, return (JSON)'
 -swagger 'http://localhost:3000/doc POST /brands/ Auth Token User role required['Admin'], body {"brandName": "NewBrandName"}, return (JSON)'
 -postman 'http://localhost:3000/brands POST /brands Auth Token User role required['Admin'], body {"brandName": "NewBrandName"}, return (JSON)'
```
-Returns Eks.
```JSON
{
  "status": "success",
  "data": {
    "statusCode": 200,
    "result": {
      "message": "New brand has been added to the database",
      "input": "NewBrandName"
    }
  }
}
```
#### Put
```bash
(put) /brands '- Admin can update/change Brand with brandName, newBrandName, Auth Token User role required['Admin'], body {"brandName": string,
  "newBrandName": string }, retun (JSON)'
-swagger 'http://localhost:3000/doc PUT /brands/ Auth Token User role required['Admin'], body {"brandName": "NewBrandName",
  "newBrandName": "updatedBrandName"}, retun (JSON)'
-postman 'http://localhost:3000/brands PUT /brands Auth Token User role required['Admin'], body {"brandName": "NewBrandName",
  "newBrandName": "updatedBrandName"}, retun (JSON)'
```
-Returns Eks.
```JSON
{
  "status": "success",
  "data": {
    "statusCode": 200,
    "result": {
      "message": "brandName has been updated"
    }
  }
}
{
  "status": "fail",
  "data": {
    "statusCode": 500,
    "result": {
      "error": "newbrandName exist, please choose a newBrandName",
      "input": "updatedBrandName"
    }
  }
}
{
  "status": "fail",
  "data": {
    "statusCode": 404,
    "result": {
      "error": "brandName don't exist",
      "input": "dontExist"
    }
  }
}
```
#### Delete
```bash
(delete) /brands '- Admin can delete (if not in use) Brand with brandName, Auth Token User role required['Admin'], body {"brandName": string}, returns (JSON)'
-swagger 'http://localhost:3000/doc DELETE /brands/ Auth Token User role required['Admin'], body {"brandName": "updatedBrandName"}, returns (JSON)'
-postman 'http://localhost:3000/brands DELETE /brands Auth Token User role required['Admin'], body {"brandName": "dontExist"}, returns (JSON)'
```
-Returns Eks.
```JSON
{
  "status": "success",
  "data": {
    "statusCode": 200,
    "result": {
      "message": "brandName has been deleted",
      "input": "updatedBrandName"
    }
  }
}
{
  "status": "fail",
  "data": {
    "statusCode": 500,
    "result": {
      "error": "brandName don't exist",
      "input": "dontExist"
    }
  }
}
{
  "status": "fail",
  "data": {
    "statusCode": 500,
    "result": {
      "error": "brand is associated with products, restricted for delete",
      "input": "Apple"
    }
  }
}
```

# API SEARCH

# Post
```bash
(post) /search '- Any user can Search, can search by product name(partial), categoryName or brandName, Auth Token not required, 
body {"product": string, "categoryName": string, "brandName": string}, returns (JSON)'
 -swagger 'http://localhost:3000/doc POST /search/ No Auth, body {"product": "a", "categoryName": "", "brandName": ""}, return (JSON)'
 -postman 'http://localhost:3000/search POST /search No Auth, body {"product": "", "categoryName": "", "brandName": "Samsung"}, return (JSON)'
```
-Returns Eks.
```JSON
{
  "status": "success",
  "data": {
    "statusCode": 200,
    "data": {
      "result": "product found",
      "products": [
        {
          "productId": 2,
          "productName": "Apple TV 2016",
          "description": "The future of television is here.",
          "quantity": 10,
          "price": 599,
          "discount": 0,
          "imgUrl": "http://images.restapi.co.za/products/product-apple-tv.png",
          "categoryId": 2,
          "brandId": 1,
          "isdeleted": 0,
          "createdAt": "2024-05-11T07:22:04.000Z",
          "updatedAt": "2024-05-11T07:22:04.000Z"
        },
        {
          "productId": 4,
          "productName": "Apple Watch Sport Edition",
          "description": "You. At a glance",
          "quantity": 1,
          "price": 399,.... more products
        }]
    }
  }
}
{
  "status": "success",
  "data": {
    "statusCode": 200,
    "data": {
      "result": "product found",
      "products": [
        {
          "productId": 2,
          "productName": "Apple TV 2016",
          "description": "The future of television is here.",
          "quantity": 10,
          "price": 599,
          "discount": 0,
          "imgUrl": "http://images.restapi.co.za/products/product-apple-tv.png",
          "categoryId": 2,
          "brandId": 1,
          "isdeleted": 0,
          "createdAt": "2024-05-11T07:22:04.000Z",
          "updatedAt": "2024-05-11T07:22:04.000Z",
          "categoryName": "TVs"
        },
        {
          "productId": 12,
          "productName": "Xiaomi 4K Ultra HD TV Box S Media Player (2nd Gen)",
          "description": "360 Bluetooth...".... more Category Name search 
        }]
    }
  }
}
{
  "status": "success",
  "data": {
    "statusCode": 200,
    "data": {
      "result": "product found",
      "products": [
        {
          "productId": 10,
          "productName": "Samsung Galaxy S21 FE 5G 128GB",
          "description": "Dual Sim card - Lavender color",
          "quantity": 15,
          "price": 398,
          "discount": 0,
          "imgUrl": "http://images.restapi.co.za/products/product-samsung-s21-FE.png",
          "categoryId": 1,
          "brandId": 2,
          "isdeleted": 0,
          "createdAt": "2024-05-11T07:22:04.000Z",
          "updatedAt": "2024-05-11T07:22:04.000Z",
          "brandName": "Samsung"
        },
        {
          "productId": 11,
          "productName": "Samsung Galaxy A24 128GB LTE",
          "description": "Dual Sim card - Black color",
          "quantity": 15,.... more Brands Name serach
        }]
    }
  }
}
{
  "status": "fail",
  "data": {
    "statusCode": 500,
    "result": {
      "error": "Require productName or categoryName or brandName",
      "productName": "",
      "categoryName": "",
      "brandName": ""
    }
  }
}
```

# API CART
```bash
(get) /cart '- Admin get all Carts (including: softe deleted) User Get her/his Cart in the database Auth Token User role required['Admin','Users']'
-swagger 'http://localhost:3000/doc GET /cart/ Auth Token User role required['Admin','Users'], return (JSON)'
-postman 'http://localhost:3000/cart GET /cart Auth Token User role required['Admin','Users'], return (JSON)'
```
-Returns Eks.
```JSON
// User id 3 
{
    "status": "success",
    "data": {
        "statusCode": 200,
        "data": {
            "result": "product found",
            "products": [
                {
                    "id": 3,
                    "userId": 3,
                    "productId": "5",
                    "quantity": 1,
                    "price": 599,
                    "discount": 0,
                    "isdeleted": 0,
                    "createdAt": "2024-05-13T04:30:46.000Z",
                    "updatedAt": "2024-05-13T04:30:46.000Z"
                },
                {
                    "id": 4,
                    "userId": 3,
                    "productId": "12",
                    "quantity": 1,
                    "price": 49,
                    "discount": 0,
                    "isdeleted": 0,
                    "createdAt": "2024-05-13T04:30:53.000Z",
                    "updatedAt": "2024-05-13T04:30:53.000Z"
                }
            ]
        }
    }
}
// User id 2
{
    "status": "success",
    "data": {
        "statusCode": 200,
        "data": {
            "result": "product found",
            "products": [
                {
                    "id": 1,
                    "userId": 2,
                    "productId": "7",
                    "quantity": 1,
                    "price": 99,
                    "discount": 0,
                    "isdeleted": 0,
                    "createdAt": "2024-05-13T03:50:28.000Z",
                    "updatedAt": "2024-05-13T03:50:28.000Z"
                },
                {
                    "id": 2,
                    "userId": 2,
                    "productId": "4",
                    "quantity": 1,
                    "price": 399,
                    "discount": 0,
                    "isdeleted": 0,
                    "createdAt": "2024-05-13T04:29:21.000Z",
                    "updatedAt": "2024-05-13T04:29:21.000Z"
                }
            ]
        }
    }
}
// Admin user
{
    "status": "success",
    "data": {
        "statusCode": 200,
        "data": {
            "result": "product found",
            "products": [
                {
                    "id": 1,
                    "userId": 2,
                    "productId": "7",
                    "quantity": 1,
                    "price": 99,
                    "discount": 0,
                    "isdeleted": 0,
                    "createdAt": "2024-05-13T03:50:28.000Z",
                    "updatedAt": "2024-05-13T03:50:28.000Z"
                },
                {
                    "id": 2,
                    "userId": 2,
                    "productId": "4",
                    "quantity": 1,
                    "price": 399,
                    "discount": 0,
                    "isdeleted": 0,
                    "createdAt": "2024-05-13T04:29:21.000Z",
                    "updatedAt": "2024-05-13T04:29:21.000Z"
                },
                {
                    "id": 3,
                    "userId": 3,
                    "productId": "5",
                    "quantity": 1,
                    "price": 599,
                    "discount": 0,
                    "isdeleted": 0,
                    "createdAt": "2024-05-13T04:30:46.000Z",
                    "updatedAt": "2024-05-13T04:30:46.000Z"
                },
                {
                    "id": 4,
                    "userId": 3,
                    "productId": "12",
                    "quantity": 1,
                    "price": 49,
                    "discount": 0,
                    "isdeleted": 0,
                    "createdAt": "2024-05-13T04:30:53.000Z",
                    "updatedAt": "2024-05-13T04:30:53.000Z"
                },
                {
                    "id": 5,
                    "userId": 4,
                    "productId": "9",
                    "quantity": 1,
                    "price": 399,
                    "discount": 0,
                    "isdeleted": 1,
                    "createdAt": "2024-05-13T13:15:53.000Z",
                    "updatedAt": "2024-05-13T13:16:05.000Z"
                },
                {
                    "id": 6,
                    "userId": 4,
                    "productId": "7",
                    "quantity": 1,
                    "price": 99,
                    "discount": 0,
                    "isdeleted": 1,
                    "createdAt": "2024-05-13T13:15:59.000Z",
                    "updatedAt": "2024-05-13T13:16:05.000Z"
                }
            ]
        }
    }
}
```
### Post /cart

```bash
(post) /cart 'A User can add product to his/her cart, Auth Token User role required['Users'], body {
    "productId": integer,
    "quantity": integer
}, return (JSON)'
 -swagger 'http://localhost:3000/doc POST /cart/ Auth Token User role required['Users'], body {
    "productId": 7,
    "quantity": 1
} return (JSON)'
 -postman 'http://localhost:3000/cart POST /cart Auth Token User role required['Users'], body {
    "productId": 2,
    "quantity": 1
} return (JSON)'
```
-Returns Eks.
```JSON
{
    "status": "success",
    "data": {
        "statusCode": 200,
        "result": {
            "message": "product added to cart"
        }
    }
}
{
  "status": "fail",
  "data": {
    "statusCode": 404,
    "result": {
      "Quantity": "quantity asked, larger then product is in stock."
    }
  }
}
{
  "status": "fail",
  "data": {
    "statusCode": 403,
    "result": {
      "error": "Privileges Admin or user rights [Required] !!"
    }
  }
}
```

### Post /cart/checkout
```bash
(post) /cart/checkout/ '- User Checks out his cart (A Order is created) Auth Token User role required['Users'], return (JSON)'
 -swagger 'http://localhost:3000/doc POST /cart/checkout/ Auth Token User role required['Users'], return (JSON)'
 -postman 'http://localhost:3000/cart/checkout POST /cart/checkout Auth Token User role required['Users'], return (JSON)'
```
-Returns Eks.
```JSON
{
    "status": "success",
    "data": {
        "statusCode": 200,
        "data": {
            "result": "Order created"
        }
    }
}
{
    "status": "fail",
    "data": {
        "statusCode": 404,
        "result": {
            "error": "No product in cart"
        }
    }
}
{
  "status": "fail",
  "data": {
    "statusCode": 403,
    "result": {
      "error": "Privileges Admin or user rights [Required] !!"
    }
  }
}
```

### Put
```bash
(put) /cart '- User can update/change products quantity (product removed on quantity = 0), Auth Token User role required['Users'], body { "productId": integer, "quantity": integer }, return (JSON)'
-swagger 'http://localhost:3000/doc PUT /cart/ body { "productId": 12, "quantity": 1 }, Auth Token User role required['Users'], return (JSON)'
-postman 'http://localhost:3000/cart PUT /cart body { "productId": 6, "quantity": 1 }, Auth Token User role required['Users'], return (JSON)'
```
-Returns Eks.
```JSON
{
    "status": "fail",
    "data": {
        "statusCode": 404,
        "result": {
            "error": "Product dont exist in cart",
            "input": 6
        }
    }
}
{
    "status": "success",
    "data": {
        "statusCode": 200,
        "result": {
            "message": "product quantity updated to cart"
        }
    }
}
// input quantity: 0
{
    "status": "success",
    "data": {
        "statusCode": 200,
        "result": {
            "message": "product removed from cart"
        }
    }
}
{
    "status": "fail",
    "data": {
        "statusCode": 404,
        "result": {
            "error": "Not enough Proudct quantity in stock"
        }
    }
}
```
### Delete
```bash
(delete) /cart '- User can remove a product from the cart, Auth Token User role required['Users'], body { "productId": integer }, return (JSON)'
-swagger 'http://localhost:3000/doc DELETE /cart/ body { "productId": 12 }, Auth Token User role required['Users'], return (JSON)'
-postman 'http://localhost:3000/cart DELETE /cart body { "productId": 7 }, Auth Token User role required['Users'], return (JSON)'
```
-Returns Eks.
```JSON
{
    "status": "success",
    "data": {
        "statusCode": 200,
        "result": {
            "message": "product removed from cart"
        }
    }
}
{
    "status": "fail",
    "data": {
        "statusCode": 404,
        "result": {
            "error": "Product dont exist in cart",
            "input": 7
        }
    }
}
```
## API ORDERS
```bash
(get) /orders '- Admin get all Orders, User can se all there Orders. Auth Token User role required['Admin','Users'], body {}, return (JSON)'
-swagger 'http://localhost:3000/doc GET /orders/ Auth Token User role required['Admin','Users'], return (JSON)'
-postman 'http://localhost:3000/orders GET /orders Auth Token User role required['Admin','Users'], return (JSON)'
```
-Returns Eks.
```JSON
{
    "status": "fail",
    "data": {
        "statusCode": 403,
        "result": {
            "error": "Privileges Admin or user rights [Required] !!"
        }
    }
}
// User (Token Auth login), no Orders
{
    "status": "success",
    "data": {
        "statusCode": 200,
        "data": {
            "orders": []
        }
    }
}
// user Id = 4 (Token Auth login)
{
    "status": "success",
    "data": {
        "statusCode": 200,
        "data": {
            "orders": [
                {
                    "orderNumber": "0eb44893",
                    "userId": 4,
                    "cartId": 5,
                    "productItemIds": "7,9",
                    "userDiscountIds": "1",
                    "userCartId": "5",
                    "statusIds": "1",
                    "createdAt": "2024-05-13T13:16:05.000Z",
                    "updatedAt": "2024-05-13T13:16:05.000Z"
                }
            ]
        }
    }
}
// Admin (Token Auth login)
{
    "status": "success",
    "data": {
        "statusCode": 200,
        "data": {
            "orders": [
                {
                    "orderNumber": "0eb44893",
                    "userId": 4,
                    "cartId": 5,
                    "productItemIds": "7,9",
                    "userDiscountIds": "1",
                    "userCartId": "5",
                    "statusIds": "1",
                    "createdAt": "2024-05-13T13:16:05.000Z",
                    "updatedAt": "2024-05-13T13:16:05.000Z",
                    "statusNames": "In Progress",
                    "MembersShip": "Bronze"
                }
            ],
            "listProducts": [
                {
                    "productId": 7,
                    "productName": "9.7-inch iPad Pro 32Gb",
                    "description": "3D Touch. 12MP photos. 4K video.",
                    "quantity": 17,
                    "price": 99,
                    "discount": 0,
                    "imgUrl": "http://images.restapi.co.za/products/product-ipad-pro.png",
                    "categoryId": 6,
                    "brandId": 1,
                    "isdeleted": 0,
                    "createdAt": "2024-05-11T07:22:04.000Z",
                    "updatedAt": "2024-05-13T13:16:05.000Z"
                },
                {
                    "productId": 9,
                    "productName": "iPad Air 2 32/64Gb",
                    "description": "Light. Heavyweight",
                    "quantity": 54,
                    "price": 399,
                    "discount": 0,
                    "imgUrl": "http://images.restapi.co.za/products/product-ipad-air.png",
                    "categoryId": 6,
                    "brandId": 1,
                    "isdeleted": 0,
                    "createdAt": "2024-05-11T07:22:04.000Z",
                    "updatedAt": "2024-05-13T13:16:05.000Z"
                }
            ]
        }
    }
}
```
### Post
```bash
(post) / '- Admin can change a User cart to and Order. - Orders are usally Made throue /cartcheckout/ this is extra as of "All tables that are created must have CRUD endpoinst" required Auth Token role ['Admin']. Admin will use a userEmail, check if cart exist - change user Cart to an Order, body { "userEmail": string }, retrun (JSON)'
 -swagger 'http://localhost:3000/doc POST /orders/ Auth Token User role required['Admin'], body { "userEmail": "test@test.no" }, return (JSON)'
 -postman 'http://localhost:3000/orders POST /orders Auth Token User role required['Admin'], body { "userEmail": "test@test.no" }, return (JSON)'
```
-Returns Eks.
```JSON
{
    "status": "success",
    "data": {
        "statusCode": 200,
        "data": {
            "result": "Order created"
        }
    }
}
{
    "status": "fail",
    "data": {
        "statusCode": 404,
        "result": {
            "error": "No product in cart"
        }
    }
}
{
    "status": "fail",
    "data": {
        "statusCode": 500,
        "result": {
            "email": "Email is required, check format."
        }
    }
}
```
### Put
```bash
(put) /orders '- Admin update/change order status. Auth Token User role required['Admin'] body{ "orderNumber": uuid-string, "statusId": integer }, return (JSON)'
-swagger 'http://localhost:3000/doc PUT /orders/ Auth Token User role required['Admin'], body { "orderNumber": "0eb44893", "statusId": 2 }, return (JSON)'
-postman 'http://localhost:3000/orders PUT /orders Auth Token User role required['Admin'], body { "orderNumber": "0eb44893", "statusId": 3 }, return (JSON)'
```
-Returns Eks.
```JSON
{
    "status": "success",
    "data": {
        "statusCode": 200,
        "data": {
            "result": "Orders to be updated",
            "updateOrderList": [
                2
            ],
            "orderList": [
                {
                    "id": 1,
                    "orderNumber": "0eb44893",
                    "userId": 4,
                    "productItemId": 9,
                    "userDiscountId": 1,
                    "statusId": 2,
                    "createdAt": "2024-05-13T13:16:05.000Z",
                    "updatedAt": "2024-05-15T10:02:36.000Z",
                    "cartId": 5
                },
                {
                    "id": 2,
                    "orderNumber": "0eb44893",
                    "userId": 4,
                    "productItemId": 7,
                    "userDiscountId": 1,
                    "statusId": 2,
                    "createdAt": "2024-05-13T13:16:05.000Z",
                    "updatedAt": "2024-05-15T10:02:36.000Z",
                    "cartId": 5
                }
            ]
        }
    }
}
// orderNumber not found:
{
    "status": "success",
    "data": {
        "statusCode": 200,
        "data": {
            "result": "Orders to be updated",
            "updateOrderList": [
                0
            ],
            "orderList": []
        }
    }
}
// wrong statusId input
{
    "status": "fail",
    "data": {
        "statusCode": 500,
        "result": {
            "error": "Require statusId, Not a integer value, value between 1 - 3",
            "input": 4
        }
    }
}
```
~### Delete~
```bash
'(All tables that are created must have CRUD endpoinst) not implemented on AdminWeb page'
(delete) / 'Admin can delete a Order by OrderNumber, body { "OrderNumber": "uuid-string" }'
-swagger 'http://localhost:3000/doc DELETE /orders/ Auth Token role ['Admin'], { "orderNumber": "3f621a5a" }, return (JSON)'
-postman 'http://localhost:3000/orders DELETE /orders Auth Token role ['Admin'], { "orderNumber": "1967adac" }, return (JSON)'
```
-Returns Eks.
```JSON
{
    "status": "success",
    "data": {
        "statusCode": 200,
        "data": {
            "result": "Order deleted from database"
        }
    }
}
{
    "status": "fail",
    "data": {
        "statusCode": 404,
        "result": {
            "error": "OrderNumber not found",
            "input": "3f621a5a"
        }
    }
}
{
    "status": "fail",
    "data": {
        "statusCode": 403,
        "result": {
            "error": "Privileges Admin rights [Required] !!"
        }
    }
}
```
## API USERS
```bash
(get) /users '- Admin get all Users with there History. User logged inn, se there DataHistory. Auth Token role required['Admin'], return (JSON)'
-swagger 'http://localhost:3000/doc GET /users/ Auth Token role required['Admin'], return (JSON)'
-postman 'http://localhost:3000/users GET /users Auth Token role required['Admin'], return (JSON)'
```
-Returns Eks.
```JSON
{
  "status": "success",
  "data": {
    "statusCode": 200,
    "data": {
      "users": [
        {
          "userId": 1,
          "memberId": 1,
          "roleId": 1,
          "firstName": "Admin",
          "lastName": "Support",
          "userName": "Admin",
          "address": "Online",
          "telephonenumber": 911,
          "email": "admin@noroff.no"
        },
        {
          "userId": 2,
          "memberId": 1,
          "roleId": 2,
          "firstName": "Robin",
          "lastName": "larsen",
          "userName": "dissolution",
          "address": "onlin",
          "telephonenumber": 45,
          "email": "test@test.com"
        },
        {
          "userId": 3,
          "memberId": 1,
          "roleId": 2,
          "firstName": "Olea",
          "lastName": "larsen",
          "userName": "dissolution75",
          "address": "onlin",
          "telephonenumber": 23456,
          "email": "test@2test.com"
        },
        {
          "userId": 4,
          "memberId": 1,
          "roleId": 2,
          "firstName": "Test",
          "lastName": "test",
          "userName": "dissolutionTest",
          "address": "onlin",
          "telephonenumber": 3434342,
          "email": "test@777test.com"
        }
      ],
      "DataHistory": [
        {
          "id": 1,
          "userId": 4,
          "historyPurchures": 2,
          "createdAt": "2024-05-13T13:16:05.000Z",
          "updatedAt": "2024-05-13T13:16:05.000Z"
        },
        {
          "id": 2,
          "userId": 2,
          "historyPurchures": 6,
          "createdAt": "2024-05-13T18:42:36.000Z",
          "updatedAt": "2024-05-15T09:54:12.000Z"
        },
        {
          "id": 3,
          "userId": 3,
          "historyPurchures": 4,
          "createdAt": "2024-05-15T00:21:20.000Z",
          "updatedAt": "2024-05-15T01:52:39.000Z"
        }
      ]
    }
  }
}
```
~### Post~
```bash
(post) /users '- This is not Implemented, user are registrated with /Auth/Registrate'
 -swagger 'http://localhost:3000/doc POST /users/ Auth Token role ['Admin'], return (JSON)'
 -postman 'http://localhost:3000/orders POST /users Auth Token role ['Admin'], return (JSON)'
```
-Returns Eks.
```JSON
{
  "status": "fail",
  "data": {
    "statusCode": 500,
    "result": {
      "error": "Not in use..."
    }
  }
}
```
### Put
```bash
(put) /users '- Admin can change/update User Privileges to Admin: "Rights" or Back to User: "Rights", Auth Token User role required['Admin'] body { "userId": integer, "roleName": string }, return (JSON)'
-swagger 'http://localhost:3000/doc PUT /users/ Auth Token role ['Admin'], body { "userId": 2,"roleName": "Admin"  } return (JSON)'
-postman 'http://localhost:3000/users PUT /users Auth Token role ['Admin'], body { "userId": 2,"roleName": "Admin"  } return (JSON)'
```
-Returns Eks.
```JSON
{
  "status": "success",
  "data": {
    "statusCode": 200,
    "result": {
      "message": "User privileges updated"
    }
  }
}
// 'Admin' UserId 1.
{
  "status": "fail",
  "data": {
    "statusCode": 500,
    "result": {
      "error": "Privileges On Admin cant be changed!!"
    }
  }
}
{
  "status": "fail",
  "data": {
    "statusCode": 500,
    "result": {
      "error": "Error roleName dose not exist"
    }
  }
}
```
### Delete
```bash
(delete) /users '- Admin can Delete user. Senario: User is not active, havent bouth anything - no history. Auth Token User role required['Admin'] body { "userId": integer }, return (JSON)'
-swagger 'http://localhost:3000/doc DELETE /users/ Auth Token role ['Admin'], body { "userId": 2 } return (JSON)'
-postman 'http://localhost:3000/doc DELETE /users Auth Token role ['Admin'], body { "userId": 5 } return (JSON)'
```
-Returns Eks.
```JSON
{
  "status": "fail",
  "data": {
    "statusCode": 500,
    "result": {
      "error": "User is active, restricted to delete.."
    }
  }
}
{
  "status": "success",
  "data": {
    "statusCode": 200,
    "result": {
      "message": "User is deleted from the database.."
    }
  }
}
{
  "status": "fail",
  "data": {
    "statusCode": 404,
    "result": {
      "error": "User dont exist.."
    }
  }
}
```
## API ROLES
```bash
(get) /roles '- Admin get all roles in the database. Auth Token User role required['Admin'], return (JSON)'
-swagger 'http://localhost:3000/doc GET /roles/ Auth Token role ['Admin'], return (JSON)'
-postman 'http://localhost:3000/roles GET /roles/ Auth Token role ['Admin'], return (JSON)'
```
-Returns Eks.
```JSON
{
  "status": "success",
  "data": {
    "statusCode": 200,
    "data": {
      "roles": [
        {
          "roleId": 1,
          "roleName": "Admin"
        },
        {
          "roleId": 2,
          "roleName": "User"
        }
      ]
    }
  }
}
```
~### Post~
```bash
(post) /roles '- This is not Implemented, Auth Token required Roles { 'Admin' }, roles initilized on init post.'
 -swagger 'http://localhost:3000/doc POST /roles/ Auth Token role ['Admin'], return (JSON)'
 -postman 'http://localhost:3000/roles POST /roles Auth Token role ['Admin'], return (JSON)'
```
-Returns Eks.
```JSON
{
    "status": "fail",
    "data": {
        "statusCode": 500,
        "result": {
            "error": "POST for Roles is not implemented"
        }
    }
}
```
~### Put~
```bash
(put) /roles '- This is not Implemented, Auth Token required Roles { 'Admin' }'
-swagger 'http://localhost:3000/doc PUT /roles/ Auth Token role ['Admin'], return (JSON)'
-postman 'http://localhost:3000/roles PUT /roles Auth Token role ['Admin'], return (JSON)'
```
-Returns Eks.
```JSON
{
    "status": "fail",
    "data": {
        "statusCode": 500,
        "result": {
            "error": "PUT for Roles is not implemented"
        }
    }
}
```
~### Delete~
```bash
(delete) /roles '- This is not Implemented, Auth Token required Roles { 'Admin' }'
-swagger 'http://localhost:3000/doc DELETE /roles/ Auth Token role ['Admin'], return (JSON)'
-postman 'http://localhost:3000/roles DELETE /roles Auth Token role ['Admin'], return (JSON)'
```
-Returns Eks.
```JSON
{
    "status": "fail",
    "data": {
        "statusCode": 500,
        "result": {
            "error": "DELETE for Roles is not implemented"
        }
    }
}
```
## API MEMBERSHIPS
```bash
(get) / '- Admin get All Memberships and data on users. Users get there Own data: {userId, userName, memberShipName, discount ,purchureHistory}, Auth Token required Roles { 'Admin' }'
-swagger 'http://localhost:3000/doc GET /membership/ Auth Token role ['Admin'], return (JSON)'
-postman 'http://localhost:3000/membership GET /membership Auth Token role ['Admin'], return (JSON)'
```
-Returns Eks.
```JSON
{
  "status": "success",
  "data": {
    "statusCode": 200,
    "data": {
      "membership": [
        {
          "memberId": 1,
          "MemberShipName": "Bronze",
          "discount": 0
        },
        {
          "memberId": 2,
          "MemberShipName": "Silver",
          "discount": 15
        },
        {
          "memberId": 3,
          "MemberShipName": "Gold",
          "discount": 30
        }
      ],
      "DataCollectionList": [
        {
          "userId": 1,
          "userName": "Admin",
          "memberId": 1,
          "memberShipName": "Bronze",
          "discountValue": 0,
          "purchureCount": ""
        },
        {
          "userId": 2,
          "userName": "dissolution",
          "memberId": 1,
          "memberShipName": "Bronze",
          "discountValue": 0,
          "purchureCount": 6
        },
        {
          "userId": 3,
          "userName": "dissolution75",
          "memberId": 1,
          "memberShipName": "Bronze",
          "discountValue": 0,
          "purchureCount": 4
        },
        {
          "userId": 4,
          "userName": "dissolutionTest",
          "memberId": 1,
          "memberShipName": "Bronze",
          "discountValue": 0,
          "purchureCount": 2
        }
      ]
    }
  }
}
```
### Post
```bash
(post) /membership '- Admin Add new Memberships: On index Gap: new membership use gap, else Highest index + 1 NB ! no consideration on Discount value Admins dicretion. Auth Token required Roles { 'Admin' }, body {"memberShipName": string, "discount": integer}, return (JSON)'
 -swagger 'http://localhost:3000/doc POST /membership/ Auth Token role ['Admin'], body{ "memberShipName": "Extra Virgine", "discount": 45 }, return (JSON)'
 -postman 'http://localhost:3000/membership POST /membership Auth Token role ['Admin'], body{ "memberShipName": "Gold", "discount": 45 }, return (JSON)'
```
-Returns Eks.
```JSON
{
  "status": "success",
  "data": {
    "statusCode": 200,
    "result": {
      "message": "New memberShip has been added to the database",
      "memberShip": {
        "memberId": 4,
        "MemberShipName": "Extra Virgine",
        "discount": 45
      }
    }
  }
}
{
  "status": "fail",
  "data": {
    "statusCode": 500,
    "result": {
      "message": "MemeberShip restricted, MemeberShip exist."
    }
  }
}
{
    "status": "fail",
    "data": {
        "statusCode": 403,
        "result": {
            "error": "Privileges Admin rights [Required] !!"
        }
    }
}
```
### Put
```bash
(put) /membership '- Admin Update/change Memberships body {
  "memberId": integer,
  "MemberShipName": string,
  "newMemberShipName": string,
  "discount": integer,
  "newDiscount": integer
}, Auth Token role ['Admin'], return (JSON)'
-swagger 'http://localhost:3000/doc PUT /membership/ Auth Token role ['Admin'], body{"memberId": 2,
  "MemberShipName": "Silver",
  "newMemberShipName": "Silver Upgraded",
  "discount": 15,
  "newDiscount": 20
}, return (JSON)'
-postman 'http://localhost:3000/membership PUT /membership Auth Token role ['Admin'], body{"memberId": 2,
  "MemberShipName": "Silver",
  "newMemberShipName": "Silver Upgraded",
  "discount": 15,
  "newDiscount": 20
}, return (JSON)'
```
-Returns Eks.
```JSON
{
  "status": "success",
  "data": {
    "statusCode": 200,
    "result": {
      "message": "Updated/Changed post",
      "updateObject": {
        "update_MemberShipName": "true",
        "update_discount": "true"
      }
    }
  }
}
{
    "status": "fail",
    "data": {
        "statusCode": 400,
        "result": {
            "message": "No Updated/Changed to post done",
            "updateObject": {
                "update_MemberShipName": "fail",
                "update_discount": "fail"
            }
        }
    }
}
{
    "status": "fail",
    "data": {
        "statusCode": 500,
        "result": {
            "error": "MemberId is required"
        }
    }
}
{
    "status": "fail",
    "data": {
        "statusCode": 403,
        "result": {
            "error": "Privileges Admin rights [Required] !!"
        }
    }
}
```
### Delete
```bash
(delete) /membership '- Admin Delete Memberships if not in use. Auth Token user role ['Admin'], body { "memberId": integer, "MemberShipName": string }, return (JSON)'
-swagger 'http://localhost:3000/doc DELETE /membership/ Auth Token role ['Admin'], body { "memberId": 2, "MemberShipName": "Silver" }, return (JSON)'
-postman 'http://localhost:3000/membership DELETE /membership Auth Token role ['Admin'], body { "memberId": 4, "MemberShipName": "Extra Virgine" }, return (JSON)'
```
-Returns Eks.
```JSON
{
    "status": "fail",
    "data": {
        "statusCode": 500,
        "result": {
            "error": "Require memberId, check format",
            "input": "2f"
        }
    }
}
{
    "status": "fail",
    "data": {
        "statusCode": 500,
        "result": {
            "error": "Require MemberShipName, check format",
            "input": ""
        }
    }
}
{
  "status": "success",
  "data": {
    "statusCode": 200,
    "result": {
      "message": "Removed MemeberShip from database!!"
    }
  }
}
{
  "status": "fail",
  "data": {
    "statusCode": 500,
    "result": {
      "message": "Delete restricted, MemeberShip in use.."
    }
  }
}
```
## API USERDISCOUNTLOGG
```bash
(get) /history '- Admin can get all users bouth history (linked to MemberShip status)'
-swagger 'http://localhost:3000/doc GET /history/ Auth Token user role required['Admin'], return (JSON)'
-postman 'http://localhost:3000/history GET /history Auth Token user role required['Admin'], return (JSON)'
```
-Returns Eks.
```JSON
{
  "status": "success",
  "data": {
    "statusCode": 200,
    "data": {
      "result": "users found",
      "userHistory": [
        {
          "id": 1,
          "userId": 4,
          "historyPurchures": 2,
          "createdAt": "2024-05-13T13:16:05.000Z",
          "updatedAt": "2024-05-13T13:16:05.000Z"
        },
        {
          "id": 2,
          "userId": 2,
          "historyPurchures": 3,
          "createdAt": "2024-05-13T18:42:36.000Z",
          "updatedAt": "2024-05-16T02:42:57.000Z"
        },
        {
          "id": 3,
          "userId": 3,
          "historyPurchures": 4,
          "createdAt": "2024-05-15T00:21:20.000Z",
          "updatedAt": "2024-05-15T01:52:39.000Z"
        }
      ]
    }
  }
}
```
~### Post~
```bash
(post) /history '- This is not Implemented [WebAdmin], User history initilized in /cart/checkout, Auth Token required Roles { 'Admin' }, body { "userId": integer }, return (JSON)'
 -swagger 'http://localhost:3000/doc POST /history/ Auth Token role ['Admin'], body{ "userId": 2 }, return (JSON)'
 -postman 'http://localhost:3000/history POST /roles Auth Token role ['Admin'], body{ "userId": 5 }, return (JSON)'
```
-Returns Eks.
```JSON
{
    "status": "success",
    "data": {
        "statusCode": 200,
        "data": {
            "result": "Users History created"
        }
    }
}
{
    "status": "success",
    "data": {
        "statusCode": 200,
        "data": {
            "result": "Users History Allready exist!!"
        }
    }
}
{
    "status": "fail",
    "data": {
        "statusCode": 404,
        "result": {
            "error": "User not found!!",
            "input": 5
        }
    }
}
{
    "status": "fail",
    "data": {
        "statusCode": 403,
        "result": {
            "error": "Privileges Admin rights [Required] !!"
        }
    }
}
```
### Put
```bash
(put) /history '- Admin Update/change UserHistory (bouth products), can be used to test MemberShip Discount. NB(change history up to next level of MemberShip example 0 - 15, change to 15. next buy will give next memeberShip) Auth Token role required['Admin'], body { "userId": integer, "updateHistory": integer }, return (JSON)'
-swagger 'http://localhost:3000/doc PUT /history/ Auth Token role ['Admin'], body {"userId": 2, "updateHistory": 15 }, return (JSON)'
-postman 'http://localhost:3000/doc PUT /history/ Auth Token role ['Admin'], body {"userId": 1, "updateHistory": 15 }, return (JSON)'
```
-Returns Eks.
```JSON
{
  "status": "success",
  "data": {
    "statusCode": 200,
    "data": {
      "result": "User history updated"
    }
  }
}
{
  "status": "success",
  "data": {
    "statusCode": 200,
    "data": {
      "result": "No User history, we create and updated",
      "input": 3,
      "update": {
        "id": 3,
        "userId": 3,
        "historyPurchures": 15,
        "updatedAt": "2024-05-17T02:05:30.414Z",
        "createdAt": "2024-05-17T02:05:30.414Z"
      }
    }
  }
}
{
    "status": "fail",
    "data": {
        "statusCode": 500,
        "result": {
            "error": "Require userId, check format",
            "input": "1f"
        }
    }
}
{
    "status": "fail",
    "data": {
        "statusCode": 401,
        "error": {
            "result": "User restricted",
            "input": 1
        }
    }
}
```
~### Delete~
```bash
(delete) /history '- Admin can resett user History, Auth Token required Roles { 'Admin' }, body { "userId": integer }, return (JSON)'
-swagger 'http://localhost:3000/doc DELETE /history/ Auth Token role ['Admin'], body{ "userId": 2 }, return (JSON)'
-postman 'http://localhost:3000/history DELETE /history Auth Token role ['Admin'], body{ "userId": 3 }, return (JSON)'
```
-Returns Eks.
```JSON
{
    "status": "success",
    "data": {
        "statusCode": 200,
        "data": {
            "result": "Users History resetted"
        }
    }
}
{
    "status": "fail",
    "data": {
        "statusCode": 404,
        "result": {
            "error": "User not found!!",
            "input": 3
        }
    }
}
{
    "status": "fail",
    "data": {
        "statusCode": 404,
        "result": {
            "error": "User discount not found, not resetted",
            "input": 5
        }
    }
}
```

# Env
```bash
HOST = "localhost"
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "P@ssw0rd"
DATABASE_NAME = "examen"
DIALECT='mysql'
DIALECTMODEL='mysql2'
PORT = "3000"
HOST = "localhost"
TOKEN_SECRET=04f41a07dec28e39db36f948bf6af1a426970f632266abde562938a1cf5811f40942502ebb662287fee3c08616fb31d80983a19878a9b83308709c4e35284445
```

# API SERVER PACKAGE INSTALLED
![api-server-pack](https://github.com/noroff-backend-1/aug22pt-ep1-dissolution2/assets/10289341/eda23cb5-61a2-44eb-80c6-9d54222d5a7b)


# API WEBADMIN
![admin_login_screen](https://github.com/noroff-backend-1/aug22pt-ep1-dissolution2/assets/10289341/64787980-19e3-4d72-a91f-a4cc2c3256f3)


## Table of Contents
- [ADMIN FEEDBACK](#admin-feedback)
- [ADMIN PRODUCTS](#admin-products)
- [ADMIN BRANDS](#admin-brands)
- [ADMIN CATEGORY](#admin-category)
- [ADMIN ROLES](#admin-roles)
- [ADMIN USERS](#admin-users)
- [ADMIN ORDERS](#admin-orders)
- [ADMIN MEMBERSHIPS](#admin-memberships)
- [WEBADMIN PACKAGE INSTALLED](#webadmin-package-installed)
- [VERSION](#version)
- [REFERENCES](#references)


# ADMIN FEEDBACK
Feedback: update, delete etc will be resived by a popup message example:
![admin_login_screen_error](https://github.com/noroff-backend-1/aug22pt-ep1-dissolution2/assets/10289341/5183c50a-577d-4c27-b9fa-d655e56df1c8)

Main page Products:
![admin_product_screen](https://github.com/noroff-backend-1/aug22pt-ep1-dissolution2/assets/10289341/030018cc-d6e0-44f4-8b17-efc9b00564c7)

Here admin can do products search by partial product name, by Categroy or Brand. Add, Remove and Update products.

# ADMIN PRODUCTS

Add product by admin:
![admin_product_ADD_screen](https://github.com/noroff-backend-1/aug22pt-ep1-dissolution2/assets/10289341/8ba08e7d-2fb7-4f51-a8ec-f7ccfeeb5520)

Remove(soft) product by admin:
![admin_product_DELETE_screen](https://github.com/noroff-backend-1/aug22pt-ep1-dissolution2/assets/10289341/dc2af078-4820-4900-87af-591397f28ecc)

Update product by admin:
![admin_product_Update_screen](https://github.com/noroff-backend-1/aug22pt-ep1-dissolution2/assets/10289341/c86aa114-c2ed-4252-85c9-25f53a84a3d8)


# ADMIN BRANDS
![admin_brands_screen](https://github.com/noroff-backend-1/aug22pt-ep1-dissolution2/assets/10289341/b5bbec97-82f5-4d35-b43b-fab655c2998c)

Brands: Add update remove 
![admin_brand_add_update_delete_screen](https://github.com/noroff-backend-1/aug22pt-ep1-dissolution2/assets/10289341/d084999a-b2ab-4a9f-8f02-0156f49bd9b4)

# ADMIN CATEGORY
![admin_categorys_screen](https://github.com/noroff-backend-1/aug22pt-ep1-dissolution2/assets/10289341/72a540f4-e3d4-4a34-a300-aa2bc361e45c)

Category: Add update remove 
![admin_category_add_update_delete_screen](https://github.com/noroff-backend-1/aug22pt-ep1-dissolution2/assets/10289341/2ef906d1-5f48-4420-8ce8-9d70846653c2)

# ADMIN ROLES
![admin_roles_screen](https://github.com/noroff-backend-1/aug22pt-ep1-dissolution2/assets/10289341/8e27e380-c7f0-46b9-8d56-f17d2608e7c8)

# ADMIN USERS
![admin_users_screen2](https://github.com/noroff-backend-1/aug22pt-ep1-dissolution2/assets/10289341/b96e8720-3884-4ff1-912b-2e17aceacabd)

User admin update priv:
![admin_users_updatePiv_screen](https://github.com/noroff-backend-1/aug22pt-ep1-dissolution2/assets/10289341/d2aeeae3-c4ca-4334-8adb-de564c561a08)

# ADMIN ORDERS
![admin_orders_screen](https://github.com/noroff-backend-1/aug22pt-ep1-dissolution2/assets/10289341/2b6f0693-c507-4e97-b60a-4605d7e01775)

Orders update status:
![admin_orders_Update_screen](https://github.com/noroff-backend-1/aug22pt-ep1-dissolution2/assets/10289341/a82397d7-edb8-45c0-ae00-fc5ec8d1e2a0)

# ADMIN MEMBERSHIPS
![admin_memberShip_screen](https://github.com/noroff-backend-1/aug22pt-ep1-dissolution2/assets/10289341/2ef004d4-62ad-4814-9d73-91a62a331d9d)

MemberShip: Add update remove
![admin_memberShip_add_update_delete_screen](https://github.com/noroff-backend-1/aug22pt-ep1-dissolution2/assets/10289341/4bd38777-edcb-43a9-a752-9503d18d11c3)


# WEBADMIN PACKAGE INSTALLED
![webAdmin-server-pack](https://github.com/noroff-backend-1/aug22pt-ep1-dissolution2/assets/10289341/5b81e7d0-937e-40ff-991b-b40165abb3ea)


# VERSION
```bash
version 'nodejs api-server | web-server'
command: 'node -v'
output: 'v20.11.1'
```

# REFERENCES

## General URL's
```bash
https://nodejs.org/api/crypto.html#crypto
https://www.w3schools.com/html/html_images.asp
https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap/removeNamedItem
https://www.w3schools.com/jsref/met_element_removeattribute.asp#:~:text=The%20removeAttribute()%20method%20removes%20an%20attribute%2C%20and%20does%20not,result%20will%20be%20the%20same.
https://www.geeksforgeeks.org/how-to-remove-duplicates-from-an-array-of-objects-using-javascript/
https://www.tutorialsteacher.com/regex/frequently-used-regex-patterns
https://jestjs.io/docs/expect
```

# Bootstrap
```bash
https://getbootstrap.com/
https://getbootstrap.com/docs/4.0/components/modal/
https://getbootstrap.com/docs/5.2/components/modal/
```

# CSS
```bash
https://web.dev/learn/css
```

# SEQUELIZE
```bash
https://sequelize.org/
https://sequelize.org/docs/v6/core-concepts/assocs/
```

# SQL
```bash
https://www.tutorialsteacher.com/sql

- SPESCIAL LOKED FOR: GROUP_CONCAT(DISTINCT..):
    https://www.w3resource.com/mysql/aggregate-functions-and-grouping/aggregate-functions-and-grouping-group_concat.php#google_vignette
    https://www.sqlshack.com/mysql-group_concat-function-overview/
- SPESCIAL LOKED FOR: ALIAS:
    https://www.w3schools.com/sql/sql_ref_as.asp
    https://www.w3schools.com/sql/sql_alias.asp
```
# Noroff & linkedin [School lecture's]
```bash
lecture material:
noroff & 
https://www.linkedin.com/
```
# JQuery
```bash
https://api.jquery.com/
https://www.tutorialsteacher.com/jquery
```
