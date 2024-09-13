import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  permissions: {
    type: [String],
    enum: ["read", "write", "create", "update", "delete"],
    default: "read",
  },
  description: { type: String, trim: true },
});

const Role = mongoose.models.Role || mongoose.model("Role", roleSchema);

export default Role;
