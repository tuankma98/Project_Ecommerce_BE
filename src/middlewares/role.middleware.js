const jwt = require("jsonwebtoken");

const roleMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const role = decoded.user.role;

    if (role === "admin" || role === "teacher") {
      next();
    } else {
      throw new Error("Access Denied");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Access Denied" });
  }
};

module.exports = {
  roleMiddleware,
};
