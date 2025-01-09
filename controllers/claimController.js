import Claim from "../models/claimModel.js";
import User from "../models/userModel.js";

// Submit a new claim
export const submitClaim = async (req, res) => {
  try {
    const { policyName, claimAmount, description } = req.body;

    if (!policyName || !claimAmount) {
      return res
        .status(400)
        .json({ error: "Policy name and claim amount are required" });
    }
    //console.log(req.user.id);
    const newClaim = new Claim({
      createdBy: req.user.id,
      policyName,
      claimAmount,
      description,
    });

    if (req.file) {
      newClaim.uploadedDocument = req.file.path;
    }

    await newClaim.save();
    res
      .status(201)
      .json({ message: "Claim submitted successfully", claimId: newClaim._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// all claims for the logged-in patient
export const getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ createdBy: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(claims);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// a single claim by ID
export const getSingleClaim = async (req, res) => {
  try {
    const claim = await Claim.findOne({
      _id: req.params.claimId,
    });
    if (!claim) {
      return res.status(404).json({ error: "Claim not found" });
    }
    res.status(200).json(claim);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update claim status and others fileds

export const updateClaim = async (req, res) => {
  try {
    const { claimId } = req.params;
    const { status, approvedAmount, insurerComments } = req.body;

    
    const validStatuses = ["Pending", "Approved", "Rejected"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    
    const claim = await Claim.findById(claimId);
    if (!claim) {
      return res.status(404).json({ error: "Claim not found" });
    }

    
    if (status) claim.status = status;
    if (approvedAmount !== undefined) claim.approvedAmount = approvedAmount; 
    if (insurerComments) claim.insurerComments = insurerComments;

    
    claim.reviewedBy = req.user.id; 
    claim.reviewedDate = new Date();

    
    await claim.save();

    res.status(200).json({ message: "Claim updated successfully", claim });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllClaims = async (req, res) => {
  try {
    const Claims = await Claim.find({});
    res.json(Claims);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching claims", error: error.message });
  }
};
