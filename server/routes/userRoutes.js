// server/routes/userRoutes.js
const controller = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // 회원가입 API
  app.post("/api/auth/register", controller.register);

  // 로그인 API
  app.post("/api/auth/login", controller.login);

  // 내 의약품 목록 조회 API
  app.get("/api/user/medications", authMiddleware, controller.getMyMedications);

  // 내 의약품 추가 API
  app.post("/api/user/medications", authMiddleware, controller.addMedication);

  // 내 의약품 삭제 API
  app.delete("/api/user/medications/:medicationId", authMiddleware, controller.removeMedication);
};