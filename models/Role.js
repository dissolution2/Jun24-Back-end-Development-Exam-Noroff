module.exports = (sequelize, Sequelize) => {
	const Role = sequelize.define(
		'Role',
		{
            roleId: {
                type : Sequelize.DataTypes.INTEGER,
                autoIncrement : true,
                primaryKey: true,
            },
            roleName:{
                type: Sequelize.DataTypes.STRING,
				allowNull: false,
                unique: true,
            },
        },
        { 
            timestamps: false,
            tableName: 'Role'
        }
    );
    Role.associate = function(models){
        Role.hasMany(models.Users, { foreignKey: 'roleId' });
    };
    return Role;
};