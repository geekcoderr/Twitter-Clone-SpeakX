import express from "express";
import { fetchLastState, fetchLastStatusJSON, register, signIn, signOut } from "../controllers/authControllers.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get('/me', protectRoute,fetchLastState);
router.get('/me-raw',protectRoute,fetchLastStatusJSON);
router.post('/login', signIn);
router.post('/logout', signOut);
router.post('/signup', register);

export default router;
