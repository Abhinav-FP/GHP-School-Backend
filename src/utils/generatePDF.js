// const PDFDocument = require('pdfkit');

// function generatePDF(content) {
//   return new Promise((resolve, reject) => {
//     const doc = new PDFDocument();
//     let buffers = [];

//     // Capture PDF data into a buffer
//     doc.on('data', buffers.push.bind(buffers));
//     doc.on('end', () => {
//       const pdfBuffer = Buffer.concat(buffers);
//       resolve(pdfBuffer);
//     });

//     // Add content to the PDF
//     doc.fontSize(25).text('Your Document Title', { align: 'center' });
//     doc.moveDown();
//     doc.fontSize(12).text(content);

//     // Finalize the PDF and end the stream
//     doc.end();
//   });
// }

const pdf = require('html-pdf-node');

async function generatePDF(htmlContent) {
  return new Promise((resolve, reject) => {
    const options = { format: 'A4' }; // Set PDF options such as size
    const file = { content: htmlContent }; // The HTML content you want to convert

    pdf.generatePdf(file, options)
      .then(pdfBuffer => resolve(pdfBuffer))
      .catch(error => reject(error));
  });
}

module.exports = generatePDF;
