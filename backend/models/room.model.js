import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    floor: {
      type: String,
      required: true,
    },
    amenities: [
      {
        type: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

RoomSchema.index({ organizationId: 1, name: 1 }, { unique: true });

const Room = mongoose.model("Room", RoomSchema);
export default Room;