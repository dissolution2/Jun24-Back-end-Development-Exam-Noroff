module.exports = (sequelize, Sequelize) => {
	const Brand = sequelize.define(
		'Brand',
		{
            brandId: {
                type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
                primaryKey: true,
                foreignKey: true,
                autoIncrement : true,
            },
            brandName:{
                type: Sequelize.DataTypes.STRING,
				allowNull: false,
                unique: true,
            },
        },
        { 
            timestamps: false,
            tableName: 'Brand'
        }
    );
    return Brand;
};