import jsPDF from "jspdf";
import * as XLSX from "xlsx";

export function exportToExcel(data: any[], fileName: string) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

export function exportToPDF(data: any[], fileName: string, title: string) {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  doc.setFontSize(11);
  doc.setTextColor(100);
  
  // Basic rendering of JSON data to PDF as strings
  // In a real application, you'd use jspdf-autotable for better formatting
  let y = 30;
  data.forEach((item, index) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    const line = Object.entries(item).map(([key, value]) => `${key}: ${value}`).join(" | ");
    doc.text(`${index + 1}. ${line}`, 14, y);
    y += 10;
  });

  doc.save(`${fileName}.pdf`);
}
