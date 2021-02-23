const PDFDocument = require("pdfkit");
const fs = require("fs");
const request = require("request");

var download = function (uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
  });
};

exports.compareIds = function (id1, id2) {
  if (!id1 || !id2) return false;
  return id1.toString() === id2.toString();
};

exports.createPDFDoc = function (values, description) {
  const imgPath = `${__dirname}/../uploads/logo.png`;
  const pdfPath = `${__dirname}/../uploads/orginvite.pdf`;
  const link = `https://www.collaborate.app/${encodeURIComponent(
    values.sender_organization
  )}/email-invite?project=${encodeURIComponent(values.project_name)}`;

  download(values.logo, imgPath, function () {
    var pdfDoc = new PDFDocument();
    pdfDoc.pipe(fs.createWriteStream(pdfPath));
    pdfDoc.image(imgPath, { width: 150 });
    pdfDoc.moveDown(1.5);
    pdfDoc.fontSize(15).text(`Dear ${values.first_name} ${values.last_name}`);
    pdfDoc.moveDown(1);
    pdfDoc.text(
      `You have been invited by ${values.sender_name} from ${values.sender_organization} to join the ${values.project_name} project!  Below is more information about the project:`
    );
    pdfDoc.moveDown(1);
    pdfDoc
      .fontSize(13)
      .text(description, 100);
    pdfDoc.moveDown(1.5);
    pdfDoc
      .fontSize(15)
      .text(
        "This invitation is also the first time you have seen a blockchain authenticated smart document.  To see the power of the automation of authenticated documents go to the link below:", 72
      );
    pdfDoc.moveDown(1);
    pdfDoc.fillColor("blue").text(link, {
      link,
      underline: true,
    });
    pdfDoc.moveDown(1);
    pdfDoc
      .fillColor("black")
      .text(
        "Once you click on the link, click “Begin” and drag and drop this document onto the area that reads “Did you receive an invitation?”.  What happens next is the power of blockchain authenticated smart documents.  Once the hash of the document has been checked to make sure it is authentic, the data contained within the document is extracted and mapped to the form on the site.  There is no database, just the document."
      );
    pdfDoc.moveDown(0.5);
    pdfDoc.text("Excited to have you onboard!");
    pdfDoc.moveDown(0.5);
    pdfDoc.text("Thanks,");
    pdfDoc.moveDown(1);
    pdfDoc.text(values.sender_name);
    pdfDoc.moveDown(0.5);
    pdfDoc.text(values.sender_organization);
    pdfDoc.end();
  });
};
