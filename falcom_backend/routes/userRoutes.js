const router = require("express").Router();
const userController = require("../controllers/userControllers");
const { authGuard } = require("../middleware/authGuard");

// Creating user registration route
router.post("/create", userController.createUser);

// Creating user login route
router.post("/login", userController.loginUser);

// current user

router.get("/current", userController.getCurrentUser);

// get me
router.get("/getMe", authGuard, userController.getMe);

router.post('/forgot_password', userController.forgotPassword);
 
// verify otp and reset password
router.post('/verify_otp', userController.verifyOtpAndResetPassword)

// upload profile picture
router.post('/profile_picture',userController.uploadProfilePicture);

// update user details
router.put('/update', authGuard, userController.editUserProfile);

//google
router.post("/googleLogin", userController.googleLogin);
router.post("/getUserByGoogle", userController.getUserByGoogleEmail);

module.exports = router;
