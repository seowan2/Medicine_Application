// server/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// 환경 변수 설정
dotenv.config();

const app = express();

// CORS 설정
app.use(cors({
  origin: "http://localhost:3000" // React 클라이언트 주소
}));

// JSON 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 데이터베이스 연결
const db = require("./models");
db.sequelize.sync()
  .then(() => {
    console.log("데이터베이스가 성공적으로 연결되었습니다.");
  })
  .catch((err) => {
    console.error("데이터베이스 연결 오류:", err);
  });

// 기본 라우트
app.get("/", (req, res) => {
  res.json({ message: "의약품 검색 및 관리 API에 오신 것을 환영합니다." });
});

// 라우트 설정
require("./routes/medicationRoutes")(app);
require("./routes/userRoutes")(app);

// 서버 시작
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});