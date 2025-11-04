import Department from "../models/department.model.js";
import Team from "../models/team.model.js";
import User from "../models/user.model.js";

export const createTeam = async (req, res) => {
  try {
    const { name, departmentId } = req.body;
    const organizationId = req.user.organizationId;

    const department = await Department.findOne({
      _id: departmentId,
      organizationId: organizationId,
    });

    if (!department) {
      return res.status(404).json({ message: "Department not found." });
    }

    const newTeam = new Team({
      name,
      departmentId,
      organizationId,
    });

    await newTeam.save();

    department.teams.push(newTeam._id);
    await department.save();

    res.status(201).json(newTeam);
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addMemberToTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { employeeId, employeeIds } = req.body;
    const organizationId = req.user.organizationId;

    let membersToAdd = [];

    if (employeeId) {
      membersToAdd = [employeeId];
    } else if (employeeIds && Array.isArray(employeeIds)) {
      membersToAdd = employeeIds;
    }

    if (membersToAdd.length === 0) {
      return res.status(400).json({ message: "No employee IDs provided." });
    }

    // Verify all members belong to the same organization
    const users = await User.find({
      _id: { $in: membersToAdd },
      organizationId: organizationId,
    }).countDocuments();

    if (users !== membersToAdd.length) {
      return res.status(404).json({
        message: "One or more employees not found in your organization.",
      });
    }

    const updatedTeam = await Team.findOneAndUpdate(
      { _id: teamId, organizationId },
      { $addToSet: { members: { $each: membersToAdd } } },
      { new: true }
    );

    if (!updatedTeam) {
      return res
        .status(404)
        .json({ message: "Team not found in your organization." });
    }

    res.status(200).json(updatedTeam);
  } catch (error) {
    console.error("Error adding members:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeMemberFromTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { employeeId, employeeIds } = req.body;
    const organizationId = req.user.organizationId;

    let membersToRemove = [];

    if (employeeId) {
      membersToRemove = [employeeId];
    } else if (employeeIds && Array.isArray(employeeIds)) {
      membersToRemove = employeeIds;
    }

    if (membersToRemove.length === 0) {
      return res.status(400).json({ message: "No employee IDs provided." });
    }

    const updatedTeam = await Team.findOneAndUpdate(
      { _id: teamId, organizationId },
      { $pull: { members: { $in: membersToRemove } } },
      { new: true }
    );

    if (!updatedTeam) {
      return res
        .status(404)
        .json({ message: "Team not found in your organization." });
    }

    res.status(200).json(updatedTeam);
  } catch (error) {}
};
