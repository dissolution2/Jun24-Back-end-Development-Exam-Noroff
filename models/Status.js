module.exports = (sequelize, Sequelize) => {
	const Status = sequelize.define(
		'Status',
		{
            statusId: {
                type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
                primaryKey: true,
            },
            StatusName:{
                type: Sequelize.DataTypes.STRING,
				allowNull: false,
            },
        },
        { 
            timestamps: false,
            tableName: 'Status'
        }
    );
    Status.associate = function (models) {
        Status.hasMany(models.Orders, { foreignKey: 'statusId' });
    };
    return Status;
};
