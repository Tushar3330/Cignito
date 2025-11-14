import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Don't reveal if user exists or not for security
    if (!user) {
      return NextResponse.json({
        message: "If an account exists, you will receive a reset email",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Save token to database
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Send email with reset link
    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    console.log("🔐 Password Reset Request:");
    console.log("📧 Email:", email);
    console.log("🔗 Reset URL:", resetUrl);
    console.log("⏰ Expires:", resetTokenExpiry.toISOString());

    // For development, if email is not the registered Resend email,
    // just log the reset link and don't try to send email
    const isDevMode = process.env.NODE_ENV === "development";
    const registeredEmail = "tusharrana2505@gmail.com";
    
    if (isDevMode && email !== registeredEmail) {
      console.log("⚠️  DEV MODE: Email not sent (Resend testing restriction)");
      console.log("🔗 USE THIS LINK TO RESET PASSWORD:");
      console.log(resetUrl);
      console.log("\n");
      
      return NextResponse.json({
        message: "If an account exists, you will receive a reset email",
        devResetUrl: resetUrl, // Include in dev mode only
      });
    }

    try {
      const emailResult = await resend.emails.send({
        from: "Cignito <onboarding@resend.dev>",
        to: email,
        subject: "Reset Your Cignito Password",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: 'Arial', sans-serif;
                background-color: #f5f5f5;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 40px auto;
                background: white;
                border: 5px solid black;
                border-radius: 20px;
                padding: 40px;
              }
              .logo {
                text-align: center;
                margin-bottom: 30px;
              }
              .logo h1 {
                color: #EE2B69;
                font-size: 36px;
                font-weight: 900;
                margin: 0;
              }
              .content {
                color: #333;
                line-height: 1.6;
              }
              .button {
                display: inline-block;
                background: #EE2B69;
                color: white;
                text-decoration: none;
                padding: 15px 40px;
                border-radius: 50px;
                border: 3px solid black;
                font-weight: bold;
                text-transform: uppercase;
                margin: 20px 0;
              }
              .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 2px solid #eee;
                color: #666;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="logo">
                <h1>🐛 Cignito</h1>
              </div>
              <div class="content">
                <h2 style="color: #EE2B69;">Reset Your Password</h2>
                <p>Hi there!</p>
                <p>We received a request to reset your password for your Cignito account. Click the button below to create a new password:</p>
                <div style="text-align: center;">
                  <a href="${resetUrl}" class="button">Reset Password</a>
                </div>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.</p>
                <div class="footer">
                  <p>Need help? Contact us at support@cignito.com</p>
                  <p style="color: #999; font-size: 12px;">
                    Or copy and paste this URL into your browser:<br>
                    ${resetUrl}
                  </p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
      });

      console.log("Email sent successfully:", emailResult);

      return NextResponse.json({
        message: "If an account exists, you will receive a reset email",
      });
    } catch (emailError: any) {
      console.error("Resend email error:", emailError);
      
      // Still return success to user for security (don't reveal if email exists)
      // But log the actual error for debugging
      if (emailError.message?.includes("testing emails")) {
        console.error("⚠️  RESEND TESTING MODE: Can only send to tusharrana2505@gmail.com");
        console.error("⚠️  To fix: Verify a domain at resend.com/domains");
      }
      
      return NextResponse.json({
        message: "If an account exists, you will receive a reset email",
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
