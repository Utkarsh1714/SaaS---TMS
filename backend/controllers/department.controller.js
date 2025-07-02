import mongoose from "mongoose";
import Department from "../models/department.model.js";

export const createDepartment = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name)
      return res.status(400).json({ message: "Department name is required" });

    const existing = await Department.findOne({
      name,
      organizationId: req.user.organizationId,
    });

    if (existing)
      return res.status(409).json({ message: "Department already exists" });

    const department = await Department.create({
      name,
      organizationId: req.user.organizationId,
    });

    res.status(201).json({ message: "Department created", department });
  } catch (error) {
    console.error("Create Department Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getDepartment = async (req, res) => {
  try {
    const departments = await Department.find({
      organizationId: req.user.organizationId,
    });

    res.status(200).json(departments);
  } catch (error) {
    console.error("Get Departments Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getDepartmentWithDetails = async (req, res) => {
  try {
    const departments = await Department.aggregate([
      {
        $match: {
          organizationId: new mongoose.Types.ObjectId(req.user.organizationId),
        },
      },
      {
        $lookup: {
          from: "users",
          let: { deptId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$departmentId", "$$deptId"],
                },
              },
            },
            {
              $project: {
                username: 1,
                email: 1,
                role: 1,
              },
            },
          ],
          as: "users",
        },
      },
      {
        $addFields: {
          manager: {
            $first: {
              $filter: {
                input: "$users",
                as: "user",
                cond: { $eq: ["$$user.role", "Manager"] },
              },
            },
          },
          totalEmployees: {
            $size: {
              $filter: {
                input: "$users",
                as: "user",
                cond: {
                  $and: [
                    { $ne: ["$$user.role", "Manager"] },
                    { $ne: ["$$user.role", "Boss"] },
                  ],
                },
              },
            },
          },
        },
      },
      {
        $project: {
          name: 1,
          manager: { username: 1, email: 1 },
          totalEmployees: 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    res.status(200).json(departments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch details" });
  }
};

export const getSingleDepartmentWithDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const departmentDetails = await Department.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
          organizationId: new mongoose.Types.ObjectId(req.user.organizationId),
        },
      },
      {
        $lookup: {
          from: "users",
          let: { deptId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$departmentId", "$$deptId"],
                },
              },
            },
            {
              $project: {
                username: 1,
                email: 1,
                role: 1,
              },
            },
          ],
          as: "users",
        },
      },
      {
        $addFields: {
          manager: {
            $first: {
              $filter: {
                input: "$users",
                as: "user",
                cond: { $eq: ["$$user.role", "Manager"] },
              },
            },
          },
          employees: {
            $filter: {
              input: "$users",
              as: "user",
              cond: {
                $and: [
                  { $ne: ["$$user.role", "Manager"] },
                  { $ne: ["$$user.role", "Boss"] },
                ],
              },
            },
          },
          totalEmployees: {
            $size: {
              $filter: {
                input: "$users",
                as: "user",
                cond: {
                  $and: [
                    { $ne: ["$$user.role", "Manager"] },
                    { $ne: ["$$user.role", "Boss"] },
                  ],
                },
              },
            },
          },
        },
      },
      {
        $project: {
          name: 1,
          manager: { username: 1, email: 1 },
          totalEmployees: 1,
          employees: {
            $map: {
              input: "$employees",
              as: "emp",
              in: {
                username: "$$emp.username",
                email: "$$emp.email",
                role: "$$emp.role",
              },
            },
          },
        },
      },
    ]);

    if (!departmentDetails || departmentDetails.length === 0) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json(departmentDetails[0]); // return single department object
  } catch (error) {
    console.error("Get Department Details Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Department.findOneAndDelete({
      _id: id,
      organizationId: req.user.organizationId,
    });

    if (!deleted)
      return res.status(404).json({ message: "Department not found" });

    res.status(200).json({ message: "Department deleted" });
  } catch (error) {
    console.error("Delete Department Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
