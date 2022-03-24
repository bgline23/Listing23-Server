import express from "express";
import { decrypt, encrypt } from "../helpers.js";
import * as db from "../database.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    if (req.body.hasOwnProperty("password")) {
      req.body.password = encrypt(req.body.password);
    }
    const user = await db.registerUser(req.body);
    res.json(user);
  } catch (error) {
    console.log("Error registering user: ", error.message);
    res.status(500).send(error.message);
  }
});

export { router };
