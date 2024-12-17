class StatusService {
    constructor(db) {
        this.client = db.sequelize;
        this.Status = db.Status;
    }

    async create(_statusId, _name) {
        return await this.Status.create({
            statusId: _statusId, 
            StatusName: _name
        })
    }
    
}

module.exports = StatusService;