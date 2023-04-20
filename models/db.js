const Sequelize = require('sequelize');

const connection = new Sequelize('sistemadecadastro','root','02107512',{
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = connection;


