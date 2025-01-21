import React, { useState } from "react";
import registerui from "../../assets/images/loginui.png";
import "./Register.css";
import { Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { registerUserApi, verifyRegistrationOtpApi } from "../../apis/Api";
import validator from "validator";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  const validateForm = () => {
    let isValid = true;

    // Sanitize inputs
    const sanitizedFirstName = validator.escape(firstName.trim());
    const sanitizedLastName = validator.escape(lastName.trim());
    const sanitizedUsername = validator.escape(userName.trim());
    const sanitizedPhoneNumber = validator.escape(phoneNumber.trim());
    const sanitizedEmail = validator.normalizeEmail(email.trim());
    const sanitizedPassword = password.trim();
    const sanitizedConfirmPassword = confirmPassword.trim();

    // Validate First Name
    if (!sanitizedFirstName) {
      setFirstNameError("First Name is required");
      isValid = false;
    } else {
      setFirstNameError("");
    }

    // Validate Last Name
    if (!sanitizedLastName) {
      setLastNameError("Last Name is required");
      isValid = false;
    } else {
      setLastNameError("");
    }

    // Validate Username
    if (!sanitizedUsername) {
      setUsernameError("Username is required");
      isValid = false;
    } else {
      setUsernameError("");
    }

    // Validate Phone Number
    if (
      !sanitizedPhoneNumber ||
      !validator.isMobilePhone(sanitizedPhoneNumber, "en-IN")
    ) {
      setPhoneNumberError("Invalid Phone Number (10 digits required)");
      isValid = false;
    } else {
      setPhoneNumberError("");
    }

    // Validate Email
    if (!sanitizedEmail || !validator.isEmail(sanitizedEmail)) {
      setEmailError("Invalid Email Address");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Validate Password
    if (!sanitizedPassword) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (sanitizedPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      isValid = false;
    } else {
      setPasswordError("");
    }

    // Validate Confirm Password
    if (!sanitizedConfirmPassword) {
      setConfirmPasswordError("Confirm Password is required");
      isValid = false;
    } else if (sanitizedPassword !== sanitizedConfirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if user is blocked
    if (isBlocked) {
      toast.error(
        "You are blocked for 15 minutes due to too many failed attempts."
      );
      return;
    }

    // Validation
    if (!validateForm()) {
      setFailedAttempts((prev) => prev + 1);
      if (failedAttempts >= 3) {
        setIsBlocked(true);
        setTimeout(() => setIsBlocked(false), 15 * 60 * 1000); // Block for 15 minutes
      }
      return;
    }

    // Prepare data for API call
    const data = {
      firstName: validator.escape(firstName.trim()),
      lastName: validator.escape(lastName.trim()),
      userName: validator.escape(userName.trim()),
      phoneNumber: validator.escape(phoneNumber.trim()),
      email: validator.normalizeEmail(email.trim()),
      password: password.trim(),
    };

    // Make API call
    registerUserApi(data)
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.message);
          setIsOtpModalOpen(true); // Open OTP modal
        } else {
          toast.error(response.data.message);
        }
      })
      .catch(() => {
        toast.error("Registration failed. Please try again.");
      });
  };

  const handleOtpVerification = () => {
    const data = {
      email: validator.normalizeEmail(email.trim()),
      otp,
      password,
    };

    verifyRegistrationOtpApi(data)
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.message);
          setIsOtpModalOpen(false); // Close OTP modal
        } else {
          toast.error(response.data.message);
        }
      })
      .catch(() => {
        toast.error("OTP verification failed. Please try again.");
      });
  };

  return (
    <div className="register-container">
      <Toaster />
      <div className="register-box">
        <div className="register-form">
          <h2 className="register-title">Register</h2>
          <p className="register-subtitle">
            Please fill in the details to create an account
          </p>

          <form onSubmit={handleSubmit} className="register-fields">
            <div className="input-container">
              <input
                className="register-input"
                type="text"
                name="firstname"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {firstNameError && (
                <p className="error-message">{firstNameError}</p>
              )}
            </div>
            <div className="input-container">
              <input
                className="register-input"
                type="text"
                name="lastname"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {lastNameError && (
                <p className="error-message">{lastNameError}</p>
              )}
            </div>
            <div className="input-container">
              <input
                className="register-input"
                type="text"
                name="username"
                placeholder="Username"
                value={userName}
                onChange={(e) => setUsername(e.target.value)}
              />
              {usernameError && (
                <p className="error-message">{usernameError}</p>
              )}
            </div>
            <div className="input-container">
              <input
                className="register-input"
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && <p className="error-message">{emailError}</p>}
            </div>
            <div className="input-container">
              <input
                className="register-input"
                type="phone"
                name="phone"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              {phoneNumberError && (
                <p className="error-message">{phoneNumberError}</p>
              )}
            </div>
            <div className="input-container">
              <input
                className="register-input"
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && (
                <p className="error-message">{passwordError}</p>
              )}
            </div>
            <div className="input-container">
              <input
                className="register-input"
                type="password"
                name="confirm-password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {confirmPasswordError && (
                <p className="error-message">{confirmPasswordError}</p>
              )}
            </div>
            <button type="submit" className="register-button">
              Register
            </button>
          </form>

          <div className="login-link">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>

        <div className="register-image">
          <img src={registerui} alt="Register" />
        </div>
      </div>
      {/* OTP Modal */}
      {isOtpModalOpen && (
        <div className="otp-modal">
          <div className="otp-modal-content">
            <h3>Verify Your OTP</h3>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="register-input"
            />
            <button onClick={handleOtpVerification} className="register-button">
              Verify OTP
            </button>
            <button
              onClick={() => setIsOtpModalOpen(false)}
              className="register-button cancel-button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
