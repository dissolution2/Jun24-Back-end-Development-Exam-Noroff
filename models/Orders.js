module.exports = (sequelize, Sequelize) => {
	const Orders = sequelize.define(
		'Orders',
		{
            id:{
                type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            orderNumber: {
                type: Sequelize.DataTypes.STRING,
				allowNull: false,
            },
            userId: {
                type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
                primaryKey: true,
            },
            productItemId:{
                type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
                primaryKey: true,
            },
            userDiscountId:{
                type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
            },
            statusId:{
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
            },
        },
        { 
            timestamps: true,
            tableName: 'Orders'
        }
    );
    
    Orders.associate = function (models) {
        Orders.belongsTo(models.Cart, { foreignKey: 'cartId' });
        Orders.belongsTo(models.Users, { foreignKey: 'userId' });
        Orders.belongsTo(models.Status, { foreignKey: 'statusId' });
    };

    return Orders;
};