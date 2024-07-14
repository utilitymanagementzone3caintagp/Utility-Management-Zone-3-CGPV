import express from "express";
import { Billrecord } from "../models/billrecord.js";

const router = express.Router();

// Creating typeBills
router.post("/", async (req, res) => {
  try {
    const billrecord = new Billrecord({
      email: req.body.email,
      typebill: req.body.typebill,
      typebillamount: req.body.typebillamount,
      fromdate: req.body.fromdate,
      todate: req.body.todate,
      yrtype: req.body.yrtype,
    });
    await billrecord.save();

    res.status(201).send({
      message: "add typebills success.",
      billrecord: billrecord,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get all typeBills
router.get("/", async (req, res) => {
  try {
    const billrecords = await Billrecord.find();
    res.send({ message: "Add GET Success", data: billrecords });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update typeBills
router.put("/:id", async (req, res) => {
  try {
    const billrecord = await Billrecord.findByIdAndUpdate(
      req.params.id,
      {
        email: req.body.email,
        typebill: req.body.typebill,
        typebillamount: req.body.typebillamount,
        fromdate: req.body.fromdate,
        todate: req.body.todate,
        yrtype: req.body.yrtype,
      },
      { new: true }
    );
    if (!billrecord) return res.status(404).send("typeBills not found");
    res.send({ message: "Update typebills success", data: billrecord });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get single typebills by id
router.get("/:id", async (req, res) => {
  try {
    const billrecord = await Billrecord.findById(req.params.id);
    if (!billrecord) return res.status(404).send("typeBills not found");
    res.send(billrecord);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete typebills id
router.delete("/:id", async (req, res) => {
  try {
    const billrecord = await Billrecord.findByIdAndRemove(req.params.id);
    if (!billrecord) return res.status(404).send("typeBills not found");
    res.send({ message: "Delete bills success", data: billrecord });
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;