const PDFDocument = require('pdfkit');
const fs = require('fs');

export function createInvoice(invoice, path) {
    let doc = new PDFDocument({ margin: 50 });

    generateHeader(doc);
    generateCustomerInformation(doc, invoice);
    generateInvoiceTable(doc, invoice);
    generateFooter(doc);

    doc.end();
    doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc) {
    doc
        .fillColor('#444444')
        .fontSize(20)
        .text('Company Name', 110, 57)
        .fontSize(10)
        .text('Company Name', 200, 50, { align: 'right' })
        .text('Street Address', 200, 65, { align: 'right' })
        .text('City, State, ZIP Code', 200, 80, { align: 'right' })
        .moveDown();
}

function generateCustomerInformation(doc, invoice) {
    doc
        .fillColor('#444444')
        .fontSize(20)
        .text('Invoice', 50, 160);

    generateHr(doc, 185);

    const customerInformationTop = 200;

    doc
        .fontSize(10)
        .text('Invoice Number:', 50, customerInformationTop)
        .font('Helvetica-Bold')
        .text(invoice.id, 150, customerInformationTop)
        .font('Helvetica')
        .text('Invoice Date:', 50, customerInformationTop + 15)
        .text(invoice.date, 150, customerInformationTop + 15)
        .text('Balance Due:', 50, customerInformationTop + 30)
        .text(
            formatCurrency(invoice.amount * 100),
            150,
            customerInformationTop + 30
        )

        // .font('Helvetica-Bold')
        // .text(invoice.shipping.name, 300, customerInformationTop)
        // .font('Helvetica')
        // .text(invoice.shipping.address, 300, customerInformationTop + 15)
        // .text(
        //     invoice.shipping.city +
        //     ', ' +
        //     invoice.shipping.state +
        //     ', ' +
        //     invoice.shipping.country,
        //     300,
        //     customerInformationTop + 30
        // )
        .moveDown();

    generateHr(doc, 252);
}

function generateInvoiceTable(doc, invoice) {
    let i;
    const invoiceTableTop = 330;

    doc.font('Helvetica-Bold');
    generateTableRow(
        doc,
        invoiceTableTop,
        'Item',
        'Description',
        'Unit Cost',
        'Quantity',
        'Line Total'
    );
    generateHr(doc, invoiceTableTop + 20);
    doc.font('Helvetica');

    const position = invoiceTableTop + 30;
    generateTableRow(
        doc,
        position,
        invoice.id,
        invoice.purpose,
        formatCurrency(invoice.amount * 100),
        1,
        formatCurrency(invoice.amount * 100)
    );

    generateHr(doc, position + 20);

    const subtotalPosition = invoiceTableTop + 60;
    generateTableRow(
        doc,
        subtotalPosition,
        '',
        '',
        'Subtotal',
        '',
        formatCurrency(invoice.amount * 100)
    );

    const paidToDatePosition = subtotalPosition + 250;
    generateTableRow(
        doc,
        paidToDatePosition,
        '',
        '',
        'Paid To Date',
        '',
        formatCurrency(0)
    );

    const duePosition = paidToDatePosition + 25;
    doc.font('Helvetica-Bold');
    generateTableRow(
        doc,
        duePosition,
        '',
        '',
        'Balance Due',
        '',
        formatCurrency(invoice.amount * 100)
    );
    doc.font('Helvetica');
}

function generateFooter(doc) {
    doc
        .fontSize(10)
        .text(
            'Payment is due within 15 days. Thank you for your business.',
            50,
            710,
            { align: 'center', width: 500 }
        );
}

function generateTableRow(
    doc,
    y,
    item,
    description,
    unitCost,
    quantity,
    lineTotal
) {
    doc
        .fontSize(10)
        .text(item, 50, y)
        .text(description, 150, y)
        .text(unitCost, 280, y, { width: 90, align: 'right' })
        .text(quantity, 370, y, { width: 90, align: 'right' })
        .text(lineTotal, 0, y, { align: 'right' });
}

function generateHr(doc, y) {
    doc
        .strokeColor('#aaaaaa')
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}

function formatCurrency(cents) {
    return '$' + (cents / 100).toFixed(2);
}

// function formatDate(date) {
//     const monthNames = [
//         'January',
//         'February',
//         'March',
//         'April',
//         'May',
//         'June',
//         'July',
//         'August',
//         'September',
//         'October',
//         'November',
//         'December'
//     ];

//     const day = date.getDate();
//     const monthIndex = date.getMonth();
//     const year = date.getFullYear();

//     return monthNames[monthIndex] + ' ' + day + ', ' + year;
// }

module.exports = {
    createInvoice
};
