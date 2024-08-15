import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config/config.js";


// verificacion con JWT
export const authMdw = (req, res, next) => {
    try {      
      const { token } = req.cookies;
      // verifica que exista token
      if (!token)
        return res
    .status(401)
    .json({status: 'error', message: "No token, authorization denied" });
    
    // verifica que el token sea el del servidor
      jwt.verify(token, TOKEN_SECRET, (error, user) => {
        if (error) {
          return res.status(401).json({ message: "Token is not valid" });
        }
        req.user = user;
        next();
      });
    } catch (error) {
      return res.status(500).json({status: 'error', message: error.message });
    }
  };

