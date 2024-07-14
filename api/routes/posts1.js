import express from "express"
import {getPost, getPosts, updatePost, deletePost, addPost} from "../controllers/post1.js"
const router=express.Router()

router.get("/", getPosts)
router.get("/:id",getPost )
router.post("/", addPost)
router.delete("/:id",deletePost )
router.put("/:id", updatePost);

export default router