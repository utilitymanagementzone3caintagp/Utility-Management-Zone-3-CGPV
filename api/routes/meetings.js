import express from "express";
import { Meeting } from "../models/meeting.js";

const router = express.Router();

// Creating Meeting
router.post("/", async (req, res) => {
  try {
    const meeting = new Meeting({
      dateyr: req.body.dateyr,
      time: req.body.time,
    });
    await meeting.save();

    res.status(201).send({
      message: "add meeting success.",
      meeting: meeting,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get all Meeting
router.get("/", async (req, res) => {
  try {
    const meetings = await Meeting.find();
    res.send({ message: "Add GET Success", data: meetings });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update Meeting
router.put("/:id", async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      {
        dateyr: req.body.dateyr,
        time: req.body.time,
      },
      { new: true }
    );
    if (!meeting) return res.status(404).send("Meeting not found");
    res.send({ message: "Update meeting success", data: meeting });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get single meeting by id
router.get("/:id", async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).send("Meeting not found");
    res.send(Meeting);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete meeting id
router.delete("/:id", async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndRemove(req.params.id);
    if (!meeting) return res.status(404).send("Meeting not found");
    res.send({ message: "Delete meeting success", data: meeting });
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;