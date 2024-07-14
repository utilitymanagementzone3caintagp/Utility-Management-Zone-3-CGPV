import express from "express";
import { Bill } from "../models/bill.js";

const router = express.Router();

// Creating Bills
router.post("/", async (req, res) => {
  try {
    const bill = new Bill({
      email: req.body.email,
      stallmonthly: req.body.stallmonthly,
      electricbill: req.body.electricbill,
      waterbill: req.body.waterbill,
      currentbalance: req.body.currentbalance,

      mthdatewaterbill: req.body.mthdatewaterbill,
      mthdateelectricbill: req.body.mthdateelectricbill,
      mthdatecurrentbalance: req.body.mthdatecurrentbalance,
    });
    await bill.save();

    res.status(201).send({
      message: "add bills success.",
      bill: bill,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get all Bills
router.get("/", async (req, res) => {
  try {
    const bills = await Bill.find();
    res.send({ message: "Add GET Success", data: bills });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update Bills
router.put("/:id", async (req, res) => {
  try {
    const bill = await Bill.findByIdAndUpdate(
      req.params.id,
      {
      email: req.body.email,
      stallmonthly: req.body.stallmonthly,
      electricbill: req.body.electricbill,
      waterbill: req.body.waterbill,
      currentbalance: req.body.currentbalance,

      mthdatewaterbill: req.body.mthdatewaterbill,
      mthdateelectricbill: req.body.mthdateelectricbill,
      mthdatecurrentbalance: req.body.mthdatecurrentbalance,
      },
      { new: true }
    );
    if (!bill) return res.status(404).send("Bills not found");
    res.send({ message: "Update bills success", data: bill });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get single bills by id
router.get("/:id", async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).send("Bills not found");
    res.send(bill);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete bills id
router.delete("/:id", async (req, res) => {
  try {
    const bill = await Bill.findByIdAndRemove(req.params.id);
    if (!bill) return res.status(404).send("Bills not found");
    res.send({ message: "Delete bills success", data: bill });
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;