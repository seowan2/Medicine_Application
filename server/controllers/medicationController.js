// server/controllers/medicationController.js
const db = require("../models");
const Medication = db.medications;
const { Op } = db.Sequelize;  // 올바른 Op 객체 가져오기

// 의약품 검색 (이름으로만 검색)
exports.search = async (req, res) => {
  try {
    const {
      keyword,
      shape,
      color,
      formulation,
      divisionLine,
      page = 1,
      limit = 10,
      sort = 'koreanName',
      order = 'ASC'
    } = req.query;

    // 페이지네이션 계산
    const offset = (page - 1) * limit;
    const whereCondition = {};

    // 키워드가 있는 경우 약품 이름으로만 검색
    if (keyword) {
      whereCondition['korean_name'] = { [Op.like]: `%${keyword}%` };
    }

    // 식별 검색 조건 추가
    if (shape) whereCondition['shape'] = shape;
    if (color) whereCondition['color'] = color;
    if (formulation) whereCondition['formulation'] = formulation;
    if (divisionLine) whereCondition['division_line'] = divisionLine;

    // 정렬 옵션 설정
    let orderField;
    switch (sort) {
      case 'koreanName':
        orderField = 'korean_name';
        break;
      case 'company':
        orderField = 'company';
        break;
      case 'classification':
        orderField = 'classification';
        break;
      default:
        orderField = 'korean_name';
    }

    const orderOption = [[orderField, order]];

    // 데이터베이스 쿼리 실행
    const { count, rows } = await Medication.findAndCountAll({
      where: whereCondition,
      limit: parseInt(limit),
      offset: offset,
      order: orderOption
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
    const { 
      page = 1, 
      limit = 10, 
      sort = 'koreanName', 
      order = 'ASC' 
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    // 정렬 옵션 설정
    let orderField;
    switch (sort) {
      case 'koreanName':
        orderField = 'korean_name';
        break;
      case 'company':
        orderField = 'company';
        break;
      case 'classification':
        orderField = 'classification';
        break;
      default:
        orderField = 'korean_name';
    }

    const orderOption = [[orderField, order]];
    
    const { count, rows } = await Medication.findAndCountAll({
      limit: parseInt(limit),
      offset: offset,
      order: orderOption
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