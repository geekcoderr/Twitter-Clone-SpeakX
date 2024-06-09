import express from "express";
import { fetchSuggestedEntities, fetchUserDetails, modifyEntityDetails, modifyFollowStatus } from "../controllers/userControllers.js";
import { authSecurity } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/profile/:username", authSecurity, fetchUserDetails);
router.get("/suggested", authSecurity, fetchSuggestedEntities);
router.post("/follow/:id", authSecurity, modifyFollowStatus);
router.post("/update", authSecurity, modifyEntityDetails);

export default router;
