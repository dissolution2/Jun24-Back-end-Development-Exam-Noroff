module.exports = (sequelize, Sequelize) => {
	const Users = sequelize.define(
		'Users',
		{
			userId:{
				type : Sequelize.DataTypes.INTEGER,
				autoIncrement : true,
				primaryKey: true
			},
			roleId: {
				type : Sequelize.DataTypes.INTEGER,
            	allowNull : false,
			},
			memberId: {
				type : Sequelize.DataTypes.INTEGER,
            	allowNull : false,
			},
			firstName: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
			},
			lastName: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
			},
			userName: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			address: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
			},
			telephonenumber: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
			},
			email: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			encryptedPassword: {
				type: Sequelize.DataTypes.BLOB,

				allowNull: false,
			},
			salt: {
				type: Sequelize.DataTypes.BLOB,

				allowNull: false,
			},
		},
		{
			timestamps: false,
			tableName: 'Users'
		}
	);

	Users.associate = function (models) {
		Users.hasOne(models.Cart, { foreignKey: 'userId', allowNull: true });
		Users.belongsTo(models.Role, { foreignKey: 'roleId' });
		Users.belongsTo(models.MemberShip, { foreignKey: 'memberId' });
		Users.hasOne(models.UserDiscountLogg, { foreignKey: 'userId' });
	};

	return Users;
};
