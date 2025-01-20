import React, { useState } from "react";
import { Link } from "react-router-dom";
import loginui from "../../assets/images/loginui.png";
import "./Login.css";
import { Toaster, toast } from "react-hot-toast";
import {
  getUserByGoogleEmail,
  googleLoginApi,
  loginUserApi,
  verifyMfaCodeApi,
} from "../../apis/Api";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [googleToken, setGoogleToken] = useState("");
  const [googleId, setGoogleId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userId, setUserId] = useState("");

  const validation = () => {
    let isValid = true;

    if (email.trim() === "" || !email.includes("@")) {
      setEmailError("Email is empty or invalid");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (password.trim() === "") {
      setPasswordError("Password is empty");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleVerifyOtp = () => {
    const data = { userId, otp };

    console.log(data);

    verifyMfaCodeApi(data)
      .then((res) => {
        if (res.data.success) {
          toast.success("OTP Verified Successfully");
          setShowOtpModal(false);
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.userData));
          window.location.href = "/profile";
        } else {
          toast.error(res.data.message || "Failed to verify OTP");
        }
      })
      .catch((error) => {
        console.error("Error verifying OTP:", error);
        toast.error("Error verifying OTP");
      });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!validation()) {
      return;
    }

    const data = {
      email: email,
      password: password,
      captchaToken: captchaToken,
    };

    loginUserApi(data)
      .then((res) => {
        if (res.data.success) {
          toast.success(
            "OTP is required. Please enter the OTP sent to your email."
          );
          setUserId(res.data.userId);
          setShowOtpModal(true);
        } else if (res.data.success) {
          toast.success(res.data.message);
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.userData));

          if (res.data.userData.isAdmin) {
            window.location.href = "/admin/dashboard";
          } else {
            window.location.href = "/profile";
          }
        } else {
          toast.error(res.data.message || "Failed to login. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Unable to locate your account.");
      });
  };

  const handleGoogleLogin = () => {
    googleLoginApi({ token: googleToken, googleId, password })
      .then((response) => {
        if (response.status === 201) {
          toast.success("Login Successful");
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          window.location.href = "/profile";
        } else {
          console.error("Failed to send token to backend");
        }
      })
      .catch((error) =>
        console.error("Error sending token to backend:", error)
      );
  };

  return (
    <div className="login-container">
      <Toaster />
      <div className="login-box">
        <div className="login-form">
          <h2 className="login-title">Login</h2>
          <p className="login-subtitle">Please Login to Continue</p>

          <form onSubmit={handleLogin} className="login-fields">
            <div className="input-group">
              <input
                className="login-input"
                type="text"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && <p className="login-error">{emailError}</p>}
            </div>
            <div className="input-group">
              <input
                className="login-input"
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && <p className="login-error">{passwordError}</p>}
            </div>

            <div className="flex justify-center mb-4">
              <ReCAPTCHA
                sitekey="6LeEPLwqAAAAADqgg1ftjO4z6r14-GavrPGQLpwT"
                onChange={setCaptchaToken}
                theme="light"
              />
            </div>

            <button type="submit" className="login-button">
              Login
            </button>
          </form>

          <GoogleLogin
            onSuccess={(credentialResponse) => {
              const token = credentialResponse.credential;
              const details = jwtDecode(token);
              setGoogleId(details.sub);
              setGoogleToken(token);

              getUserByGoogleEmail({ token })
                .then((response) => {
                  if (response.status === 200) {
                    handleGoogleLogin({ token });
                  } else if (response.status === 201) {
                    setShowModal(true);
                  }
                })
                .catch((error) => {
                  if (error.response && error.response.status === 400) {
                    toast.warning(error.response.data.message);
                  } else {
                    toast.error("Error: Something went wrong");
                  }
                });
            }}
            onError={() => {
              console.log("Login Failed");
            }}
          />

          <div className="register-link">
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>

        <div className="login-image">
          <img src={loginui} alt="Login" />
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="otp-modal">
          <div className="otp-modal-content">
            <h3>Enter OTP</h3>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="otp-input"
            />
            <div className="otp-modal-buttons">
              <button onClick={handleVerifyOtp} className="otp-verify-button">
                Verify OTP
              </button>
              <button
                onClick={() => setShowOtpModal(false)}
                className="otp-cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
