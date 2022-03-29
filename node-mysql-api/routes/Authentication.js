import express from "express";
import jwt from "jsonwebtoken";
import { decrypt, encrypt } from "../helpers.js";
import * as db from "../database.js";
import { verifyToken } from "../middleware/JWT.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const credentials = {
      username: req.body.username,
      password: encrypt(req.body.password),
    };

    // search for user in DB
    const userResult = await db.getAuthenticatedUser(credentials);

    if (!userResult?.username) {
      res.status(401).send("Invalid credentials, please try again");
    }

    const token = encrypt(JSON.stringify(credentials));

    jwt.sign({ token }, process.env.API_SECRET, (err, token) => {
      res.json({
        user: userResult,
        token,
        success: true,
      });
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/loginToken", async (req, res) => {
  try {
    const token = req.body.token;
    if (token) {
      jwt.verify(token, process.env.API_SECRET, async (error, authData) => {
        if (error) {
          console.log(error);
          return res.status(403).send(error.message);
        }

        const parseToken = JSON.parse(decrypt(authData.token));

        const credentials = {
          username: parseToken.username,
          password: encrypt(parseToken.password),
        };

        // search for user in DB
        const user = await db.getAuthenticatedUser(credentials);

        if (!user?.username) {
          return res.status(401).send("Invalid credentials, please try again");
        }
        return res.json({ user, token, success: true });
      });
    } else {
      res.status(401).send("Invalid login credentials");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export { router };
