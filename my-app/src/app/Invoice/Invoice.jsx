import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const PDFGenerator = () => {
  const generatePDF = async () => {
    const pdf = new jsPDF("p", "pt", "a4"); // Specify page orientation and size

    // Capture the element that you want to convert to PDF
    const element = document.getElementById("pdf-content");

    try {
      // Generate canvas for the first page
      const canvas = await html2canvas(element, { scale: 2 }); // Increase scale for better resolution
      const imgData = canvas.toDataURL("image/png");

      const width = pdf.internal.pageSize.getWidth(); // Get page width
      const height = pdf.internal.pageSize.getHeight(); // Get page height

      const imgWidth = width - 40; // Adjusted width to leave margin on both sides
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let position = 0;

      pdf.addImage(imgData, "PNG", 20, position, imgWidth, imgHeight);

      // Add additional pages if content overflows
      let remainingHeight = height - imgHeight - 40; // 40px is for bottom margin
      let nextPage = 2; // Page counter for additional pages
      let imgDataUrl = null;

      while (canvas.height > remainingHeight) {
        pdf.addPage();
        position -= height;
        remainingHeight = height - 40; // Reset remaining height for the new page
        imgDataUrl = canvas.toDataURL("image/png", 1.0); // Capture image with original quality
        pdf.addImage(imgDataUrl, "PNG", 20, position, imgWidth, imgHeight);
        pdf.setPage(nextPage);
        nextPage++;
        canvas.height -= remainingHeight; // Adjust canvas height for the next page
      }

      pdf.save("generated-pdf.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div>
      <button onClick={generatePDF}>Generate PDF</button>
      <div id="pdf-content">
        {/* Content that you want to include in the PDF */}
        <h1>Hello, World!</h1>
        <p className="pb-8">This is a sample content for the PDF.</p>
        {/* Add more content here */}
      </div>
    </div>
  );
};

export default PDFGenerator;
