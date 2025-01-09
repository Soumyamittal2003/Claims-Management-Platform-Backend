import express from "express";
import { auth, isInsurer, isPatient } from "../middlewares/auth.js";
import {
    submitClaim,
    getMyClaims,
    getSingleClaim,
    getAllClaims,
    updateClaim,
  } from "../controllers/claimController.js";
import upload from "../middlewares/multerConfig.js";

const router = express.Router();

// Insurer Routes
router.put("/update/:claimId", auth, isInsurer, updateClaim); 
router.get("/all-claims", auth,isInsurer, getAllClaims); 

// Patient Routes
router.post("/new-create", auth,isPatient,upload.single("uploadedDocument"), submitClaim); 
router.get("/myclaims", auth,isPatient, getMyClaims);


router.get("/:claimId", auth, getSingleClaim); 




export default router;