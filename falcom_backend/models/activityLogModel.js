const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  action: { type: String, required: true }, // e.g., "login", "login_failed", "password_reset", "profile_update"
  timestamp: { type: Date, default: Date.now },
  ipAddress: { type: String },
  details: { type: mongoose.Schema.Types.Mixed }, // Additional details like OTP attempts, etc.
});

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
module.exports = ActivityLog;
