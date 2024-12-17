module.exports = (sequelize, Sequelize) => {
	const UserDiscountLogg = sequelize.define(
		'UserDiscountLogg',
		{
            id:{
                type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            userId: {
                type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
                primaryKey: true,
            },
            historyPurchures:{
                type: Sequelize.DataTypes.INTEGER,
				allowNull: false
            },
        },
        { 
            timestamps: true,
            tableName: 'UserDiscountLogg'
        }
    );
    UserDiscountLogg.associate = function (models) {
        UserDiscountLogg.belongsTo(models.Users, { foreignKey: 'userId' });
    };
    return UserDiscountLogg;
};