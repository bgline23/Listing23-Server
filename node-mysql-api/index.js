import dotenv from "dotenv";
dotenv.config();

import express from "express";

import * as db from "./database.js";
import { router as User } from "./routes/User.js";
import { router as Authentication } from "./routes/Authentication.js";
import { router as Property } from "./routes/Property.js";
import { router as Appointment } from "./routes/Appointment.js";
import Logger from "./middleware/Logger.js";

const API_PORT = process.env.API_PORT || 8081;

const app = express();

//  Logger

app.use(Logger());

//  built in middleware

app.use(express.json({ limit: "2mb" }));

//   route handlers
app.use("/authenticate", Authentication);
app.use("/property", Property);
app.use("/user", User);
app.use("/appointment", Appointment);

app.get("/", async (req, res) => {
  try {
    const userTypes = await db.getUserTypes();
    res.json(userTypes);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(API_PORT, () => {
  console.log(`API server started on http://localhost:${API_PORT}`);
});
