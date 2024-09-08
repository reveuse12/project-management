import nodemailer, { Transporter } from "nodemailer";
import User from "@/app/models/users";
import { MailResponse, SendEmailParams } from "./types";

export const sendEmail = async ({
  email,
  emailType,
  userId,
}: SendEmailParams): Promise<MailResponse> => {
  try {
    // Create a verification or reset token
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Update user document with token depending on the email type
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: code,
        verifyTokenExpiry: Date.now() + 3600000, // 1 hour expiry
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: code,
        forgotPasswordTokenExpiry: Date.now() + 3600000, // 1 hour expiry
      });
    }

    // Setup email transport configuration
    const transport: Transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST!,
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.MAIL_ID!,
        pass: process.env.MAIL_PASSWORD!,
      },
    });

    // Email options
    const mailOptions = {
      from: "Project-management",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `
      <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>${
              emailType === "VERIFY"
                ? "Verify Your Email"
                : "Reset Your Password"
            }</title>
            <style>
                /* Add any styling here */
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <img src="${process.env.LOGO_URL}" alt="Logo">
                </div>
                <div class="content">
                    <p>Dear User,</p>
                    <p>Please click the button below to ${
                      emailType === "VERIFY"
                        ? "verify your email"
                        : "reset your password"
                    }:</p>
                    <a href="${process.env.WEBSITE_DOMAIN}/${
        emailType === "VERIFY" ? "verifyemail" : "resetpassword"
      }/${code}" class="btn">${
        emailType === "VERIFY" ? "Verify Email" : "Reset Password"
      }</a>
                    <p>If you did not request this action, please ignore this email.</p>
                </div>
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} Project Management. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `,
    };

    // Send email and return response
    const mailresponse = await transport.sendMail(mailOptions);
    return mailresponse;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred"
    );
  }
};
