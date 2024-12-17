const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

class CategoryService {
    constructor(db) {
        this.client = db.sequelize;
        this.Category = db.Category;
    }

    async create(_categoryName) {
        return await this.Category.create({
            categoryName: _categoryName
        })
    }

    async delete(_categoryId, _categoryName){
        return await this.Category.destroy({
            where: { categoryId: _categoryId, categoryName: _categoryName }
        })
    }

    async updateByName(_categoryName, _newCategoryName){
        return await this.Category.update(
            { 
                categoryName: _newCategoryName
            },
            {
                where: {categoryName: _categoryName }
            }
        )
    }

    async getAll(){
        return await this.Category.findAll({
            where: {},
            order: [
                ['categoryId','ASC']
            ]
        })
    }

    async findOne(_categoryName){
        return await this.Category.findOne({
            where: { categoryName: _categoryName }
        })
    }

    async findOneById(_categoryId){
        return await this.Category.findOne({
            where: { categoryId: _categoryId }
        })
    }

    async getId(name){
        return await sequelize.query(`SELECT category.categoryId FROM category WHERE categoryName = '${name}';`,
        { type: QueryTypes.SELECT });
    }
    

    
}

module.exports = CategoryService;