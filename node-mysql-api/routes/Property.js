import express from "express";

import * as db from "../database.js";
import { verifyToken } from "../middleware/JWT.js";

const router = express.Router();

router.get("/image/get_images", async (req, res) => {
  const propertyId = req.body.propertyId;

  try {
    const imageResult = await db.getPropertyImages(propertyId);
    const imageBuffer = Buffer.from(imageResult, "base64");
    res.send(imageBuffer.toString("base64"));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/listings", async (req, res) => {
  const userId = req.body.userId;
  const pageSize = req.body.pageSize || 10;
  const skipRows = req.body.skipRows || 0;

  try {
    const listings = await db.getListings({ userId, pageSize, skipRows });

    const listingImages = listings.map(l => ({
      ...l,
      blob_data: null,
      base64: l.blob_data ? Buffer.from(l.blob_data, "base64").toString("base64") : "",
    }));

    res.json(listingImages);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

router.post("/image/save_image", async (req, res) => {
  const propertyId = req.body.propertyId;
  const imageData = req.body.photos;

  try {
    const saveResult = await Promise.all(
      imageData.map(i => {
        const imageBuffer = Buffer.from(i, "base64");
        return db.savePropertyImage(propertyId, imageBuffer);
      })
    );

    if (saveResult.length) {
      res.json({ success: true });
    } else {
      res.status({ message: "Could not save image: " + saveResult.info });
    }
  } catch (error) {
    console.log("save_image error -> ", error.message);
    res.status(500).send(error.message);
  }
});

router.post("/create", async (req, res) => {
  const requestData = req.body;
  try {
    const saveResult = await db.createProperty(requestData);

    if (saveResult[0].affectedRows) {
      res.json({ propertyId: saveResult[1][0]["@new_property"], success: true });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

export { router };
