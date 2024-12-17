const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

class BrandService {
    constructor(db) {
        this.client = db.sequelize;
        this.Brand = db.Brand;
    }

    async create(_brandName) {
        return await this.Brand.create({
            brandName: _brandName
        })
    }

    async delete(_brandId,_brandName){
        return await this.Brand.destroy({
            where: { brandId: _brandId, brandName: _brandName }
        })
    }

    async updateByName(_brandName,_newBrandName){
        return await this.Brand.update(
            { 
                brandName: _newBrandName
            },
            {
                where: {brandName: _brandName }
            }
        )
    }

    async findOneById(_brandId){
        return await this.Brand.findOne({
            where: { brandId: _brandId }
        })
    }

    async findOne(_brandName){
        return await this.Brand.findOne({
            where: { brandName: _brandName }
        })
    }

    async getId(_brandName){
        return await sequelize.query(`SELECT brand.brandId FROM brand WHERE brandName = '${_brandName}';`,
        { type: QueryTypes.SELECT });
    }

    async getAll(){
        return await this.Brand.findAll({
            where: {},
            order: [
                ['brandId','ASC']
            ]
        })
    }
    
}

module.exports = BrandService;