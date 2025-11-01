import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const generatePDF = async (template, data) => {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Get the background image path - fixed: relative to server root
    const backgroundImagePath = path.join(process.cwd(), template.backgroundImageURL);
    
    // Check if background image exists
    if (!fs.existsSync(backgroundImagePath)) {
      throw new Error('Background image not found');
    }

    // Read the background image
    const backgroundImageBytes = fs.readFileSync(backgroundImagePath);
    
    // Determine image type and embed accordingly
    let backgroundImage;
    const fileExtension = path.extname(template.backgroundImageURL).toLowerCase();
    
    if (fileExtension === '.png') {
      backgroundImage = await pdfDoc.embedPng(backgroundImageBytes);
    } else if (fileExtension === '.jpg' || fileExtension === '.jpeg') {
      backgroundImage = await pdfDoc.embedJpg(backgroundImageBytes);
    } else {
      throw new Error('Unsupported image format. Please use PNG or JPG.');
    }

    // Get image dimensions
    const { width: imageWidth, height: imageHeight } = backgroundImage;
    
    // Add a page with the same dimensions as the background image
    const page = pdfDoc.addPage([imageWidth, imageHeight]);
    
    // Draw the background image
    page.drawImage(backgroundImage, {
      x: 0,
      y: 0,
      width: imageWidth,
      height: imageHeight,
    });

    // Draw text fields
    for (const field of template.fields) {
      let text = '';
      
      // Determine what text to display based on field name
      switch (field.name.toLowerCase()) {
        case 'recipient_name':
        case 'name':
          text = data.recipientName || '';
          break;
        case 'recipient_email':
        case 'email':
          text = data.recipientEmail || '';
          break;
        case 'issue_date':
        case 'date':
          text = new Date().toLocaleDateString();
          break;
        case 'serial_number':
        case 'serial':
          text = data.serialNumber || '';
          break;
        default:
          // Check custom data for the field
          text = data.customData?.[field.name] || field.name;
      }

      // Set font
      const font = await pdfDoc.embedFont('Helvetica');
      
      // Parse color
      const color = parseColor(field.color || '#000000');
      
      // Draw the text
      page.drawText(text, {
        x: field.x,
        y: imageHeight - field.y - field.fontSize, // PDF coordinates are bottom-up
        size: field.fontSize,
        font: font,
        color: color,
      });
    }

    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save();
    
    // Create filename
    const timestamp = Date.now();
    const fileName = `certificate_${data.recipientName.replace(/\s+/g, '_')}_${timestamp}.pdf`;
    const filePath = path.join(process.cwd(), 'certificates', fileName);
    
    // Ensure certificates directory exists
    const certificatesDir = path.join(process.cwd(), 'certificates');
    if (!fs.existsSync(certificatesDir)) {
      fs.mkdirSync(certificatesDir, { recursive: true });
    }
    
    // Write PDF to file
    fs.writeFileSync(filePath, pdfBytes);
    
    return {
      fileName,
      filePath,
      size: pdfBytes.length
    };
    
  } catch (error) {
    throw new Error(`PDF generation failed: ${error.message}`);
  }
};

// Helper function to parse hex color to RGB
const parseColor = (hexColor) => {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  return rgb(r, g, b);
};

// Helper function to generate bulk certificates
export const generateBulkCertificates = async (template, recipients) => {
  const results = [];
  
  for (const recipient of recipients) {
    try {
      const result = await generatePDF(template, recipient);
      results.push({
        success: true,
        recipient: recipient,
        fileName: result.fileName,
        filePath: result.filePath
      });
    } catch (error) {
      results.push({
        success: false,
        recipient: recipient,
        error: error.message
      });
    }
  }
  
  return results;
};
