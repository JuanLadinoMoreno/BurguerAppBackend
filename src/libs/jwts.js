import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config/config.js";

export async function createAccessToken(payload, duration) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, TOKEN_SECRET, { expiresIn: duration }, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
}
