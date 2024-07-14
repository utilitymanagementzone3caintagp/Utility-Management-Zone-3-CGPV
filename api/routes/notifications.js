import express from "express";
import { Notification } from "../models/notification.js";

const router = express.Router();

// Creating notification
router.post("/", async (req, res) => {
  try {
    const notification = new Notification({
      email: req.body.email,
      definenotifi: req.body.definenotifi,
      timedatenotifi: req.body.timedatenotifi,
    });
    await notification.save();

    res.status(201).send({
      message: "add notification success.",
      notification: notification,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get all notification
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.send({ message: "Add GET Success", data: notifications });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update notification
router.put("/:id", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        email: req.body.email,
        definenotifi: req.body.definenotifi,
        timedatenotifi: req.body.timedatenotifi,
      },
      { new: true }
    );
    if (!notification) return res.status(404).send("notification not found");
    res.send({ message: "Update notification success", data: notification });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get single notification by id
router.get("/:id", async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).send("notifications not found");
    res.send(notification);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete notification id
router.delete("/:id", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndRemove(req.params.id);
    if (!notification) return res.status(404).send("notification not found");
    res.send({ message: "Delete notification success", data: notification });
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;