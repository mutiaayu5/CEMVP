/**
 * Email Templates
 */

export function getFirstTimeAdminEmail(mfaPin: string, setupUrl: string, email: string) {
  return {
    subject: 'Welcome to CEMVP - Admin Account Setup',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Admin Account Setup</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #D97706 0%, #B45309 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Welcome to CEMVP</h1>
            <p style="color: #FFE5B4; margin: 10px 0 0 0;">AI Automation Marketplace</p>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 2px solid #D97706; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #D97706; margin-top: 0;">Admin Account Setup Required</h2>
            
            <p>Hello,</p>
            
            <p>Your admin account has been created for <strong>${email}</strong>. To complete your setup, please follow these steps:</p>
            
            <div style="background: #FFE5B4; border-left: 4px solid #D97706; padding: 15px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #B45309;">Step 1: Set Your Password</h3>
              <p style="margin-bottom: 10px;">Click the button below to set your password:</p>
              <a href="${setupUrl}" style="display: inline-block; background: #D97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Set Password</a>
            </div>
            
            <div style="background: #f9f9f9; border-left: 4px solid #D97706; padding: 15px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #B45309;">Step 2: Your MFA PIN</h3>
              <p style="margin-bottom: 10px;">Use this PIN for Multi-Factor Authentication when logging in:</p>
              <div style="background: white; border: 2px dashed #D97706; padding: 20px; text-align: center; margin: 15px 0;">
                <p style="font-size: 32px; font-weight: bold; color: #D97706; letter-spacing: 5px; margin: 0;">${mfaPin}</p>
              </div>
              <p style="font-size: 12px; color: #666; margin-top: 10px;">
                <strong>Important:</strong> This PIN expires in 24 hours. You'll need to enter it every time you log in.
              </p>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <p style="margin: 0; color: #856404;">
                <strong>Security Note:</strong> Keep this PIN secure. Do not share it with anyone. 
                If you need to reset your PIN, contact support.
              </p>
            </div>
            
            <p>Once you've set your password and saved your MFA PIN, you can log in to the admin dashboard.</p>
            
            <p style="margin-top: 30px;">
              Best regards,<br>
              <strong>CEMVP Team</strong>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </body>
      </html>
    `,
    text: `
Welcome to CEMVP - Admin Account Setup

Your admin account has been created for ${email}. To complete your setup:

Step 1: Set Your Password
Visit: ${setupUrl}

Step 2: Your MFA PIN
Use this PIN for Multi-Factor Authentication when logging in:
${mfaPin}

Important: This PIN expires in 24 hours. You'll need to enter it every time you log in.

Security Note: Keep this PIN secure. Do not share it with anyone.

Best regards,
CEMVP Team
    `.trim(),
  }
}

export function getMfaPinEmail(mfaPin: string, email: string) {
  return {
    subject: 'Your CEMVP MFA PIN',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>MFA PIN</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #D97706 0%, #B45309 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">CEMVP MFA PIN</h1>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 2px solid #D97706; border-top: none; border-radius: 0 0 10px 10px;">
            <p>Hello,</p>
            
            <p>Your MFA PIN for <strong>${email}</strong> is:</p>
            
            <div style="background: #f9f9f9; border: 2px dashed #D97706; padding: 20px; text-align: center; margin: 20px 0;">
              <p style="font-size: 32px; font-weight: bold; color: #D97706; letter-spacing: 5px; margin: 0;">${mfaPin}</p>
            </div>
            
            <p style="font-size: 12px; color: #666;">
              <strong>Important:</strong> This PIN expires in 24 hours. Use it to complete your login.
            </p>
            
            <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <p style="margin: 0; color: #856404;">
                <strong>Security Note:</strong> Never share this PIN with anyone. 
                If you didn't request this PIN, please contact support immediately.
              </p>
            </div>
            
            <p>Best regards,<br><strong>CEMVP Team</strong></p>
          </div>
        </body>
      </html>
    `,
    text: `
Your CEMVP MFA PIN

Your MFA PIN for ${email} is:
${mfaPin}

Important: This PIN expires in 24 hours. Use it to complete your login.

Security Note: Never share this PIN with anyone.

Best regards,
CEMVP Team
    `.trim(),
  }
}

