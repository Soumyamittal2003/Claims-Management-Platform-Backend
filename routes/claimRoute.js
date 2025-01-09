import express from "express";
import { auth, isInsurer, isPatient } from "../middlewares/auth";
import {
    submitClaim,
    getMyClaims,
    getSingleClaim,
    getAllClaims,
    updateClaim,
  } from "../controllers/claimController.js";

const router = express.Router();

// Patient Routes
router.post("/claims", auth,isPatient, submitClaim); 
router.get("/claims/mine", auth,isPatient, getMyClaims);
router.get("/claims/:claimId", auth, getSingleClaim); 

// Insurer Routes
router.get("/claims", auth,isInsurer, getAllClaims); 
router.put("/claims/:claimId", auth, isInsurer, updateClaim); 


export default router;