import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import { authorizePermission } from "../middlewares/authorizePermission.js";
import {
  addMemberToTeam,
  createTeam,
  deleteTeam,
  removeMemberFromTeam,
} from "../controllers/team.controller.js";

const router = express.Router();

router.use(verifyToken);

router.post("/", authorizePermission("team.manage"), createTeam);
router.delete('/:teamId/delete', authorizePermission("team.manage"), deleteTeam);
router.put(
  "/:teamId/add-members",
  authorizePermission("team.manage"),
  addMemberToTeam
);
router.put(
  "/:teamId/remove-members",
  authorizePermission("team.manage"),
  removeMemberFromTeam
);

export default router;
