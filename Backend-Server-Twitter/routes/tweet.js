import express from "express";
import {
    addComment,
    createTweet,
    getAllTweets,
    getFollowingTweets,
    getLikedTweets,
    getUserTweets,
    removeTweet,
    toggleLikeTweet
} from "../controllers/tweetControllers.js";
import { authSecurity } from "../middleware/authSecurity.js";

const router = express.Router();

router.get("/all", authSecurity, getAllTweets); 
router.get("/following", authSecurity, getFollowingTweets); 
router.get("/likes/:id", authSecurity, getLikedTweets); 
router.get("/user/:username", authSecurity, getUserTweets); 
router.post("/create", authSecurity, createTweet); 
router.post("/like/:id", authSecurity, toggleLikeTweet); 
router.post("/comment/:id", authSecurity, addComment); 
router.delete("/:id", authSecurity, removeTweet); 

export default router;
