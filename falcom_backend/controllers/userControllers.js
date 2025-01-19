const { response } = require("express");

const userModel = require("../models/userModel");
const { checkout } = require("../routes/userRoutes");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendOtp = require("../service/sentOtp");
const fs = require("fs");
const path = require("path");
const User = require("../models/userModel");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const axios = require("axios");
const { sendRegisterOtp } = require("../service/sendEmailOtp");
const speakeasy = require("speakeasy");
const nodemailer = require("nodemailer");
const createUser = async (req, res) => {
  const { firstName, lastName, userName, email, phoneNumber, password } =
    req.body;

  if (
    !firstName ||
    !lastName ||
    !userName ||
    !email ||
    !phoneNumber ||
    !password
  ) {
    return res.json({
      success: false,
      message: "Please enter all details!",
    });
  }

  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists!",
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(`Generated OTP: ${otp}`); // Log the OTP

    // Save OTP in user model
    const otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    const newUser = new userModel({
      firstName,
      lastName,
      userName,
      email,
      phoneNumber,
      password, // Password will be hashed after OTP verification
      resetPasswordOTP: otp,
      resetPasswordExpires: otpExpires,
      isVerified: false,
    });

    await newUser.save();

    // Send OTP to user's email
    console.log(`Sending OTP to email: ${email}`); // Log email
    await sendRegisterOtp(email, otp);

    res.json({
      success: true,
      message: "User registered successfully! OTP sent to your email.",
    });
  } catch (error) {
    console.error("Error in createUser:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

const verifyRegistrationOtp = async (req, res) => {
  const { email, otp, password } = req.body;

  if (!email || !otp || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email, OTP, and password.",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User is already verified!",
      });
    }

    // Check OTP validity
    if (user.resetPasswordOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP!",
      });
    }

    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired!",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user details and set as verified
    user.password = hashedPassword;
    user.isVerified = true;
    user.resetPasswordOTP = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User verified and registered successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

const googleLogin = async (req, res) => {
  console.log(req.body);

  // Destructuring the data
  const { token } = req.body;

  // Validate
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Please fill all the fields",
    });
  }

  // try catch
  try {
    // verify token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, given_name, family_name, picture } = ticket.getPayload();

    let user = await userModel.findOne({ email: email });

    if (!user) {
      const { password, role } = req.body;

      const randomSalt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, randomSalt);

      // Fetch the image from Google
      const response = await axios.get(picture, { responseType: "stream" });

      // Set up image name and path
      const imageName = `${given_name}_${family_name}_${Date.now()}.png`;
      const imagePath = path.join(
        __dirname,
        `../public/profile_pictures/${imageName}`
      );

      // Ensure the directory exists
      const directoryPath = path.dirname(imagePath);
      fs.mkdirSync(directoryPath, { recursive: true });

      // Create a write stream to save the image
      const writer = fs.createWriteStream(imagePath);
      response.data.pipe(writer);

      // Wait for the image to be fully saved
      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      user = new userModel({
        firstName: given_name,
        lastName: family_name,
        email: email,
        userName: given_name,
        password: hashedPassword,
        isAdmin: role === "admin",
        profilePicture: imageName,
        fromGoogle: true,
      });
      await user.save();
    }

    // generate token
    const jwtToken = await jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      (options = {
        expiresIn:
          Date.now() + process.env.JWT_TOKEN_EXPIRE * 24 * 60 * 60 * 1000 ||
          "1d",
      })
    );

    return res.status(201).json({
      success: true,
      message: "User Logged In Successfully!",
      token: jwtToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error!",
      error: error,
    });
  }
};

const getUserByGoogleEmail = async (req, res) => {
  console.log(req.body);

  // Destructuring the data
  const { token } = req.body;

  // Validate
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Please fill all the fields",
    });
  }
  try {
    // verify token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    console.log(ticket);

    const { email } = ticket.getPayload();

    const user = await userModel.findOne({ email: email });

    if (user) {
      return res.status(200).json({
        success: true,
        message: "User found",
        data: user,
      });
    }

    res.status(201).json({
      success: true,
      message: "User not found",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: e,
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password, captchaToken } = req.body;

  if (!email || !password || !captchaToken) {
    return res.status(400).json({
      success: false,
      message: "All fields are required, including CAPTCHA!",
    });
  }

  // Verify CAPTCHA
  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: captchaToken,
        },
      }
    );

    if (!response.data.success) {
      return res
        .status(400)
        .json({ success: false, message: "CAPTCHA validation failed!" });
    }
  } catch (err) {
    console.error("CAPTCHA validation error:", err);
    return res
      .status(500)
      .json({ success: false, message: "CAPTCHA validation error" });
  }

  // Track login attempts in-memory
  const ip = req.ip;
  const loginAttempts = global.loginAttempts || {};
  const userKey = `login_attempts:${ip}`;
  const currentAttempts = loginAttempts[userKey] || {
    count: 0,
    timestamp: null,
  };

  if (
    currentAttempts.count >= 5 &&
    currentAttempts.timestamp &&
    Date.now() - currentAttempts.timestamp < 60 * 1000
  ) {
    return res.status(429).json({
      success: false,
      message: "Too many login attempts, please try again later.",
    });
  }

  // Login logic
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      loginAttempts[userKey] = {
        count: currentAttempts.count + 1,
        timestamp: Date.now(),
      };
      global.loginAttempts = loginAttempts;

      return res
        .status(400)
        .json({ success: false, message: "User doesn't exist" });
    }

    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect) {
      loginAttempts[userKey] = {
        count: currentAttempts.count + 1,
        timestamp: Date.now(),
      };
      global.loginAttempts = loginAttempts;

      return res
        .status(400)
        .json({ success: false, message: "Password is incorrect" });
    }

    // Generate OTP for MFA
    const otp = speakeasy.totp({
      secret: process.env.OTP_SECRET + user._id,
      encoding: "base32",
    });

    // Store OTP in database with expiration
    const otpExpiration = new Date();
    otpExpiration.setMinutes(otpExpiration.getMinutes() + 5); // OTP expires in 5 minutes

    user.googleOTP = otp;
    user.googleOTPExpires = otpExpiration;

    await user.save();

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: user.email,
      subject: "Your One-Time Password (OTP)",
      text: `Your OTP for login is: ${otp}`,
    });

    // Successful login (MFA pending), reset rate limit counter for IP
    delete loginAttempts[userKey];
    global.loginAttempts = loginAttempts;

    res.status(200).json({
      success: true,
      message: "OTP sent to your email. Please verify to complete login.",
      userId: user._id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: err,
    });
  }
};

const verifyOTP = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.status(400).json({
      success: false,
      message: "User ID and OTP are required!",
    });
  }

  try {
    // Find user and check OTP
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if OTP exists and hasn't expired
    if (!user.googleOTP || !user.googleOTPExpires) {
      return res.status(400).json({
        success: false,
        message: "No OTP found. Please request a new one.",
      });
    }

    // Check if OTP has expired
    if (new Date() > user.googleOTPExpires) {
      // Clear expired OTP
      await userModel.findByIdAndUpdate(userId, {
        googleOTP: null,
        googleOTPExpires: null,
      });

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Verify OTP
    if (user.googleOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please try again.",
      });
    }

    // OTP is valid, generate JWT token
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET);

    // Clear the used OTP
    await userModel.findByIdAndUpdate(userId, {
      googleOTP: null,
      googleOTPExpires: null,
    });

    res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: err,
    });
  }
};

// get current user

const getCurrentUser = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "User found!",
      user: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// get token
const getMe = async (req, res) => {
  try {
    console.log(req.body);
    const { id } = req.body;

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const token = await jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET
    );

    return res.status(200).json({
      success: true,
      message: "Token generated successfully!",
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error,
    });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Please provide an email.",
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    if (user.otpBlockExpires && Date.now() < user.otpBlockExpires) {
      return res.status(403).json({
        success: false,
        message: `OTP requests are blocked. Try again after ${Math.ceil(
          (user.otpBlockExpires - Date.now()) / 60000
        )} minutes.`,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    await sendOtp(email, otp); // Replace with your actual email sending service logic
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    user.otpBlockExpires = Date.now() + 10 * 60 * 1000; // Block OTP requests for 10 minutes
    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

const verifyOtpAndResetPassword = async (req, res) => {
  const { phoneNumber, otp, password } = req.body;
  if (!phoneNumber || !otp || !password) {
    return res.status(400).json({
      success: false,
      message: "Please enter all fields",
    });
  }
  try {
    const user = await userModel.findOne({ phoneNumber: phoneNumber });

    //Verify OTP
    if (user.resetPasswordOTP != otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    //Check if OTP is expired
    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    //Hash the password
    const randomSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, randomSalt);

    //update to database
    user.password = hashedPassword;
    await user.save();

    //Send response
    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const uploadProfilePicture = async (req, res) => {
  // const id = req.user.id;
  console.log(req.files);
  const { profilePicture } = req.files;

  if (!profilePicture) {
    return res.status(400).json({
      success: false,
      message: "Please upload an image",
    });
  }

  //  Upload the image
  // 1. Generate new image name
  const imageName = `${Date.now()}-${profilePicture.name}`;

  // 2. Make a upload path (/path/upload - directory)
  const imageUploadPath = path.join(
    __dirname,
    `../public/profile_pictures/${imageName}`
  );

  // Ensure the directory exists
  const directoryPath = path.dirname(imageUploadPath);
  fs.mkdirSync(directoryPath, { recursive: true });

  try {
    // 3. Move the image to the upload path
    profilePicture.mv(imageUploadPath);

    //  send image name to the user
    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      profilePicture: imageName,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error,
    });
  }
};

// edit user profile
const editUserProfile = async (req, res) => {
  const { firstName, lastName, userName, email, phoneNumber, profilePicture } =
    req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.userName = userName || user.userName;
    user.profilePicture = profilePicture || user.profilePicture;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({
      success: false,
      message: "Error updating user profile",
      error: error.message,
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  verifyOTP,
  getMe,
  getCurrentUser,
  forgotPassword,
  verifyOtpAndResetPassword,
  uploadProfilePicture,
  editUserProfile,
  googleLogin,
  getUserByGoogleEmail,
  verifyRegistrationOtp,
};
