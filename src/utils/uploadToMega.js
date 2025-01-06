const mega = require('megajs');

async function uploadToMega(pdfBuffer) {
  return new Promise((resolve, reject) => {
    // Log in to MEGA with your credentials
    const email = `bvbpschool@yahoo.com`; // Your MEGA account email
    const password = `bvbs@123456`; // Your MEGA account password

    const storage = new mega.Storage({
      email: email,
      password: password,
      autologin: true
    }, (error) => {
      if (error) {
        console.error("Error logging into MEGA:", error);
        return reject(error);
      }

      // Define the file name you want to use on MEGA
      const fileName = `invoice_${Date.now()}.pdf`; // Example: invoice_<timestamp>.pdf

      // Create a new readable stream for the buffer
      const uploadStream = storage.upload(fileName, pdfBuffer);

      uploadStream.on('progress', (progress) => {
        // console.log(`Upload progress: ${progress}%`);
      });

      uploadStream.on('complete', (file) => {
        file.link((error, link) => {
          if (error) {
            console.error("Error getting file link:", error);
            return reject(error);
          }
          // console.log("Uploaded file link:", link);
          resolve(link); // Resolve with the link
        });
      });

      uploadStream.on('error', (uploadError) => {
        console.error("Error uploading to MEGA:", uploadError);
        reject(uploadError); // Reject on upload error
      });
    });
  });
}

module.exports = uploadToMega;
