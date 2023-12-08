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
    listar: async function() {
        const Instrumentos = await InstrumentosModel.findAll({ include: Categorias.Model })
        return Instrumentos;
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
    atualizar: async function(id, obj) {
        
        let instrumento = await InstrumentosModel.findByPk(id)
        if (!instrumento) {
            return false
        }
        
        Object.keys(obj).forEach(key => instrumento[key] = obj[key])
        await instrumento.save()
        return instrumento
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