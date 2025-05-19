import { Button, Box } from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function ExportPDFButton({ containerRef, selectedCity }) {
  const handleExportPDF = () => {
    if (!containerRef.current) return;
    html2canvas(containerRef.current).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${selectedCity || 'weather'}.pdf`);
    });
  };

  return (
    <Box textAlign="center" mt={4}>
      <Button variant="contained" color="primary" onClick={handleExportPDF}>
        Export as PDF
      </Button>
    </Box>
  );
}
