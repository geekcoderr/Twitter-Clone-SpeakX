import express from "express";
import { fetchSuggestedEntities, fetchUserDetails, modifyEntityDetails, modifyFollowStatus } from "../controllers/user.controller.js";
import { authSecurity } from "../middleware/authSecurity.js";

const router = express.Router();

router.get("/profile/:username", authSecurity, fetchUserDetails);
router.get("/suggested", authSecurity, fetchSuggestedEntities);
router.post("/follow/:id", authSecurity, modifyFollowStatus);
router.post("/update", authSecurity, modifyEntityDetails);

export default router;
