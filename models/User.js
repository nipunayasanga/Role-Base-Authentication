const mongoose = require("mongoose");

// Create a schema for the 'User' model. A schema defines the structure of documents within a collection in MongoDB.
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    // The 'role' field is a string that defaults to 'user', allowing role-based authorization.
    // It will define the user's access level, such as 'admin' or 'user'.
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    // Automatically include timestamps for when documents are created or updated.
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
