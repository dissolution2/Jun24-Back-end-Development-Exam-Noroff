class UsersService {
    constructor(db) {
        this.client = db.sequelize;
        this.Users = db.Users;
    }

    
    async getOneId(email) {
        return await this.Users.findOne({
            attributes: [
                'userId', 'memberId','roleId',
                'firstName', 'lastName', 'userName',
                'address', 'telephonenumber', 'email'
            ],
            where: {email: email}
        })
    }

    async getOnById(_userId) {
        return await this.Users.findOne({
            attributes: [
                'userId', 'memberId','roleId',
                'firstName', 'lastName', 'userName',
                'address', 'telephonenumber', 'email'
            ],
            where: {userId: _userId}
        })
    }

    async getAll() {
        return await this.Users.findAll({
            attributes: [
                'userId', 'memberId','roleId',
                'firstName', 'lastName', 'userName',
                'address', 'telephonenumber', 'email'
            ],
            where: { }
        })
    }

    async getOneUserName(_userName) {
        return await this.Users.findOne({
            where: {userName: _userName}
        })
    }
    
    
    async getOneEmail(email) {
        return await this.Users.findOne({
            where: {email: email}
        })
    }

    async checkUserForMemberShipInUse(_memberId){
        return await this.Users.findAll({
            where: { memberId: _memberId }
        })
    }

    async getOneUserName(userName) {
        return await this.Users.findOne({
            where: {userName: userName}
        })
    }

    async updateUserDiscountId(_userId, memberShipId){
        return await this.Users.update(
            {
                memberId: memberShipId
            },
            { where: { userId: _userId }
            
            }
        )
    }

    async updateUserPriv(_userId, _roleId){
        return await this.Users.update(
            {
                roleId: _roleId
            },
            { where: { userId: _userId }
            
            }
        )
    }

    async create(_roleId, _memberId, _firstName, _lastName, 
        _userName, _address, _telephonenumber,
        _email, encryptedPassword, salt) {
        return await this.Users.create({
            roleId: _roleId,
            memberId: _memberId,
            firstName: _firstName,
            lastName: _lastName,
            userName: _userName,
            address: _address,
            telephonenumber: _telephonenumber,
            email: _email,
            encryptedPassword: encryptedPassword,
            salt: salt
        })
    }

    async delete(_userId){
        return await this.Users.destroy({
            where: { userId: _userId}
        })
    }
}

module.exports = UsersService;