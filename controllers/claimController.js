import Claim from "../models/Claim.js";
import User from "../models/User.js";

// Submit a new claim
export const submitClaim = async (req, res) => {
  try {const { policyName, claimAmount, description, uploadedDocument } = req.body;

  const newClaim = new Claim({
    createdBy: req.user._id, // Extracted from authenticated user's token
    policyName,
    claimAmount,
    description,
    uploadedDocument,
  });

  await newClaim.save();
  res.status(201).json({ message: "Claim submitted successfully", claimId: newClaim._id });
} catch (error) {
  res.status(500).json({ error: error.message });
}
};


// Get all claims for the logged-in patient
export const getMyClaims = async (req, res) => {
    try {
      const claims = await Claim.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
      res.status(200).json(claims);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Get a single claim by ID
  export const getSingleClaim = async (req, res) => {
    try {
      const claim = await Claim.findOne({ _id: req.params.claimId, createdBy: req.user._id });
      if (!claim) {
        return res.status(404).json({ error: "Claim not found" });
      }
      res.status(200).json(claim);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Get all claims for insurers (with optional filters)
  export const getAllClaims = async (req, res) => {
    try {
      const { status, policyName } = req.query;
      const filters = {};
  
      if (status) filters.status = status;
      if (policyName) filters.policyName = { $regex: policyName, $options: "i" };
  
      const claims = await Claim.find(filters)
        .populate("createdBy", "name email")
        .populate("reviewedBy", "name email")
        .sort({ createdAt: -1 });
  
      res.status(200).json(claims);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Update claim status (for insurers)
  export const updateClaim = async (req, res) => {
    try {
      const { status, approvedAmount, insurerComments } = req.body;
  
      const claim = await Claim.findById(req.params.claimId);
      if (!claim) {
        return res.status(404).json({ error: "Claim not found" });
      }
  
      claim.status = status;
      claim.approvedAmount = approvedAmount;
      claim.insurerComments = insurerComments;
      claim.reviewedBy = req.user._id; // Insurer's ID
      claim.reviewedDate = new Date();
  
      await claim.save();
      res.status(200).json({ message: "Claim updated successfully", claim });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };