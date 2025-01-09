import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required for sign-up"],
      validate: [validator.isEmail, "Please provide a valid email!"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      enum: ["patient", "insurer", "admin"],
      required: [true, "Role is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },

    phone: {
      type: String,
      validate: {
        validator: function (v) {
          return /\d{10}/.test(v); // Ensures a 10-digit phone number
        },
        message: "Phone must contain exactly 10 digits!",
      },
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
  },
  { timestamps: true }
);

// Hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
