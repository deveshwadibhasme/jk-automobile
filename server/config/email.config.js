import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.APP_PASS);

export const sendMail = async (payload) => {
  await resend.emails.send({ from: "J.K. Automobile <no-reply@sell4anything.com>", ...payload });
};
