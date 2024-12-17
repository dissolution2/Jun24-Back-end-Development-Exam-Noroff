module.exports = (sequelize, Sequelize) => {
	const MemberShip = sequelize.define(
		'MemberShip',
		{
            memberId: {
                type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
                primaryKey: true,
            },
            MemberShipName: {
                type: Sequelize.DataTypes.STRING,
                unique: true,
				allowNull: false,
            },
            discount: {
                type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
            },
        },
        { 
            timestamps: false,
            tableName: 'MemberShip'
        }
    );
    MemberShip.associate = function (models) {
		MemberShip.hasMany(models.Users, { foreignKey: 'memberId' });
	};
    return MemberShip;
};