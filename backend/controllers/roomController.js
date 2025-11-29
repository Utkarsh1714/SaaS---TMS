import Room from "../models/room.model.js";
import Meeting from "../models/meeting.model.js";

export const createRoom = async (req, res) => {
  try {
    const { name, capacity, floor, amenities } = req.body;
    const { organizationId } = req.user;

    const existingRoom = await Room.findOne({
      name: name,
      organizationId: organizationId,
    });
    if (existingRoom)
      return res
        .status(400)
        .json({ message: "A room with this name alerady exists" });

    const newRoom = await Room({
      organizationId,
      name,
      capacity,
      floor,
      amenities,
      isActive: true,
    });

    await newRoom.save();

    res
      .status(200)
      .json({ message: "Room created successfully", room: newRoom });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllRooms = async (req, res) => {
  try {
    const { organizationId } = req.user;

    const rooms = await Room.find({
      organizationId: organizationId,
      isActive: true,
    }).sort({ name: 1 });

    res.status(200).json(rooms);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const { organizationId } = req.user;

    const room = await Room.findOne({
      _id: id,
      organizationId: organizationId,
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json(room);
  } catch (error) {
    console.error("Error fetching room:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { organizationId } = req.user;
    const updates = req.body;

    // Prevent updating organizationId
    delete updates.organizationId;

    const room = await Room.findOneAndUpdate(
      { _id: id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!room)
      return res
        .status(404)
        .json({ message: "Room not found or unauthorized" });

    res.status(200).json({
      message: "Room updated successfully",
      room,
    });
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { organizationId } = req.user;

    const room = await Room.findOne({
      _id: id,
      organizationId: organizationId,
    });
    if (!room) return res.status(404).json({ message: "Room not found" });

    const futureMeetings = await Meeting.countDocuments({
      roomId: id,
      startTime: { $gt: new Date() },
      status: "Scheduled",
    });

    if (futureMeetings > 0) {
      return res.status(400).json({
        message: `Cannot delete room. There are ${futureMeetings} upcoming meetings scheduled here.`,
      });
    }

    room.isActive = true;
    await room.save();

    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
