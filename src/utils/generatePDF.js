const PDFDocument = require('pdfkit');

function generatePDF(content) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    let buffers = [];

    // Capture PDF data into a buffer
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });

    // Add content to the PDF
    doc.fontSize(25).text('Your Document Title', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(content);

    // Finalize the PDF and end the stream
    doc.end();
  });
}

module.exports = generatePDF;
