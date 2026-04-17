const nodemailer = require('nodemailer');

const sendCertificateEmail = async (donor, pdfBuffer) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Life Saver Blood Bank" <${process.env.EMAIL_USER}>`,
    to: donor.email,
    subject: '🩸 Thank You for Registering as a Blood Donor — Life Saver',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        
        <div style="background: #c0392b; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🩸 Life Saver</h1>
          <p style="color: #ffcccc; margin: 8px 0 0;">Blood Bank Management System</p>
        </div>

        <div style="background: #fff5f5; padding: 32px; border: 1px solid #ffe0e0;">
          <h2 style="color: #c0392b;">Dear ${donor.name},</h2>
          
          <p style="color: #555; font-size: 16px; line-height: 1.6;">
            Thank you for registering as a <strong>voluntary blood donor</strong> with Life Saver. 
            Your generous act can help save up to <strong>3 lives</strong>!
          </p>

          <div style="background: white; border-radius: 10px; padding: 20px; margin: 20px 0; border: 1px solid #ffe0e0;">
            <h3 style="color: #c0392b; margin-top: 0;">Your Donor Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #888; width: 40%;">Name</td>
                <td style="padding: 8px 0; color: #333; font-weight: bold;">${donor.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #888;">Blood Group</td>
                <td style="padding: 8px 0;">
                  <span style="background: #ffe0e0; color: #c0392b; padding: 3px 12px; border-radius: 12px; font-weight: bold;">
                    ${donor.bloodGroup}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #888;">City</td>
                <td style="padding: 8px 0; color: #333;">${donor.city}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #888;">Certificate ID</td>
                <td style="padding: 8px 0; color: #333; font-family: monospace;">${donor.certificateId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #888;">Registration Date</td>
                <td style="padding: 8px 0; color: #333;">${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
              </tr>
            </table>
          </div>

          <p style="color: #555; font-size: 15px; line-height: 1.6;">
            📎 Your <strong>Donor Certificate</strong> is attached to this email as a PDF. 
            Please save it for your records.
          </p>

          <div style="background: #e0ffe8; border-radius: 8px; padding: 16px; margin: 20px 0; border-left: 4px solid #27ae60;">
            <p style="margin: 0; color: #27ae60; font-weight: bold;">
              ✅ You are now an active donor in the Life Saver network!
            </p>
          </div>

          <p style="color: #888; font-size: 13px;">
            "Every drop of blood you donate saves a precious life. Thank you for your generosity!"
          </p>
        </div>

        <div style="background: #2c3e50; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
          <p style="color: #aaa; margin: 0; font-size: 13px;">
            Life Saver Blood Bank Management System<br/>
            This is an automated email. Please do not reply.
          </p>
        </div>

      </div>
    `,
    attachments: [
      {
        filename: `LifeSaver_Certificate_${donor.name.replace(/ /g, '_')}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendCertificateEmail;