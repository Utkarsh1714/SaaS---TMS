import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import { authorizePermission } from "../middlewares/authorizePermission.js";
import {
  addMemberToTeam,
  createTeam,
  removeMemberFromTeam,
} from "../controllers/team.controller.js";

const router = express.Router();

router.use(verifyToken);

router.post("/", authorizePermission("can_manage_teams"), createTeam);
router.put(
  "/:teamId/add-members",
  authorizePermission("can_manage_teams"),
  addMemberToTeam
);
router.put(
  "/:teamId/remove-members",
  authorizePermission("can_manage_teams"),
  removeMemberFromTeam
);

export default router;
