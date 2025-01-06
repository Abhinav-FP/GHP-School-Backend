const axios = require('axios');

/**
 * Converts an image URL to a Base64 string.
 * @param {string} imageUrl - The URL of the image to be converted.
 * @returns {Promise<string>} - A promise that resolves to a Base64 string.
 */
const convertImageToBase64 = async (imageUrl) => {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    const mimeType = response.headers['content-type'];
    return `data:${mimeType};base64,${buffer.toString('base64')}`;
  } catch (error) {
    console.error('Error converting image to Base64:', error.message);
    throw new Error('Failed to convert image to Base64');
  }
};

module.exports = convertImageToBase64;
