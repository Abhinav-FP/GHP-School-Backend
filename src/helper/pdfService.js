const puppeteer = require("puppeteer");//Only use version 21.3.1 only
const chromium = require("@sparticuz/chromium");// Use version 122.0.0 only
// import { TAILWIND_CDN, CHROMIUM_EXECUTABLE_PATH, ENV } from "@/lib/variables";
const CHROMIUM_EXECUTABLE_PATH ="https://github.com/Sparticuz/chromium/releases/download/v122.0.0/chromium-v122.0.0-pack.tar";
const ENV = "sdgdfgdx";
const TAILWIND_CDN ="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";

/**
 * Generate a PDF from an HTML document.
 *
 * @async
 * @param {string} htmlContent - The HTML document as a string.
 * @returns {Promise<Buffer>} - A Promise resolving to the generated PDF buffer.
 */
async function generatePdf(htmlContent) {
    let browser;

    try {
        // Launch the browser based on environment
        if (ENV === "production") {
            browser = await puppeteer.launch({
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath(CHROMIUM_EXECUTABLE_PATH),
                headless: true,
                ignoreHTTPSErrors: true,
            });
        } else {
            browser = await puppeteer.launch({
                args: ["--no-sandbox", "--disable-setuid-sandbox"],
                headless: "new",
            });
        }

        if (!browser) {
            throw new Error("Failed to launch browser");
        }

        const page = await browser.newPage();

        // Set the HTML content of the page
        await page.setContent(htmlContent, {
            waitUntil: "networkidle0", // Ensures all network requests are complete
        });

        // Add Tailwind CSS for styling
        await page.addStyleTag({
            url: TAILWIND_CDN,
        });

        // Generate the PDF
        const pdfBuffer = await page.pdf({
            format: "a4",
            printBackground: true,
        });

        return pdfBuffer;
    } catch (error) {
        console.error("Error generating PDF:", error);
        throw new Error(`Failed to generate PDF: ${error.message}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

module.exports = generatePdf;