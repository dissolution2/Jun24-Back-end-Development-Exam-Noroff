const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');
const { Op } = require('sequelize');

class MemberShipService {
    constructor(db) {
        this.client = db.sequelize;
        this.MemberShip = db.MemberShip;
    }

    async findNextIndex_Not_IN_USE(){
        return await sequelize.query(`select MAX(memberId) + 1 As NextId
        from membership;`,
        { type: QueryTypes.SELECT });
    }

    async getMemeberShipDiscountValue(_memberId){
        return await this.MemberShip.findOne({
            attributes: ['discount'],
            where: {memberId: _memberId}
        })
    }

    async getAll(){
        return await this.MemberShip.findAll({
            //attributes: ['discount'],
            where: { }
        })
    }

    async getOneId(_memberId){
        return await this.MemberShip.findOne({
            //attributes: ['MemberShipName','discount'],
            where: {memberId: _memberId}
        })
    }

    async getByName(_MemberShipName){
        return await this.MemberShip.findOne({
            //attributes: ['MemberShipName','discount'],
            where: {MemberShipName: _MemberShipName}
        })
    }

    async getInfoToUser(_memberId){
        return await this.MemberShip.findOne({
            attributes: ['MemberShipName','discount'],
            where: {memberId: _memberId}
        })
    }

    async checkDiscount(user_history_value){
        return await this.MemberShip.findOne({
            attributes: ['memberId','discount'],
            where: {
                discount: {
                    [Op.lte]: user_history_value
                }
            },
            order: [['discount', 'DESC']],
            limit: 1
        });
    }
    
    async updateMemberShipName(_memberId, _MemberShipName){
        return await this.MemberShip.update(
            {
                MemberShipName: _MemberShipName
            },
            {
                where: {memberId: _memberId}
            }
        )
    }

    async updateMemberShipDiscount(_memberId, _discount){
        return await this.MemberShip.update(
            {
                discount: _discount
            },
            {
                where: {memberId: _memberId}
            }
        )
    }

    async removeMemberShip(_memberId,_memberShipName){
        return await this.MemberShip.destroy({
            where: { memberId: _memberId, MemberShipName: _memberShipName }
        })
    }

    async create(id,name,discount){
        return await this.MemberShip.create({
            memberId: id,
            MemberShipName: name,
            discount: discount
        })
    }
    
}

module.exports = MemberShipService;