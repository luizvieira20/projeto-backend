const { DataTypes } = require('sequelize');
const sequelize = require('../helpers/bd');

const UsuarioModel = sequelize.define('Usuários', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    usuario: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    privilegios: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
});

module.exports = {
    novo: async (usuario, email, senha, privilegios) => {
        return await UsuarioModel.create({usuario: usuario, email: email, senha: senha, privilegios: privilegios });
    },
    verificarEmail: async (email) => {
        return await UsuarioModel.findOne({where: {email: email}});
    },
    verificarId: async (id) => {
        return await UsuarioModel.findOne({where: {id: id}});
    },

    UsuarioModel: UsuarioModel
}