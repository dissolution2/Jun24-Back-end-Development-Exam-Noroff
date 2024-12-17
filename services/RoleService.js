class RoleService {
    constructor(db) {
        this.client = db.sequelize;
        this.Role = db.Role;
    }

    async create(name) {
        return await this.Role.create({
            roleName: name
        })
    }

    async getAll(){
        return await this.Role.findAll({
            where: {}
        })
    }

    async getUserPrivName(_roleId){
        return await this.Role.findOne({
            attributes: ['roleName'],
            where: { roleId: _roleId }
        })
    }

    async getRoleByName(_roleName){
        return await this.Role.findOne({
            attributes: ['roleId','roleName'],
            where: { roleName: _roleName }
        })
    }
}

module.exports = RoleService;