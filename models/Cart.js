module.exports = (sequelize, Sequelize) => {
	const Cart = sequelize.define(
		'Cart',
		{
            id:{
                type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            userId: {
                type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
            },
            productId:{
                type: Sequelize.DataTypes.STRING,
				allowNull: false,
            },
            quantity: {
                type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
            },
            price:{
                type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
            },
            discount: {
                type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
            },
            isdeleted: {
                type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
            },
        },
        { 
            timestamps: true,
            tableName: 'Cart'
        }
    );
    Cart.associate = function (models) {
        Cart.belongsTo(models.Users, { foreignKey: 'userId' });
    };
    return Cart;
};