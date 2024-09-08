import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  permissions: [String],
  description: { type: String, trim: true },
});

const Role = mongoose.models.Role || mongoose.model("Role", roleSchema);

export default Role;
