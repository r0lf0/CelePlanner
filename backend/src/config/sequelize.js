const { Sequelize } = require('sequelize');

// Initialize Sequelize with database credentials from environment variables
const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  dialect: 'postgres'
});


module.exports = sequelize;
