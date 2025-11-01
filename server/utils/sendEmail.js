import nodemailer from 'nodemailer';
import { logger } from './logger.js';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send certificate email
export const sendCertificateEmail = async (recipientEmail, recipientName, downloadUrl, certificateTitle) => {
  try {
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      logger.warn('Email configuration not found. Skipping email send.');
      return { success: false, message: 'Email configuration not found' };
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"CertifyPro" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: `Your Certificate: ${certificateTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Congratulations!</h2>
          <p>Dear ${recipientName},</p>
          <p>Your certificate "${certificateTitle}" has been generated and is ready for download.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}${downloadUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Download Certificate
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            This certificate is valid and can be verified through our platform.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">
            This is an automated message from CertifyPro. Please do not reply to this email.
          </p>
        </div>
      `,
      text: `
        Congratulations!
        
        Dear ${recipientName},
        
        Your certificate "${certificateTitle}" has been generated and is ready for download.
        
        Download link: ${process.env.CLIENT_URL}${downloadUrl}
        
        This certificate is valid and can be verified through our platform.
        
        Best regards,
        CertifyPro Team
      `
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Certificate email sent to ${recipientEmail}: ${info.messageId}`);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Send bulk certificate emails
export const sendBulkCertificateEmails = async (certificates) => {
  const results = [];
  
  for (const cert of certificates) {
    const result = await sendCertificateEmail(
      cert.recipientEmail,
      cert.recipientName,
      cert.downloadURL,
      cert.certificateTitle
    );
    
    results.push({
      certificateId: cert._id,
      recipientEmail: cert.recipientEmail,
      ...result
    });
  }
  
  return results;
};

// Send welcome email to new users
export const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      logger.warn('Email configuration not found. Skipping welcome email.');
      return { success: false, message: 'Email configuration not found' };
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"CertifyPro" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: 'Welcome to CertifyPro!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to CertifyPro!</h2>
          <p>Dear ${userName},</p>
          <p>Welcome to CertifyPro! Your account has been successfully created.</p>
          <p>You can now start creating and managing certificates.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/login" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Login to CertifyPro
            </a>
          </div>
          <p style="color: #666;">
            If you have any questions, please contact our support team.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">
            This is an automated message from CertifyPro.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Welcome email sent to ${userEmail}: ${info.messageId}`);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Welcome email sending failed:', error);
    return { success: false, error: error.message };
  }
};
