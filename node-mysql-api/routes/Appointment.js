import express from "express";
import * as db from "../database.js";
import { verifyToken } from "../middleware/JWT.js";

const router = express.Router();

router.post("/create", verifyToken, async (req, res) => {
  try {
    
    const appointment = await db.createAppointment(req.body);

    res.send(appointment);
  } catch (error) {
    res.status(500).send(error.message);
  }
});



export { router };
