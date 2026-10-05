import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTP = async (email, otp) => {
  console.log(`Preparing to send OTP to ${email}: ${otp}`);
  await transporter.sendMail({
    from: `"IT Help Desk" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "IT Help Desk - Login OTP",

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 500px;
        margin: auto;
        padding: 20px;
      ">

        <h2>IT Help Desk</h2>

        <p>Your login OTP is:</p>

        <h1 style="
          letter-spacing: 8px;
          text-align: center;
        ">
          ${otp}
        </h1>

        <p>
          This OTP is valid for <b>5 minutes</b>.
        </p>

        <p>
          If you did not request this OTP, please ignore this email.
        </p>

      </div>
    `,
  });
};
