const axios = require("axios");

let isSent = false;
const sendOtp = async (phoneNumber, otp) => {
  const url = "https://api.managepoint.co/api/sms/send";

  // payload to send
  const payload = {
    apiKey: "83283bb1-1305-4e81-b1d2-5323c97e5e88",
    to: phoneNumber,
    message: `Your OTP is ${otp}`,
  };

  // setting state
  try {
    const res = await axios.post(url, payload);
    if (res.status === 2000) {
      isSent = true;
    }
  } catch (error) {
    console.log("Error in sending otp", error.message);
  }

  return isSent;
};

module.exports = sendOtp;
