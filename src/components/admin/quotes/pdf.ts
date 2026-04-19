import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { QuoteDraft, formatPHP } from "./types";

export function generateQuotePDF(quote: QuoteDraft, clientName: string) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("QUOTE", 14, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Palawan Collective", pageWidth - 14, 20, { align: "right" });
  doc.text("euro.palawancollective.com", pageWidth - 14, 26, { align: "right" });

  // Client + meta
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Client:", 14, 38);
  doc.setFont("helvetica", "normal");
  doc.text(clientName || "—", 35, 38);

  doc.setFont("helvetica", "bold");
  doc.text("Quote:", 14, 45);
  doc.setFont("helvetica", "normal");
  doc.text(quote.title, 35, 45);

  if (quote.valid_until) {
    doc.setFont("helvetica", "bold");
    doc.text("Valid Until:", 14, 52);
    doc.setFont("helvetica", "normal");
    doc.text(quote.valid_until, 40, 52);
  }

  // Items table
  autoTable(doc, {
    startY: 60,
    head: [["Item", "Description", "Qty", "Unit (₱)", "Total (₱)"]],
    body: quote.items.map((it) => [
      it.name,
      it.description || "",
      it.qty.toString(),
      it.unit_price_php.toLocaleString(),
      it.line_total_php.toLocaleString(),
    ]),
    headStyles: { fillColor: [30, 30, 30] },
    styles: { fontSize: 9 },
  });

  const finalY = (doc as any).lastAutoTable.finalY || 80;

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(`Total: ${formatPHP(quote.total_php)}`, pageWidth - 14, finalY + 12, { align: "right" });

  let y = finalY + 24;
  if (quote.notes) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Notes", 14, y);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(quote.notes, pageWidth - 28);
    doc.text(lines, 14, y + 6);
    y += 6 + lines.length * 5 + 6;
  }
  if (quote.terms) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Terms", 14, y);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(quote.terms, pageWidth - 28);
    doc.text(lines, 14, y + 6);
  }

  doc.save(`quote-${quote.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.pdf`);
}
