const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  JoinTrips,
  getTrips,
} = require("../controllers/authController");
const { feedbackController } = require("../controllers/feedbackController");
const { trip } = require("../controllers/userTripController");
const { allTrips } = require("../routes/tripRoute");
const { verifyJwt } = require("../middlware/verifyJwtMiddleware");
const { userTrips } = require("../controllers/dashboardController");
const { joinedTrips } = require("../controllers/joinedTripsController");
const { getTripMembers, updateMemberStatus } = require("../controllers/tripMembersController");

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post("/register", registerUser);

// @route   POST api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", loginUser);
router.post("/logout", verifyJwt, logoutUser);
router.post("/createTrips", verifyJwt, trip);
router.post("/joinTrips/:trip_id", verifyJwt, JoinTrips);
router.post("/createFeedback", feedbackController);
router.get("/joinedTrips", verifyJwt, joinedTrips);

router.get("/allTrips", allTrips);
router.get("/userTrips", verifyJwt, userTrips);
router.get("/trips/:trip_id", getTrips);

// ── Trip member approval routes ──
router.get("/tripMembers/:trip_id", verifyJwt, getTripMembers);
router.patch("/tripMembers/:member_id/status", verifyJwt, updateMemberStatus);

module.exports = router;
