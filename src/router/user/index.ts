import express from "express";
import { asyncHandler } from "../../utils";
import { authenticateToken } from "../../middlewares/auth.middlewares";
import UserController from "../../controllers/user.controller";

const router = express.Router();
router.use(asyncHandler(authenticateToken));

router.get("/:userId", asyncHandler(UserController.getUser));
router.get("/", asyncHandler(UserController.getAllUsers));
router.patch("/:userId", asyncHandler(UserController.updateUser));
router.delete("/:userId", asyncHandler(UserController.deleteUser));

export default router;
