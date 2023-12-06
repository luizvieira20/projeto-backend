const { DataTypes, Op } = require("sequelize")
const sequelize = require("../helpers/bd")

const CategoriasModel = sequelize.define('Categorias', 
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        categoria: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }
)

module.exports = {
    list: async function() {
        const Categorias = await CategoriasModel.findAll()
        return Categorias;
    },
    save: async function(categoria) {
        const categoria = await CategoriasModel.create({
            categoria: categoria
        })
        
        return categoria
    },
    update: async function(id, categoria) {
        return await CategoriasModel.update({categoria: categoria}, {
            where: { id: id }
        })
    },
    delete: async function(id) {
        //Precisa fazer algo para os livros que este autor possui
        return await CategoriasModel.destroy({where: { id: id }})
    },
    getById: async function(id) {
        return await CategoriasModel.findByPk(id)
    },
    getByName: async function(categoria) {
        return await CategoriasModel.findOne({where: {categoria: {
            [Op.like]: '%' + categoria + '%'
        } }})
    },

    Model: CategoriasModel
}