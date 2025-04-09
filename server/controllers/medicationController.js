// server/controllers/medicationController.js
const db = require("../models");
const Medication = db.medications;
const Op = db.Sequelize.Op;

// 의약품 검색 (다양한 조건)
exports.search = async (req, res) => {
  try {
    const {
      keyword,
      name,
      shape,
      color,
      formulation,
      divisionLine,
      ingredients,
      page = 1,
      limit = 10
    } = req.query;

    // 페이지네이션 계산
    const offset = (page - 1) * limit;
    const whereCondition = {};

    // 검색 조건 추가 (키워드 검색)
    if (keyword) {
      whereCondition[Op.or] = [
        { '약품_한글명': { [Op.like]: `%${keyword}%` } },
        { '약품_영문명': { [Op.like]: `%${keyword}%` } },
        { '성분정보': { [Op.like]: `%${keyword}%` } },
        { '효능효과': { [Op.like]: `%${keyword}%` } }
      ];
    }

    // 특정 필드 검색 조건 추가
    if (name) whereCondition['약품_한글명'] = { [Op.like]: `%${name}%` };
    if (shape) whereCondition['모양'] = shape;
    if (color) whereCondition['색깔'] = color;
    if (formulation) whereCondition['제형'] = formulation;
    if (divisionLine) whereCondition['분할선'] = divisionLine;
    if (ingredients) whereCondition['성분정보'] = { [Op.like]: `%${ingredients}%` };

    // 데이터베이스 쿼리 실행
    const { count, rows } = await Medication.findAndCountAll({
      where: whereCondition,
      limit: parseInt(limit),
      offset: offset
    });

    // 응답 데이터 구성
    res.json({
      totalItems: count,
      medications: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error("의약품 검색 오류:", error);
    res.status(500).json({
      message: "의약품 검색 중 오류가 발생했습니다."
    });
  }
};

// 의약품 상세 정보 조회
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    
    const medication = await Medication.findByPk(id);
    
    if (!medication) {
      return res.status(404).json({
        message: "해당 ID의 의약품을 찾을 수 없습니다."
      });
    }
    
    res.json(medication);
  } catch (error) {
    console.error("의약품 상세 정보 조회 오류:", error);
    res.status(500).json({
      message: "의약품 상세 정보 조회 중 오류가 발생했습니다."
    });
  }
};

// 의약품 목록 조회 (필터링 및 페이지네이션)
exports.findAll = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Medication.findAndCountAll({
      limit: parseInt(limit),
      offset: offset
    });
    
    res.json({
      totalItems: count,
      medications: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error("의약품 목록 조회 오류:", error);
    res.status(500).json({
      message: "의약품 목록 조회 중 오류가 발생했습니다."
    });
  }
};