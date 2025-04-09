// server/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"] || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({
      message: "인증 토큰이 제공되지 않았습니다."
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "medication-secret-key");
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "인증 토큰이 유효하지 않습니다."
    });
  }
};

module.exports = verifyToken;