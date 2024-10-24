import { client } from "../config/twilio.js";

const sendOTP = async (to) => {
  try {
    return await client.verify.v2
      .services(process.env.TWILIO_SERVICE_SID)
      .verifications.create({
        to: `+91 ${to}`,
        channel: "sms",
      });
  } catch (error) {
    console.log(`Error sending otp: ${error}`);
  }
};

const verifyOTP = async (to, otp) => {
  try {
    return await client.verify.v2
      .services(process.env.TWILIO_SERVICE_SID)
      .verificationChecks.create({
        to: `+91 ${to}`,
        code: otp,
      });
  } catch (error) {
    console.log(`Error verifying otp: ${error}`);
  }
};

export { sendOTP, verifyOTP };
