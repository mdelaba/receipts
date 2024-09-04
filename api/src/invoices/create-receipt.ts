import { Injectable } from '@nestjs/common';
import { join } from 'path';
import * as PDFDocument from 'pdfkit';
import * as sharp from 'sharp';
const fs = require('fs');

@Injectable()
export class CreateReceiptService {
    async createReceipt(receipt, path) {
        const doc = new PDFDocument({ size: 'LETTER', margin: 50 });
        const logoPath = join(process.cwd(), 'assets', 'logo.svg');

        // Convert SVG to PNG
        const svgBuffer = fs.readFileSync(logoPath);
        const pngBuffer = await sharp(svgBuffer).png().toBuffer();

        // Add header information
        doc.fontSize(12)
            .font('Helvetica-Bold')
            .text(`Receipt No #: ${receipt.id}`, { align: 'left' })
            .text(`Date: ${receipt.date}`, { align: 'left' })
            .font('Helvetica');

        // Add company logo
        doc.image(pngBuffer, 425, 45, { width: 150 })
            .moveDown(5);

        // Add recipient details
        doc.font('Helvetica-Bold')
            .text('Details:')
            .font('Helvetica')
            .text(receipt.customerName.toUpperCase(), { align: 'left' })
            .moveUp(2)

            // Add address information
            .fontSize(10)
            .text(receipt.address, { align: 'right' });

        const tableYPos = 250;
        const tableXPos = 70;
        // Payment Method Section
        // Draw a colored rectangle
        doc.rect(tableXPos - 20, tableYPos - 10, 510, 30) // x, y, width, height
            .fill('#ededed') // Set the fill color

            .fillColor('#000000')
            .fontSize(12)
            .font('Helvetica-Bold')
            .text('Payment Method', tableXPos, tableYPos)
            .text('Institution', tableXPos + 150, tableYPos)
            .text('Reference No', tableXPos + 250, tableYPos)
            .text('Amount', tableXPos + 400, tableYPos)
            .font('Helvetica')

            .lineWidth(0.5) // Change the number to set the desired thickness
            .moveTo(tableXPos - 20, tableYPos + 20) // Starting point of the line
            .lineTo(tableXPos + 490, tableYPos + 20) // Ending point of the line
            .stroke();

        doc.text(receipt.paymentMethod, tableXPos, tableYPos + 30)
            .text('SBTT', tableXPos + 150, tableYPos + 30)
            .text(`TTD ${this.formatCurrency(receipt.amount * 100)}`, tableXPos + 370, tableYPos + 30)

            .rect(tableXPos - 20, tableYPos + 60, 510, 30) // x, y, width, height
            .fill('#ededed') // Set the fill color

            .fillColor('#000000')
            .font('Helvetica-Bold')
            .text('Account', tableXPos + 100, tableYPos + 70)
            .text('Amount', tableXPos + 300, tableYPos + 70)

            .moveTo(tableXPos - 20, tableYPos + 90) // Starting point of the line
            .lineTo(tableXPos + 490, tableYPos + 90) // Ending point of the line
            .stroke()

            .font('Helvetica')
            .text('AM-NCOX-730', tableXPos, tableYPos + 100)
            .text(`TTD ${this.formatCurrency(receipt.amount * 100)}`, tableXPos + 415, tableYPos + 100)

            .lineWidth(1) // Change the number to set the desired thickness
            .moveTo(tableXPos - 20, tableYPos + 120) // Starting point of the line
            .lineTo(tableXPos + 490, tableYPos + 120) // Ending point of the line
            .stroke()

            .text('Authorized Signature:', tableXPos, tableYPos + 130)
            .font('Helvetica-Bold')
            .text(`Total: TTD ${this.formatCurrency(receipt.amount * 100)}`, tableXPos + 380, tableYPos + 130)
            .font('Helvetica')

            .lineWidth(1) // Change the number to set the desired thickness
            .moveTo(tableXPos - 20, tableYPos + 150) // Starting point of the line
            .lineTo(tableXPos + 490, tableYPos + 150) // Ending point of the line
            .stroke();

        // Finalize PDF file
        doc.end();
        doc.pipe(fs.createWriteStream(path));
    }

    formatCurrency(cents) {
        return '$' + (cents / 100).toFixed(2);
    }
}
