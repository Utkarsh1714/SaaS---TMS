import mongoose from "mongoose";
import Department from "../models/department.model.js";
import User from "../models/user.model.js";
import Role from "../models/Role.model.js";

export const createDepartment = async (req, res) => {
  try {
    const { name, description, budget } = req.body;

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
      description,
      budget,
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

export const changeDepartmentManager = async (req, res) => {
  try {
    const { departmentId, newManagerId } = req.body;

    if (!departmentId || !newManagerId) {
      return res.status(400).json({ message: "Department ID and Manager ID are required" });
    }

    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    console.log(department.organizationId, req.user.organizationId);

    if (department.organizationId.toString() !== req.user.organizationId.toString()) {
      return res.status(403).json({ message: "Unauthorized: Department does not belong to your organization"});
    }

    const newManager = await User.findById(newManagerId);
    if (!newManager) {
      return res.status(404).json({ message: "User not found" });
    }

    const managerRole = await Role.findOne({ name: "Manager" });
    const employeeRole = await Role.findOne({ name: "Employee" });

    if (!managerRole || !employeeRole) {
      return res.status(500).json({ message: "Required roles not found in the system" });
    }

    if (department.manager) {
      const oldManager = await User.findById(department.manager);
      if (oldManager) {
        oldManager.role = employeeRole._id;
        await oldManager.save();
      }
    }

    newManager.role = managerRole._id;
    await newManager.save();

    department.manager = newManager._id;
    await department.save();

    await department.populate("manager", "username email jobTitle role _id");

    res.status(200).json({ message: "Department manager changed successfully", department });
  } catch (error) {
    console.error("Change Department Manager Error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export const getDepartmentWithDetails = async (req, res) => {
  try {
    // Step 1: Get all employee counts in a single, efficient aggregate query.
    const employeeCounts = await User.aggregate([
      // Only match users within the current organization
      {
        $match: {
          organizationId: new mongoose.Types.ObjectId(req.user.organizationId),
          departmentId: { $exists: true, $ne: null }, // Ensure departmentId exists
        },
      },
      // Group users by their departmentId and count them
      {
        $group: {
          _id: "$departmentId",
          totalEmployees: { $sum: 1 },
        },
      },
    ]);

    // Create a Map for quick lookups (O(1) complexity)
    const employeeCountsMap = new Map(
      employeeCounts.map((item) => [item._id.toString(), item.totalEmployees])
    );

    // Step 2: Get all departments and populate their manager's details.
    const departments = await Department.find({
      organizationId: req.user.organizationId,
    })
      .sort({ createdAt: -1 })
      .populate("manager", "_id username email") // Populate with specific fields
      .lean(); // Use .lean() for performance

    // Step 3: Combine the two results in your application.
    const finalResponse = departments.map((dept) => ({
      _id: dept._id,
      name: dept.name,
      // Look up the count from the map, defaulting to 0 if not found
      totalEmployees: employeeCountsMap.get(dept._id.toString()) || 0,
      manager: dept.manager, // The manager object is already populated
    }));

    res.status(200).json(finalResponse);
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
          organizationId: req.user.organizationId,
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
              $lookup: {
                from: "roles", // The name of your roles collection
                localField: "role",
                foreignField: "_id",
                as: "roleDetails",
              },
            },
            {
              $project: {
                username: 1,
                email: 1,
                jobTitle: 1,
                role: { $first: "$roleDetails.name" },
                contactNo: 1,
              },
            },
          ],
          as: "users",
        },
      },
      {
        $lookup: {
          from: "teams", // Your 'teams' collection name
          localField: "teams", // The array of IDs in the Department model
          foreignField: "_id",
          as: "teams", // Overwrite the IDs with team objects
          pipeline: [
            // This pipeline runs for each team to populate its members
            {
              $lookup: {
                from: "users",
                localField: "members",
                foreignField: "_id",
                as: "members_data",
                pipeline: [
                  // Project only what you need from members
                  {
                    $project: {
                      _id: 1,
                      username: 1,
                      email: 1,
                      jobTitle: 1,
                    },
                  },
                ],
              },
            },
            {
              // Clean up the team object
              $project: {
                _id: 1,
                name: 1,
                members: "$members_data", // Overwrite member IDs with populated data
              },
            },
          ],
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
                  $and: [{ $ne: ["$$user.role", "Boss"] }],
                },
              },
            },
          },
        },
      },
      {
        $project: {
          createdAt: 1,
          name: 1,
          description: 1,
          budget: 1,
          teams: 1,
          manager: {
            $cond: [
              { $gt: ["$manager", null] },
              {
                id: "$manager._id",
                username: "$manager.username",
                email: "$manager.email",
                role: "$manager.role",
                jobTitle: "$manager.jobTitle",
                contactNo: "$manager.contactNo",
              },
              null,
            ],
          },
          totalEmployees: 1,
          employees: {
            $map: {
              input: "$employees",
              as: "emp",
              in: {
                username: "$$emp.username",
                email: "$$emp.email",
                role: "$$emp.role",
                jobTitle: "$$emp.jobTitle",
                contactNo: "$$emp.contactNo",
                _id: "$$emp._id",
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
