import express from "express";
import {  postSignup, postLogin, postLogout, getOrderHistory } from "../controllers/auth.js";
import upload from "../utils/multer.js";
import { verifyjwt } from "../middlewares/jwtVerification.js";

const router = express.Router();

router.post('/signup',upload.single("image"), postSignup);
router.post('/login', postLogin);
router.post('/logout',verifyjwt, postLogout);
router.get('/order-history',verifyjwt, getOrderHistory)


export default router;