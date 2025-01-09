import mongoose from "mongoose";


const claimSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    policyName: {
      type: String,
      required: [true, "Policy Name is required"],
    },
    claimAmount: { type: Number, required: true },
    description: { type: String, required: true },
    uploadedDocument: { type: String,required: false },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    submissionDate: { type: Date, default: Date.now },
    approvedAmount: { type: Number },
    insurerComments: { type: String },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      
    },
    reviewedDate: { type: Date },
  },
  { timestamps: true }
);

const Claim = mongoose.model("Claim", claimSchema);

export default Claim;