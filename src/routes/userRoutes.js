import { Router } from "express";
import { getCurrentUser, updateUserProfile } from "../controllers/userController.js";
import { authenticate } from "../middleware/authenticate.js";


const router = Router();

router.patch("/users/me", authenticate, updateUserProfile);
router.get("/users/me", authenticate, getCurrentUser);

export default router
