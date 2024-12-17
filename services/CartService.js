const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

class CartService {
    constructor(db) {
        this.client = db.sequelize;
        this.Cart = db.Cart;
    }

    async getAll(_userId){
        return await this.Cart.findAll({
            where: { userId: _userId, isdeleted: 0}
        })
    }

    async getAllAdmin(){
        return await this.Cart.findAll({
            where: {}
        })
    }
    
    async getOne(_userId, _productId){
        return await this.Cart.findOne({
            where: { productId: _productId, userId: _userId, isdeleted: 0}
        })
    }

    async updateCartProductQuantity(_userId, _productId, _quantity){
        return await this.Cart.update(
            {
                quantity: _quantity,

            },
            {
                where: {
                    productId: _productId, userId: _userId, isdeleted: 0
                }
            }
        )
    }

    async softDeleteCart(_userId, _productId){
        return await this.Cart.update(
            {
                isdeleted: 1,

            },
            {
                where: {
                    productId: _productId, userId: _userId, isdeleted: 0
                }
            }
        )
    }

    async getId(_categoryName){
        return await sequelize.query(`SELECT category.categoryId FROM category WHERE category.categoryName = '${_categoryName}';`,
        { type: QueryTypes.SELECT });
    }

    // spesial NB!!
    async removeItemZeroQuantity(_userId, _productId){
        return await this.Cart.destroy({
            where: { userId: _userId, productId: _productId, isdeleted: 0 }
        })
    }


    async create(_userId, _productId, _quantity, _price, _discount ) {
        return await this.Cart.create({
            userId: _userId,
            productId: _productId,
            quantity: _quantity,
            price: _price,
            discount: _discount,
            isdeleted: 0,
        })
    }
    
}

module.exports = CartService;