import jsPDF from 'jspdf';

// ── CSV helpers ──────────────────────────────────────────────────────────────

function escapeCsv(val) {
  if (val === null || val === undefined) return '';
  const str = String(val).replace(/"/g, '""');
  return /[",\n]/.test(str) ? `"${str}"` : str;
}

function buildCsv(headers, rows) {
  const lines = [headers.join(',')];
  rows.forEach(row => lines.push(row.map(escapeCsv).join(',')));
  return lines.join('\n');
}

function downloadFile(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Content Calendar exports ─────────────────────────────────────────────────

export function exportCalendarCsv(calendar, industry = 'brand') {
  const headers = ['Day', 'Platform', 'Topic', 'Caption', 'Hashtags', 'CTA', 'Media Suggestion', 'Best Time'];
  const rows = calendar.map(i => [
    i.day, i.platform, i.topic, i.caption, i.hashtags, i.cta, i.media_suggestion, i.best_time,
  ]);
  downloadFile(buildCsv(headers, rows), `content-calendar-${industry}.csv`, 'text/csv');
}

export function exportCalendarPdf(calendar, industry = 'brand') {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 40;
  let y = margin;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Content Calendar', margin, y);
  y += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120);
  doc.text(`Industry: ${industry}`, margin, y + 14);
  y += 36;
  doc.setTextColor(0);

  const cols = ['Day', 'Platform', 'Topic', 'Caption', 'Hashtags', 'Best Time'];
  const colWidths = [35, 65, 110, 220, 120, 70];
  const rowH = 22;

  // Header row
  doc.setFillColor(79, 70, 229);
  doc.setTextColor(255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  let x = margin;
  cols.forEach((col, ci) => {
    doc.rect(x, y, colWidths[ci], rowH, 'F');
    doc.text(col, x + 5, y + 14);
    x += colWidths[ci];
  });
  y += rowH;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  calendar.forEach((item, idx) => {
    if (y + rowH > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
    }
    const fill = idx % 2 === 0 ? [248, 248, 252] : [255, 255, 255];
    doc.setFillColor(...fill);
    doc.setTextColor(30);
    x = margin;
    const values = [item.day, item.platform, item.topic, item.caption, item.hashtags, item.best_time];
    values.forEach((val, ci) => {
      doc.rect(x, y, colWidths[ci], rowH, 'F');
      const text = doc.splitTextToSize(String(val || ''), colWidths[ci] - 8);
      doc.text(text[0] || '', x + 5, y + 14);
      x += colWidths[ci];
    });
    y += rowH;
  });

  doc.save(`content-calendar-${industry}.pdf`);
}

// ── Networking Opportunities exports ─────────────────────────────────────────

export function exportNetworkingCsv(opportunities, industry = 'brand') {
  const headers = ['Type', 'Name', 'Description', 'URL'];
  const rows = opportunities.map(n => [n.type, n.name, n.description, n.url]);
  downloadFile(buildCsv(headers, rows), `networking-opportunities-${industry}.csv`, 'text/csv');
}

export function exportNetworkingPdf(opportunities, industry = 'brand') {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 40;
  const contentW = pageW - margin * 2;
  let y = margin;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Networking Opportunities', margin, y);
  y += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120);
  doc.text(`Industry: ${industry}`, margin, y + 14);
  y += 40;
  doc.setTextColor(0);

  opportunities.forEach((n, idx) => {
    if (y + 80 > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
    }
    // Card background
    const fill = idx % 2 === 0 ? [245, 243, 255] : [249, 249, 255];
    doc.setFillColor(...fill);
    doc.roundedRect(margin, y, contentW, 72, 6, 6, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30);
    doc.text(n.name || '', margin + 12, y + 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`[${n.type || ''}]`, margin + 12, y + 34);

    doc.setTextColor(60);
    doc.setFontSize(9);
    const desc = doc.splitTextToSize(n.description || '', contentW - 24);
    doc.text(desc[0] || '', margin + 12, y + 48);

    if (n.url) {
      doc.setTextColor(79, 70, 229);
      doc.text(n.url, margin + 12, y + 62);
    }

    y += 82;
  });

  doc.save(`networking-opportunities-${industry}.pdf`);
}