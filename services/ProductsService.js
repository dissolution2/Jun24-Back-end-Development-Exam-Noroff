const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

class ProductsService {
    constructor(db) {
        this.client = db.sequelize;
        this.Products = db.Products;
        this.Category = db.Category;
        this.Brand = db.Brand;
    }

    async findNextIndex_Not_IN_USE(){
        return await sequelize.query(`select MAX(productId) + 1 As NextId
        from Products;`,
        { type: QueryTypes.SELECT });
    }

    async getOne(_productId){
        return await this.Products.findOne({
            where: { productId: _productId, isdeleted: 0}
        })
    }

    async getOneByIdAllStatus(_productId){
        return await this.Products.findOne({
            where: { productId: _productId }
        })
    }

    async getAllProductsWithBrandId(_brandId){
        return await this.Products.findAll({
            where: { brandId: _brandId }
        })
    }

    async getAllProductsWithCategoryId(_categoryId){
        return await this.Products.findAll({
            where: { categoryId: _categoryId }
        })
    }

    async getAll(){
        return await this.Products.findAll({
            where: {}
        })
    }

    async getAllRawSQL(){
        return await sequelize.query(`select * from Products join Category on Products.categoryId = Category.categoryId join Brand on Products.brandId = Brand.brandId order by updatedAt DESC;`,
        { type: QueryTypes.SELECT });
    }

    async getOneRawSQL(_productId){
        return await sequelize.query(`select * from Products join Category on Products.categoryId = Category.categoryId join Brand on Products.brandId = Brand.brandId where Products.productId = ${_productId};`,
        { type: QueryTypes.SELECT });
    }


    async searchAllPartRawSQL(_productName){
        return await sequelize.query(`select * from products where productName LIKE '${_productName}%';`,
        { type: QueryTypes.SELECT });
    }

    async searchAllProductsWithBrandId(_brandId){
        return await sequelize.query(`select * from Products join Brand on Products.brandId = Brand.brandId where Brand.brandId = ${_brandId};`,
        { type: QueryTypes.SELECT });
    }

    async searchAllProductsWithCategoryId(_categoryId){
        return await sequelize.query(`select * from Products join Category on Products.categoryId = Category.categoryId where Category.categoryId = ${_categoryId};`,
        { type: QueryTypes.SELECT });
    }
    
    // this is actually removed as we dont need it as we have createdAt "dataAdded"
    async create(_productId, _name, _description, _quantity, _price, _discount, _imgUrl, _categoryId, _brandId, _isdeleted ) {
        // console.log(productId, name, description, quantity, price,discount, imgUrl, dataAdded, categoryId, brandId, isdeleted);
        return await this.Products.create({
            productId: _productId,
            productName: _name,
            description: _description,
            quantity: _quantity,
            price: _price,
            discount: _discount,
            imgUrl: _imgUrl,
            categoryId: _categoryId,
            brandId: _brandId,
            isdeleted: _isdeleted
        })
    }

    async soft_delete_product(_productId){
        return await this.Products.update(
            {
                isdeleted: 1
            },
            {
                where: {productId: _productId}
            }
        )
    }

    async soft_unDelete_product(_productId){
       return await this.Products.update(
            {
                isdeleted: 0
            },
            {
                where: {productId: _productId}
            }
        ) 
    }

    

    async updateProductName(_productId, _productName){
        return await this.Products.update(
            {
                productName: _productName
            },
            {
                where: { productId: _productId }
            }
        )
    }

    async updateProductDescription(_productId, _description){
        return await this.Products.update(
            {
                description: _description
            },
            {
                where: { productId: _productId }
            }
        )
    }

    async updateProductQuantity(_productId, _updateQuantity){
        return await this.Products.update(
            {
                quantity: _updateQuantity
            },
            {
                where: { productId: _productId }
            }
        )
    }

    async updateProductPrice(_productId, _price){
        return await this.Products.update(
            {
                price: _price
            },
            {
                where: { productId: _productId }
            }
        )
    }

    async updateProductDiscount(_productId, _discount){
        return await this.Products.update(
            {
                discount: _discount
            },
            {
                where: { productId: _productId }
            }
        )
    }

    async updateProductImgUrl(_productId, _imgUrl){
        return await this.Products.update(
            {
                imgUrl: _imgUrl
            },
            {
                where: { productId: _productId }
            }
        )
    }

    async updateProductCategoryId(_productId, _categoryId){
        return await this.Products.update(
            {
                categoryId: _categoryId
            },
            {
                where: { productId: _productId }
            }
        )
    }
    
    
    async updateProductBrandId(_productId, _brandId ){
        return await this.Products.update(
            {
                brandId: _brandId
            },
            {
                where: { productId: _productId }
            }
        )

    }

}

module.exports = ProductsService;