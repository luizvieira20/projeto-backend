const { DataTypes, Op } = require("sequelize")
const sequelize = require("../helpers/bd")

const CategoriasModel = sequelize.define('Categorias', 
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            onDelete: 'CASCADE'
        },
        categoria: {
            type: DataTypes.STRING,
            onDelete: 'CASCADE'
        }
    }
)

module.exports = {
    listar: async function(paginaAtual, itensPorPagina) {

        const Categorias = await CategoriasModel.findAndCountAll({
            limit: itensPorPagina,
            offset: (paginaAtual - 1) * itensPorPagina
        })
        return Categorias;
    },
    novo: async (categoria) => {
        return await CategoriasModel.create({categoria: categoria });
    },
    deletar: async function(id) {
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