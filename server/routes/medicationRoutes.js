// server/routes/medicationRoutes.js
const controller = require("../controllers/medicationController");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // 의약품 검색 API
  app.get("/api/medications/search", controller.search);

  // 의약품 상세 정보 조회 API
  app.get("/api/medications/:id", controller.findOne);

  // 의약품 목록 조회 API
  app.get("/api/medications", controller.findAll);
};