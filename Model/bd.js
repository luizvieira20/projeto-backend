const { Sequelize, DataTypes} = require('sequelize');
require("dotenv").config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER,
process.env.DB_PASSWORD, {host: "127.0.0.1", port: "50889", dialect: "mssql"})

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
    sequelize: sequelize,
    UsuarioModel: UsuarioModel
};