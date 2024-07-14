import express from "express";
import { Transaction } from "../models/transaction.js";

const router = express.Router();

// Creating type transaction
router.post("/", async (req, res) => {
  try {
    const transaction = new Transaction({
      email: req.body.email,
      paymentmethodtransaction: req.body.paymentmethodtransaction,
      billtypetransaction: req.body.billtypetransaction,
      amountoftransaction: req.body.amountoftransaction,
      gcashnumber: req.body.gcashnumber,
      stallnametra: req.body.stallnametra,
      dateoftransaction: req.body.dateoftransaction,
      statusoftransaction: req.body.statusoftransaction,
    });
    await transaction.save();

    res.status(201).send({
      message: "add transaction success.",
      transaction: transaction,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get all transaction
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.send({ message: "Add GET Success", data: transactions });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update type transaction
router.put("/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      {
       email: req.body.email,
      paymentmethodtransaction: req.body.paymentmethodtransaction,
      billtypetransaction: req.body.billtypetransaction,
      amountoftransaction: req.body.amountoftransaction,
      gcashnumber: req.body.gcashnumber,
      stallnametra: req.body.stallnametra,
      dateoftransaction: req.body.dateoftransaction,
      statusoftransaction: req.body.statusoftransaction,
      },
      { new: true }
    );
    if (!transaction) return res.status(404).send("type transaction not found");
    res.send({ message: "Update transaction success", data: transaction });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get single transaction by id
router.get("/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).send("transaction not found");
    res.send(transaction);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete transaction id
router.delete("/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndRemove(req.params.id);
    if (!transaction) return res.status(404).send("transaction not found");
    res.send({ message: "Delete transaction success", data: transaction });
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;