import jwt from "jsonwebtoken";
import { decrypt } from "../helpers.js";

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];

    req.token = bearerToken;

    jwt.verify(req.token, process.env.API_SECRET, (err, authData) => {
      if (err) {
        return res.sendStatus(403);
      } else {
        req.auth = {
          message: "prospective buyers section.",

          reponse: JSON.parse(decrypt(authData.token)),
        };
      }
    });

    next();
  } else {
    res.sendStatus(403);
  }
};

export { verifyToken };
