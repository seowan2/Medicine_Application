// server/models/index.js
const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// 모델 불러오기
db.medications = require("./medicationModel.js")(sequelize, Sequelize);
db.users = require("./userModel.js")(sequelize, Sequelize);
db.userMedications = require("./userMedicationModel.js")(sequelize, Sequelize);

// 관계 설정
db.users.belongsToMany(db.medications, { 
  through: db.userMedications,
  as: "medications",
  foreignKey: "userId"
});

db.medications.belongsToMany(db.users, { 
  through: db.userMedications,
  as: "users",
  foreignKey: "medicationId"
});

module.exports = db;