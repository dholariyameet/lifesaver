const PDFDocument = require('pdfkit');

const generateCertificate = (donor) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margins: { top: 50, bottom: 50, left: 60, right: 60 }
    });

    const buffers = [];
    doc.on('data', chunk => buffers.push(chunk));
    doc.on('end',  () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    const W = 841; // A4 landscape width
    const H = 595; // A4 landscape height

    // ── Background ──────────────────────────────────────────
    doc.rect(0, 0, W, H).fill('#fff5f5');

    // Outer border
    doc.rect(20, 20, W - 40, H - 40)
       .lineWidth(3).strokeColor('#c0392b').stroke();

    // Inner border
    doc.rect(30, 30, W - 60, H - 60)
       .lineWidth(1).strokeColor('#e74c3c').stroke();

    // ── Header ───────────────────────────────────────────────
    doc.rect(0, 0, W, 110).fill('#c0392b');

    // Blood drop shape (simple circle)
    doc.circle(80, 55, 30).fill('#fff');
    doc.fontSize(28).fillColor('#c0392b').text('🩸', 57, 38);

    doc.fontSize(36)
       .fillColor('#ffffff')
       .font('Helvetica-Bold')
       .text('LIFE SAVER', 120, 25, { align: 'left' });

    doc.fontSize(13)
       .fillColor('#ffcccc')
       .font('Helvetica')
       .text('Blood Bank Management System', 120, 68);

    // Certificate ID top right
    doc.fontSize(10)
       .fillColor('#ffcccc')
       .text(`Certificate ID: ${donor.certificateId}`, 0, 45, { align: 'right', width: W - 40 });

    // ── Title ────────────────────────────────────────────────
    doc.fontSize(28)
       .fillColor('#c0392b')
       .font('Helvetica-Bold')
       .text('CERTIFICATE OF BLOOD DONATION', 0, 130, { align: 'center', width: W });

    // Decorative line under title
    doc.moveTo(180, 170).lineTo(W - 180, 170)
       .lineWidth(2).strokeColor('#c0392b').stroke();

    doc.moveTo(200, 174).lineTo(W - 200, 174)
       .lineWidth(0.5).strokeColor('#e74c3c').stroke();

    // ── Body text ────────────────────────────────────────────
    doc.fontSize(14)
       .fillColor('#555555')
       .font('Helvetica')
       .text('This is to proudly certify that', 0, 195, { align: 'center', width: W });

    // Donor name
    doc.fontSize(34)
       .fillColor('#c0392b')
       .font('Helvetica-Bold')
       .text(donor.name.toUpperCase(), 0, 220, { align: 'center', width: W });

    // Underline name
    const nameWidth = donor.name.length * 18;
    const nameX     = (W - nameWidth) / 2;
    doc.moveTo(nameX, 262).lineTo(nameX + nameWidth, 262)
       .lineWidth(1.5).strokeColor('#c0392b').stroke();

    doc.fontSize(14)
       .fillColor('#555555')
       .font('Helvetica')
       .text(
         'has successfully registered as a voluntary blood donor with Life Saver Blood Bank.',
         60, 275, { align: 'center', width: W - 120 }
       );

    // ── Info boxes ───────────────────────────────────────────
    const boxY  = 315;
    const boxH2 = 56;
    const boxes = [
      { label: 'Blood Group', value: donor.bloodGroup, x: 90  },
      { label: 'Age',         value: `${donor.age} years`, x: 270 },
      { label: 'City',        value: donor.city,      x: 450 },
      { label: 'Date',        value: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), x: 630 },
    ];

    boxes.forEach(b => {
      doc.rect(b.x, boxY, 150, boxH2).lineWidth(1).fillAndStroke('#ffe0e0', '#c0392b');
      doc.fontSize(11).fillColor('#888').font('Helvetica').text(b.label, b.x, boxY + 8, { width: 150, align: 'center' });
      doc.fontSize(16).fillColor('#c0392b').font('Helvetica-Bold').text(b.value, b.x, boxY + 26, { width: 150, align: 'center' });
    });

    // ── Footer ───────────────────────────────────────────────
    doc.rect(0, H - 100, W, 100).fill('#2c3e50');

    doc.fontSize(11)
       .fillColor('#ffffff')
       .font('Helvetica-Bold')
       .text('Dr. Life Saver', 100, H - 80);

    doc.fontSize(10)
       .fillColor('#aaaaaa')
       .font('Helvetica')
       .text('Director, Life Saver Blood Bank', 100, H - 62);

    // Signature line
    doc.moveTo(90, H - 88).lineTo(240, H - 88)
       .lineWidth(1).strokeColor('#ffffff').stroke();

    // Center message
    doc.fontSize(12)
       .fillColor('#ecf0f1')
       .font('Helvetica')
       .text(
         '"Every drop of blood you donate saves a precious life. Thank you for your generosity!"',
         0, H - 72, { align: 'center', width: W }
       );

    // Right side date issued
    doc.fontSize(10)
       .fillColor('#aaaaaa')
       .text(`Issued on: ${new Date().toLocaleDateString('en-IN')}`, W - 260, H - 68);

    doc.end();
  });
};

module.exports = generateCertificate;