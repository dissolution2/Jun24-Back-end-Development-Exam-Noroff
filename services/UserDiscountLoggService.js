class UserDiscountLoggService {
    constructor(db) {
        this.client = db.sequelize;
        this.UserDiscountLogg = db.UserDiscountLogg;
    }
    

    async checkExits(_userId){
        return await this.UserDiscountLogg.findOne({
            where:{ userId: _userId}
        })
    }

    async getHistoryDiscount(_userId){
        return await this.UserDiscountLogg.findOne({
            attributes: ['historyPurchures'],
            where:{ userId: _userId}
        })
    }

    async getALLUserHistory(){
        return await this.UserDiscountLogg.findAll({
            where:{ }
        })
    }

    async create(_userId, _historyPurchures) {
        return await this.UserDiscountLogg.create({
            userId: _userId,
            historyPurchures: _historyPurchures
        })
    }

    async update(_userId, _historyPurchures) {
        return await this.UserDiscountLogg.update(
            {
                historyPurchures: _historyPurchures,

            },
            {
                where: {
                    userId: _userId
                }
            }
        )
    }
    
}

module.exports = UserDiscountLoggService;