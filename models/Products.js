module.exports = (sequelize, Sequelize) => {
	const Products = sequelize.define(
		'Products',
		{
            productId: {
                type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
                primaryKey: true,
            },
            productName:{
                type: Sequelize.DataTypes.STRING,
				allowNull: false,
            },
            description:{
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
            imgUrl: {
                type: Sequelize.DataTypes.STRING,
				allowNull: false,
            },
            categoryId: {
                type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
            },
            brandId: {
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
            tableName: 'Products'
        }
    );
    Products.associate = function (models) {
        Products.belongsTo(models.Category, { foreignKey: 'categoryId' });
        Products.belongsTo(models.Brand, { foreignKey: 'brandId' });
    };
    return Products;
};