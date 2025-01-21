const express = require("express");
const router = express.Router();
const activityController = require("../controllers/activityController");
const { authGuard, isAdmin } = require("../middleware/authGuard");

// Get all user activities (Admin only)
router.get(
  "/activities",
  authGuard,
  isAdmin,
  activityController.getAllUserActivities
);

// Delete a user (Admin only)
router.delete(
  "/user/:userId",
  authGuard,
  isAdmin,
  activityController.deleteUser
);

module.exports = router;
