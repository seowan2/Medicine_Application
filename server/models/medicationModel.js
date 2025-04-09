// server/models/medicationModel.js
module.exports = (sequelize, Sequelize) => {
    const Medication = sequelize.define("medication", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      // 컬럼명을 실제 네이버 API에서 제공하는 이름과 일치시킴
      koreanName: {
        type: Sequelize.STRING,
        field: '약품_한글명',
        allowNull: false
      },
      englishName: {
        type: Sequelize.STRING,
        field: '약품_영문명',
        allowNull: true
      },
      classification: {
        type: Sequelize.STRING,
        field: '약품분류',
        allowNull: true
      },
      category: {
        type: Sequelize.STRING,
        field: '약품_구분',
        allowNull: true
      },
      company: {
        type: Sequelize.STRING,
        field: '업체명',
        allowNull: true
      },
      insuranceCode: {
        type: Sequelize.STRING,
        field: '보험코드',
        allowNull: true
      },
      appearance: {
        type: Sequelize.TEXT,
        field: '성상',
        allowNull: true
      },
      formulation: {
        type: Sequelize.STRING,
        field: '제형',
        allowNull: true
      },
      shape: {
        type: Sequelize.STRING,
        field: '모양',
        allowNull: true
      },
      color: {
        type: Sequelize.STRING,
        field: '색깔',
        allowNull: true
      },
      size: {
        type: Sequelize.STRING,
        field: '크기',
        allowNull: true
      },
      markings: {
        type: Sequelize.STRING,
        field: '식별표기',
        allowNull: true
      },
      divisionLine: {
        type: Sequelize.STRING,
        field: '분할선',
        allowNull: true
      },
      ingredients: {
        type: Sequelize.TEXT,
        field: '성분정보',
        allowNull: true
      },
      effects: {
        type: Sequelize.TEXT,
        field: '효능효과',
        allowNull: true
      },
      dosage: {
        type: Sequelize.TEXT,
        field: '용법용량',
        allowNull: true
      },
      storage: {
        type: Sequelize.STRING,
        field: '저장방법',
        allowNull: true
      },
      validity: {
        type: Sequelize.STRING,
        field: '사용기간',
        allowNull: true
      },
      precautions: {
        type: Sequelize.TEXT('long'),
        field: '사용상의주의사항',
        allowNull: true
      },
      expertPrecautions: {
        type: Sequelize.TEXT('long'),
        field: '사용상의주의사항[전문가]',
        allowNull: true
      },
      imageUrl: {
        type: Sequelize.STRING,
        field: '약품_이미지',
        allowNull: true
      }
    }, {
      // 테이블 이름 설정
      tableName: 'medications',
      // 타임스탬프 설정
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
  
    return Medication;
  };