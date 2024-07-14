import express from "express";
import { Usernotification } from "../models/usernotification.js"

const router = express.Router();

// Creating notification
router.post("/", async (req, res) => {
  try {
    const usernotification = new Usernotification({
      email: req.body.email,
      userdefinenotifi: req.body.userdefinenotifi,
      usertimedatenotifi: req.body.usertimedatenotifi,
    });
    await usernotification.save();

    res.status(201).send({
      message: "add notification success.",
      usernotification: usernotification,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});



// Get notifications for a specific user by email
router.get("/", async (req, res) => {
  try {
    const { email } = req.query;
    const usernotifications = await Usernotification.find({ email });
    res.send({ message: "GET Success", data: usernotifications });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update notification
router.put("/:id", async (req, res) => {
  try {
    const usernotification = await Usernotification.findByIdAndUpdate(
      req.params.id,
      {
        email: req.body.email,
        userdefinenotifi: req.body.userdefinenotifi,
        usertimedatenotifi: req.body.usertimedatenotifi,
      },
      { new: true }
    );
    if (!usernotification) return res.status(404).send("notification not found");
    res.send({ message: "Update notification success", data: usernotification });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get single notification by id
router.get("/:id", async (req, res) => {
  try {
    const usernotification = await Usernotification.findById(req.params.id);
    if (!usernotification) return res.status(404).send("notifications not found");
    res.send(usernotification);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete notification id
router.delete("/:id", async (req, res) => {
  try {
    const usernotification = await Usernotification.findByIdAndRemove(req.params.id);
    if (!usernotification) return res.status(404).send("notification not found");
    res.send({ message: "Delete notification success", data: usernotification });
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;