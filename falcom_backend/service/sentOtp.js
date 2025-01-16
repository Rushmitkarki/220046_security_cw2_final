


const axios = require('axios');
 
let isSent = false;
const sendOtp = async (phoneNumber, otp) => {
    const url =
    'https://api.managepoint.co/api/sms/send'
 
    // payload to send
    const payload = {
        apiKey: 'ea8bb02c-5ee6-40a3-b0e7-74617c316484',
        to : phoneNumber,
        message: `Your OTP is ${otp}`
    }
 
    // setting state
   try{
    const res = await axios.post(url, payload);
    if(res.status===2000){
        isSent = true;
 
    }
 
 
   }catch(error){
       console.log('Error in sending otp', error.message);
   }
 
   return isSent;
 
 
 
}
 
module.exports = sendOtp;