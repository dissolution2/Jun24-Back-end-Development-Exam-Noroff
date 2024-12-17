const { QueryTypes, where } = require('sequelize');
const { sequelize } = require('../models');

class OrdersService {
    constructor(db) {
        this.client = db.sequelize;
        this.Orders = db.Orders;
    }

    async create(_orderNumber, _userId, _productItemId, _userDiscountId,_cartId) {
        return await this.Orders.create({
            orderNumber: _orderNumber,
            userId: _userId,
            productItemId:  _productItemId,
            userDiscountId: _userDiscountId,
            statusId: 1,
            cartId: _cartId
        })
    }

    async getAllOrderByUser(_userId){
        return await this.Orders.findAll({
            where: {userId: _userId}
        })
    }

    async getOneByOrderNumber(_orderNumber){
        return await this.Orders.findAll({
            where: {orderNumber: _orderNumber}
        })
    }

    async getAllRawSQLByOrderOfAdmin(){
            return await sequelize.query(`SELECT 
            o.orderNumber,
            o.userId,
            o.cartId,
            GROUP_CONCAT(DISTINCT o.productItemId) AS productItemIds,
            GROUP_CONCAT(DISTINCT o.userDiscountId) AS userDiscountIds,
            GROUP_CONCAT(DISTINCT o.cartId) AS userCartId,
            GROUP_CONCAT(DISTINCT o.statusId) AS statusIds,
            MIN(o.createdAt) AS createdAt,
            MAX(o.updatedAt) AS updatedAt,
            GROUP_CONCAT(DISTINCT s.statusName) AS statusNames,
            GROUP_CONCAT(DISTINCT d.MemberShipName) AS MembersShip
        FROM 
            orders o
        LEFT JOIN 
            status s ON o.statusId = s.statusId
        LEFT JOIN
            membership d ON o.userDiscountId = d.memberId
        GROUP BY 
            o.orderNumber, o.userId, o.cartId
        ORDER BY
            createdAt DESC;`,
                { type: QueryTypes.SELECT });
            }
    
    async getAllRawSQLByOrderOfUser(_userId){
        return await sequelize.query(`SELECT 
        orderNumber,
        userId,
        cartId,
        GROUP_CONCAT(DISTINCT productItemId) AS productItemIds,
        GROUP_CONCAT(DISTINCT userDiscountId) AS userDiscountIds,
        GROUP_CONCAT(DISTINCT cartId) AS userCartId,
        GROUP_CONCAT(DISTINCT statusId) AS statusIds,
        MIN(createdAt) AS createdAt,
        MAX(updatedAt) AS updatedAt
    FROM 
        orders WHERE userId = ${_userId}
    GROUP BY 
        orderNumber, cartId
    ORDER BY
        createdAt DESC;`,
        { type: QueryTypes.SELECT });
    }

    async updateAdminOrderStatus(_orderNumber, _statusId){
        return await this.Orders.update(
            {
                statusId: _statusId
            },
            {
                where: { orderNumber: _orderNumber }
            }
        )
    }

    async delete(_orderNumber){
        return await this.Orders.destroy({
            where: { orderNumber: _orderNumber }
        })
    }
    
}

module.exports = OrdersService;