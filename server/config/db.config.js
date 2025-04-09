// server/config/db.config.js
module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "", // MySQL 비밀번호 설정
    DB: "medication_db",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };