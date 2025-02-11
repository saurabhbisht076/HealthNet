import jwt from "jsonwebtoken";
const { ACCESS_SECRET } = process.env;

// -------------------> Middleware to check valid access token is present or not <------------------

const checkAuth = (req, res, next) => {
  const token = req.get("x-auth-token");
  if (!token) {
    return res
      .status(401)
      .json({ error: true, errorMsg: "Access denied, token missing!" });
  } else {
    try {
      jwt.verify(token, ACCESS_SECRET);
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          error: true,
          errorMsg: "Session timed out, please login again",
        });
      } else if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          error: true,
          errorMsg: "Invalid token, please login again!",
        });
      } else {
        console.error(error);
        return res.status(400).json({ error: true, errorMsg: error });
      }
    }
  }
};

export default checkAuth;
