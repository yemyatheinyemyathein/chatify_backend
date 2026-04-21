export function createWelcomeEmailTemplates(name, clientURL) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f9; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
              .header { background: linear-gradient(135deg, #00c6ff 0%, #0072ff 100%); padding: 40px 20px; text-align: center; color: white; }
              .header img { width: 60px; margin-bottom: 10px; }
              .header h1 { margin: 0; font-size: 28px; font-weight: 600; letter-spacing: 0.5px; }
              .content { padding: 40px 30px; color: #334155; line-height: 1.6; }
              .content h2 { color: #1e293b; margin-top: 0; }
              .steps-box { background-color: #f8fafc; border-left: 4px solid #0072ff; padding: 20px; border-radius: 0 8px 8px 0; margin: 25px 0; }
              .steps-box ul { list-style: none; padding: 0; margin: 0; }
              .steps-box li { margin-bottom: 10px; padding-left: 25px; position: relative; }
              .steps-box li::before { content: '✓'; position: absolute; left: 0; color: #0072ff; font-weight: bold; }
              .button-container { text-align: center; margin: 35px 0; }
              .btn { background: linear-gradient(135deg, #00c6ff 0%, #0072ff 100%); color: #ffffff !important; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; transition: transform 0.2s; }
              .footer { padding: 20px; text-align: center; font-size: 13px; color: #94a3b8; background-color: #f8fafc; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Welcome to Chatify!</h1>
              </div>
              <div class="content">
                  <h2>Hello ${name},</h2>
                  <p>We're excited to have you join our messaging platform! Chatify connects you with friends, family, and colleagues in real-time, no matter where they are.</p>
                  
                  <div class="steps-box">
                      <strong>Get started in just a few steps:</strong>
                      <ul>
                          <li>Set up your profile picture</li>
                          <li>Find and add your contacts</li>
                          <li>Start a conversation</li>
                          <li>Share photos, videos, and more</li>
                      </ul>
                  </div>
  
                  <div class="button-container">
                      <a href="${clientURL}" class="btn">Open Messenger</a>
                  </div>
  
                  <p>If you need any help or have questions, we're always here to assist you.<br>
                  Happy messaging!</p>
                  
                  <p>Best regards,<br><strong>The Chatify Team</strong></p>
              </div>
              <div class="footer">
                  &copy; 2026 Chatify Inc. All rights reserved.
              </div>
          </div>
      </body>
      </html>
    `;
  }