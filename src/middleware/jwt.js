import jwt from "jsonwebtoken";
import env from "dotenv";
env.config();

export const signJwt = (payload) => {
  return jwt.sign(payload, process.env.API_SECRET, { expiresIn: "1d" });
};

export const verifyJwt = async (req, res, next) => {
  try {
    let authHeader = await req.headers["authorization"]; //Bearer 12038190eqopwe0123

    //jika token tidak ada
    if (!authHeader) {
      res.status(401).json({
        succes: false,
        msg: "authorization not found",
      });
      return;
    }

    let token = authHeader.split(" ")[1]; //12038190eqopwe0123
    let checkToken = await jwt.verify(token, process.env.API_SECRET);

    if (!checkToken) {
      res.status(401).json({
        success: false,
        msg: "jwt mal format",
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};
