import jwt from "jsonwebtoken";
import { decrypt } from "../helpers.js";

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];

    req.token = bearerToken;

    jwt.verify(req.token, process.env.API_SECRET, (err, authData) => {
      if (err) {
        return res.status(403).send("Could not verify authorization header");
      } else {
        req.auth = JSON.parse(decrypt(authData.token))     
      }
    });

    next();
  } else {
    res.status(403).send("Authorization is required to complete the request");
  }
};

export { verifyToken };
