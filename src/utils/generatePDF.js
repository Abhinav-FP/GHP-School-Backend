const PDFDocument = require('pdfkit');

function generatePDF(content, tableData = []) {
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
    doc.moveDown();

    // Add table if provided
    if (tableData.length > 0) {
      generateTable(doc, tableData);
    }

    // Finalize the PDF and end the stream
    doc.end();
  });
}

function generateTable(doc, tableData) {
  const startX = 50;
  let startY = doc.y; // Current Y position on the page

  const cellPadding = 5;
  const columnWidths = [100, 100, 100]; // Adjust widths for each column

  // Draw header
  doc.fontSize(10).font('Helvetica-Bold');
  const headers = Object.keys(tableData[0]);
  headers.forEach((header, index) => {
    const x = startX + (index * columnWidths[index]);
    doc.text(header, x + cellPadding, startY + cellPadding, { width: columnWidths[index] - 2 * cellPadding, align: 'left' });
  });

  startY += 20; // Space for the next row

  // Draw rows
  doc.fontSize(10).font('Helvetica');
  tableData.forEach(row => {
    headers.forEach((header, index) => {
      const x = startX + (index * columnWidths[index]);
      doc.text(row[header], x + cellPadding, startY + cellPadding, { width: columnWidths[index] - 2 * cellPadding, align: 'left' });
    });
    startY += 20; // Move to next row
  });

  // Optionally, draw grid lines
  drawTableLines(doc, startX, startY, columnWidths, tableData.length + 1);
}

function drawTableLines(doc, startX, startY, columnWidths, rowCount) {
  const rowHeight = 20;
  const tableWidth = columnWidths.reduce((acc, width) => acc + width, 0);
  
  // Draw horizontal lines
  for (let i = 0; i <= rowCount; i++) {
    const y = startY - (rowCount - i) * rowHeight;
    doc.moveTo(startX, y).lineTo(startX + tableWidth, y).stroke();
  }

  // Draw vertical lines
  let currentX = startX;
  columnWidths.forEach(width => {
    doc.moveTo(currentX, startY - rowCount * rowHeight).lineTo(currentX, startY).stroke();
    currentX += width;
  });
}

module.exports = generatePDF;

