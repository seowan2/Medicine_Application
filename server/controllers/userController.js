// server/controllers/userController.js
const db = require("../models");
const User = db.users;
const Medication = db.medications;
const UserMedication = db.userMedications;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 사용자 등록 (회원가입)
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 사용자 생성
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });
    
    res.status(201).json({
      message: "사용자가 성공적으로 등록되었습니다.",
      userId: user.id
    });
  } catch (error) {
    console.error("사용자 등록 오류:", error);
    res.status(500).json({
      message: "사용자 등록 중 오류가 발생했습니다."
    });
  }
};

// 사용자 로그인
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 사용자 조회
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({
        message: "사용자를 찾을 수 없습니다."
      });
    }
    
    // 비밀번호 비교
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "비밀번호가 올바르지 않습니다."
      });
    }
    
    // JWT 토큰 생성
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "medication-secret-key", {
      expiresIn: 86400 // 24시간
    });
    
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      accessToken: token
    });
  } catch (error) {
    console.error("로그인 오류:", error);
    res.status(500).json({
      message: "로그인 중 오류가 발생했습니다."
    });
  }
};

// 내 의약품 목록 조회
exports.getMyMedications = async (req, res) => {
  try {
    const userId = req.userId; // 인증 미들웨어에서 설정
    
    const user = await User.findByPk(userId, {
      include: [{
        model: Medication,
        as: "medications",
        through: {
          attributes: ["notes", "intakeTime", "prescription", "startDate", "endDate"]
        }
      }]
    });
    
    if (!user) {
      return res.status(404).json({
        message: "사용자를 찾을 수 없습니다."
      });
    }
    
    res.json(user.medications);
  } catch (error) {
    console.error("내 의약품 목록 조회 오류:", error);
    res.status(500).json({
      message: "내 의약품 목록 조회 중 오류가 발생했습니다."
    });
  }
};

// 내 의약품 추가
exports.addMedication = async (req, res) => {
  try {
    const userId = req.userId; // 인증 미들웨어에서 설정
    const { medicationId, notes, intakeTime, prescription, startDate, endDate } = req.body;
    
    console.log("의약품 추가 요청:", { userId, medicationId, notes, intakeTime });
    
    // 의약품 존재 확인
    const medication = await Medication.findByPk(medicationId);
    
    if (!medication) {
      return res.status(404).json({
        message: "해당 ID의 의약품을 찾을 수 없습니다."
      });
    }
    
    // 사용자 확인
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        message: "사용자를 찾을 수 없습니다."
      });
    }
    
    // 사용자-의약품 관계 생성 또는 업데이트
    const [userMedication, created] = await UserMedication.findOrCreate({
      where: {
        userId,
        medicationId
      },
      defaults: {
        notes: notes || '',
        intakeTime: intakeTime || '',
        prescription: prescription || '',
        startDate: startDate || null,
        endDate: endDate || null
      }
    });
    
    // 이미 존재하는 경우 업데이트
    if (!created) {
      await userMedication.update({
        notes: notes || userMedication.notes,
        intakeTime: intakeTime || userMedication.intakeTime,
        prescription: prescription || userMedication.prescription,
        startDate: startDate || userMedication.startDate,
        endDate: endDate || userMedication.endDate
      });
    }
    
    console.log("의약품 추가 완료:", created ? "새로 추가됨" : "업데이트됨");
    
    res.status(created ? 201 : 200).json({
      message: created ? "의약품이 성공적으로 추가되었습니다." : "의약품 정보가 업데이트되었습니다.",
      userMedicationId: userMedication.id
    });
  } catch (error) {
    console.error("의약품 추가 오류:", error);
    res.status(500).json({
      message: "의약품 추가 중 오류가 발생했습니다.",
      error: error.message
    });
  }
};

// 내 의약품 삭제
exports.removeMedication = async (req, res) => {
  try {
    const userId = req.userId; // 인증 미들웨어에서 설정
    const medicationId = req.params.medicationId;
    
    const result = await UserMedication.destroy({
      where: {
        userId,
        medicationId
      }
    });
    
    if (result === 0) {
      return res.status(404).json({
        message: "해당 의약품을 찾을 수 없거나 이미 삭제되었습니다."
      });
    }
    
    res.json({
      message: "의약품이 성공적으로 삭제되었습니다."
    });
  } catch (error) {
    console.error("의약품 삭제 오류:", error);
    res.status(500).json({
      message: "의약품 삭제 중 오류가 발생했습니다."
    });
  }
};