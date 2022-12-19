const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Auth Error" });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded.user;

    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Invalid Token" });
  }
};

module.exports = {
  authMiddleware,
};
