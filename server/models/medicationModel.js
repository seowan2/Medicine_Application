// server/models/medicationModel.js
module.exports = (sequelize, Sequelize) => {
  const Medication = sequelize.define("medication", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    docId: {
      type: Sequelize.STRING,
      field: 'docId',
      allowNull: true
    },
    koreanName: {
      type: Sequelize.STRING,
      field: 'korean_name',
      allowNull: false
    },
    englishName: {
      type: Sequelize.STRING,
      field: 'english_name',
      allowNull: true
    },
    description: {
      type: Sequelize.TEXT,
      field: 'description',
      allowNull: true
    },
    imageUrl: {
      type: Sequelize.TEXT,
      field: 'image_url',
      allowNull: true
    },
    appearance: {
      type: Sequelize.TEXT,
      field: 'appearance',
      allowNull: true
    },
    shape: {
      type: Sequelize.STRING,
      field: 'shape',
      allowNull: true
    },
    color: {
      type: Sequelize.STRING,
      field: 'color',
      allowNull: true
    },
    size: {
      type: Sequelize.STRING(1000),
      field: 'size',
      allowNull: true
    },
    markings: {
      type: Sequelize.STRING(500),
      field: 'identification',
      allowNull: true
    },
    divisionLine: {
      type: Sequelize.STRING(50),
      field: 'division_line',
      allowNull: true
    },
    classification: {
      type: Sequelize.STRING(500),
      field: 'classification',
      allowNull: true
    },
    category: {
      type: Sequelize.STRING(500),
      field: 'category',
      allowNull: true
    },
    company: {
      type: Sequelize.STRING(500),
      field: 'company',
      allowNull: true
    },
    insuranceCode: {
      type: Sequelize.STRING(500),
      field: 'insurance_code',
      allowNull: true
    },
    ingredients: {
      type: Sequelize.TEXT('long'),
      field: 'components',
      allowNull: true
    },
    effects: {
      type: Sequelize.TEXT('long'),
      field: 'efficacy',
      allowNull: true
    },
    dosage: {
      type: Sequelize.TEXT('long'),
      field: 'dosage',
      allowNull: true
    },
    precautions: {
      type: Sequelize.TEXT('long'),
      field: 'precautions',
      allowNull: true
    },
    expertPrecautions: {
      type: Sequelize.TEXT('long'),
      field: 'advanced_precautions',
      allowNull: true
    },
    storage: {
      type: Sequelize.TEXT('long'),
      field: 'storage_conditions',
      allowNull: true
    },
    validity: {
      type: Sequelize.STRING(100),
      field: 'expiration',
      allowNull: true
    }
  }, {
    tableName: 'medicine_collector_data',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Medication;
};