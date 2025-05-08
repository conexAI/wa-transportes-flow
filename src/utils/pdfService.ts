
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TrackingDetail } from '@/types/tracking';

// Ensure we have the correct typings for jspdf-autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export interface ReportOptions {
  startDate: Date;
  endDate: Date;
  includeCompleted?: boolean;
  includeInProgress?: boolean;
  includePending?: boolean;
  emailTo?: string[];
}

export const generateTrackingReport = async (
  trackings: TrackingDetail[], 
  options: ReportOptions
): Promise<Blob> => {
  // Filter trackings by date range and status if specified
  const filteredTrackings = trackings.filter(tracking => {
    const trackingDate = new Date(tracking.createdAt);
    const isInDateRange = trackingDate >= options.startDate && trackingDate <= options.endDate;
    
    if (!isInDateRange) return false;
    
    // Filter by status if specified
    if (options.includeCompleted && tracking.status === 'Entregue') return true;
    if (options.includeInProgress && tracking.status === 'Em trânsito') return true;
    if (options.includePending && tracking.status === 'Aguardando coleta') return true;
    
    // If no status filters are specified, include all
    return !options.includeCompleted && !options.includeInProgress && !options.includePending;
  });
  
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add company header
  doc.setFontSize(20);
  doc.text('WA Transportes', 14, 22);
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text('Relatório de Rastreamento', 14, 30);
  
  // Add date range
  doc.setFontSize(10);
  const formattedStartDate = format(options.startDate, 'dd/MM/yyyy', { locale: ptBR });
  const formattedEndDate = format(options.endDate, 'dd/MM/yyyy', { locale: ptBR });
  doc.text(`Período: ${formattedStartDate} a ${formattedEndDate}`, 14, 38);
  
  // Add table with tracking data
  const tableColumn = ["CT-e", "Data de Emissão", "Status", "Última Atualização"];
  const tableRows = filteredTrackings.map(tracking => [
    tracking.cteNumber,
    format(new Date(tracking.createdAt), 'dd/MM/yyyy', { locale: ptBR }),
    tracking.status,
    format(new Date(tracking.lastUpdated), 'dd/MM/yyyy HH:mm', { locale: ptBR })
  ]);
  
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 45,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [0, 75, 145],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
  });
  
  // Add footer with generation timestamp
  const pageCount = doc.getNumberOfPages();
  doc.setFontSize(8);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Footer with page number
    doc.text(
      `Gerado em ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })} - Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Convert the PDF to a blob
  const pdfBlob = doc.output('blob');
  return pdfBlob;
};

export const sendReportByEmail = async (
  pdfBlob: Blob,
  emails: string[],
  subject: string = 'Relatório de Rastreamento - WA Transportes'
): Promise<boolean> => {
  // In a real application, you would use an API to send the email
  // Here we'll simulate the email being sent
  
  // Convert blob to base64 for API consumption
  return new Promise<boolean>((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(pdfBlob);
    reader.onloadend = () => {
      // Simulating API call with timeout
      setTimeout(() => {
        console.log(`Email would be sent to: ${emails.join(', ')}`);
        console.log(`Subject: ${subject}`);
        console.log('PDF attachment included');
        
        // Simulate success (always returns true for this demo)
        resolve(true);
      }, 1500);
    };
  });
};

export const downloadPdf = (pdf: Blob, filename: string = 'relatorio.pdf') => {
  const url = URL.createObjectURL(pdf);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
