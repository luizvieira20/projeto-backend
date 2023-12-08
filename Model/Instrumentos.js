const { DataTypes } = require("sequelize")
const sequelize = require("../helpers/bd")
const Categorias = require('./Categorias');

const InstrumentosModel = sequelize.define('Instrumento', 
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        marca: {
            type: DataTypes.STRING,
            allowNull: false
        },
        modelo: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }
)

InstrumentosModel.belongsTo(Categorias.Model, {
    foreignKey: 'categoria'
})

Categorias.Model.hasMany(InstrumentosModel, {foreignKey: 'categoria'})

module.exports = {
    listar: async function(paginaAtual, itensPorPagina) {
        const Instrumentos = await InstrumentosModel.findAndCountAll({
            limit: itensPorPagina,
            offset: (paginaAtual - 1) * itensPorPagina,
            include: Categorias.Model })
        return Instrumentos;
    },
    listarPorId: async function(id) {
        return await InstrumentosModel.findAll({where: {categoria: id}});
    },
    novo: async (categoria, marca, modelo) => {
        if (categoria instanceof Categorias.Model) {
            categoria = categoria.id
        } else if (typeof categoria === 'string') {
            obj = await Categorias.getByName(categoria) 
            console.log(obj)
            if (!obj) {
                return null
            }
            categoria = obj.id
        }
        return await InstrumentosModel.create({categoria: categoria, marca: marca, modelo: modelo });
    },
    deletar: async function(id) {
        const instrumento = await InstrumentosModel.findByPk(id)
        return instrumento.destroy()
    },
    getById: async function(id) {
        return await InstrumentosModel.findByPk(id)
    },

    Model: InstrumentosModel
}