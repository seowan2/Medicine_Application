// server/models/userMedicationModel.js
module.exports = (sequelize, Sequelize) => {
    const UserMedication = sequelize.define("user_medication", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      medicationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'medications',
          key: 'id'
        }
      },
      // 사용자가 추가한 메모
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      // 복용 시간 (아침, 점심, 저녁, 취침 전 등)
      intakeTime: {
        type: Sequelize.STRING,
        allowNull: true
      },
      // 의사 처방 내용
      prescription: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      // 복용 시작일
      startDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      // 복용 종료일 (선택적)
      endDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      }
    }, {
      tableName: 'user_medications',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
  
    return UserMedication;
  };