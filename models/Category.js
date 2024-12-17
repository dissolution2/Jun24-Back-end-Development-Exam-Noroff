module.exports = (sequelize, Sequelize) => {
	const Category = sequelize.define(
		'Category',
		{
            categoryId: {
                type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            categoryName:{
                type: Sequelize.DataTypes.STRING,
                unique: true,
				allowNull: false,
            },
        },
        { 
            timestamps: false,
            tableName: 'Category'
        }
    );
    return Category;
};