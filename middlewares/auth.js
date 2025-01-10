import jwt from "jsonwebtoken";

// Token validation middleware
export const auth = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      req.body.token ||
      (req.headers.authorization
        ? req.headers.authorization.replace("Bearer ", "")
        : null);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token has expired",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authentication failed, please try again",
    });
  }
};

// Role validation for Patient
export const isPatient = async (req, res, next) => {
  try {
    if (req.user.role !== "patient") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

// Role validation for Insurer
export const isInsurer = async (req, res, next) => {
  try {
    if (req.user.role !== "insurer") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};
