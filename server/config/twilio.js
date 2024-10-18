import Twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  throw new Error(
    "Twilio credentials are not set. Please check your environment variables."
  );
}

const client = new Twilio(accountSid, authToken);

export { client };
