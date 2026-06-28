import { useEffect, useRef, useMemo, useState } from 'react';
import { prepareWithSegments, layoutWithLines } from '@chenglou/pretext';
import '../styles/PretextReceipt.css';

const RECEIPT_WIDTH = 320;
const PADDING = 20;
const CONTENT_WIDTH = RECEIPT_WIDTH - PADDING * 2;
const MONO_FONT = '12px "Courier New", monospace';
const TITLE_FONT = 'bold 18px "Courier New", monospace';
const TOTAL_FONT = 'bold 14px "Courier New", monospace';
const SMALL_FONT = '10px "Courier New", monospace';

const PretextReceipt = ({ billData, onClose }) => {
  const canvasRef = useRef(null);
  const [canvasHeight, setCanvasHeight] = useState(500);

  // Precompute all text layouts
  const receiptLayout = useMemo(() => {
    if (!billData) return null;

    const sections = [];
    let y = PADDING;

    // Restaurant name
    const titlePrepared = prepareWithSegments(billData.restaurant?.name || 'Restaurant', TITLE_FONT);
    const titleLayout = layoutWithLines(titlePrepared, CONTENT_WIDTH, 24);
    sections.push({ type: 'title', lines: titleLayout.lines, y, lineHeight: 24, align: 'center' });
    y += titleLayout.height + 4;

    // Address & phone
    if (billData.restaurant?.address) {
      const addrPrepared = prepareWithSegments(billData.restaurant.address, SMALL_FONT);
      const addrLayout = layoutWithLines(addrPrepared, CONTENT_WIDTH, 14);
      sections.push({ type: 'small', lines: addrLayout.lines, y, lineHeight: 14, align: 'center' });
      y += addrLayout.height + 2;
    }
    if (billData.restaurant?.phone) {
      sections.push({ type: 'small', lines: [{ text: billData.restaurant.phone }], y, lineHeight: 14, align: 'center' });
      y += 16;
    }

    // Dashed divider
    sections.push({ type: 'divider', y });
    y += 12;

    // Bill info row
    sections.push({
      type: 'row',
      left: `Bill #${billData.bill_number}`,
      right: `Table ${billData.table_number}`,
      y,
      font: MONO_FONT,
    });
    y += 16;

    // Date row
    const date = new Date(billData.date);
    sections.push({
      type: 'row',
      left: date.toLocaleDateString(),
      right: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      y,
      font: MONO_FONT,
    });
    y += 16;

    sections.push({ type: 'divider', y });
    y += 12;

    // Items
    const currencySymbol = billData.currency === 'INR' ? '₹' : billData.currency === 'USD' ? '$' : billData.currency === 'EUR' ? '€' : billData.currency === 'GBP' ? '£' : (billData.currency || '₹');
    const fmtMoney = (v) => `${currencySymbol}${Number(v).toFixed(2)}`;

    for (const item of (billData.items || [])) {
      const itemText = `${item.quantity}x ${item.name}`;
      const priceText = fmtMoney(item.line_total);

      // Measure item name in available space
      const priceWidth = 80;
      try {
        const itemPrepared = prepareWithSegments(itemText, MONO_FONT);
        const itemLayout = layoutWithLines(itemPrepared, CONTENT_WIDTH - priceWidth, 16);

        sections.push({
          type: 'item',
          lines: itemLayout.lines,
          price: priceText,
          y,
          lineHeight: 16,
        });
        y += Math.max(itemLayout.height, 16) + 4;
      } catch {
        sections.push({
          type: 'item',
          lines: [{ text: itemText }],
          price: priceText,
          y,
          lineHeight: 16,
        });
        y += 20;
      }
    }

    sections.push({ type: 'divider', y });
    y += 12;

    // Subtotal
    sections.push({ type: 'row', left: 'Subtotal', right: fmtMoney(billData.subtotal), y, font: MONO_FONT });
    y += 18;

    // Tax
    if (billData.tax_rate > 0) {
      sections.push({ type: 'row', left: `Tax (${billData.tax_rate}%)`, right: fmtMoney(billData.tax_amount), y, font: MONO_FONT });
      y += 18;
    }

    // Discount
    if (billData.discount_amount > 0) {
      sections.push({ type: 'row', left: 'Discount', right: `-${fmtMoney(billData.discount_amount)}`, y, font: MONO_FONT });
      y += 18;
    }

    // Tip
    if (billData.tip_amount > 0) {
      sections.push({ type: 'row', left: 'Tip', right: fmtMoney(billData.tip_amount), y, font: MONO_FONT });
      y += 18;
    }

    sections.push({ type: 'divider', y });
    y += 12;

    // Total
    sections.push({ type: 'row', left: 'TOTAL', right: fmtMoney(billData.total), y, font: TOTAL_FONT, bold: true });
    y += 24;

    // Paid stamp
    if (billData.payment_status === 'paid') {
      sections.push({
        type: 'paid_stamp',
        method: billData.payment_method?.toUpperCase() || 'PAID',
        y,
      });
      y += 40;
    }

    sections.push({ type: 'divider', y });
    y += 12;

    // Footer
    sections.push({ type: 'small', lines: [{ text: 'Thank you for dining with us!' }], y, lineHeight: 14, align: 'center' });
    y += 16;
    sections.push({ type: 'small', lines: [{ text: 'Powered by DINE-EASE' }], y, lineHeight: 14, align: 'center' });
    y += 30;

    return { sections, totalHeight: y };
  }, [billData]);

  // Render to canvas
  useEffect(() => {
    if (!receiptLayout || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    const height = receiptLayout.totalHeight;

    canvas.width = RECEIPT_WIDTH * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${RECEIPT_WIDTH}px`;
    canvas.style.height = `${height}px`;
    setCanvasHeight(height);

    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, RECEIPT_WIDTH, height);

    // Draw each section
    for (const section of receiptLayout.sections) {
      switch (section.type) {
        case 'title': {
          ctx.font = TITLE_FONT;
          ctx.fillStyle = '#111';
          for (let i = 0; i < section.lines.length; i++) {
            const text = section.lines[i].text;
            const tw = ctx.measureText(text).width;
            const x = section.align === 'center' ? (RECEIPT_WIDTH - tw) / 2 : PADDING;
            ctx.fillText(text, x, section.y + (i + 1) * section.lineHeight);
          }
          break;
        }
        case 'small': {
          ctx.font = SMALL_FONT;
          ctx.fillStyle = '#666';
          for (let i = 0; i < section.lines.length; i++) {
            const text = section.lines[i].text;
            const tw = ctx.measureText(text).width;
            const x = section.align === 'center' ? (RECEIPT_WIDTH - tw) / 2 : PADDING;
            ctx.fillText(text, x, section.y + (i + 1) * section.lineHeight);
          }
          break;
        }
        case 'divider': {
          ctx.save();
          ctx.setLineDash([4, 3]);
          ctx.strokeStyle = '#999';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(PADDING, section.y + 4);
          ctx.lineTo(RECEIPT_WIDTH - PADDING, section.y + 4);
          ctx.stroke();
          ctx.restore();
          break;
        }
        case 'row': {
          ctx.font = section.font || MONO_FONT;
          ctx.fillStyle = section.bold ? '#000' : '#333';
          ctx.fillText(section.left, PADDING, section.y + 12);
          const rw = ctx.measureText(section.right).width;
          ctx.fillText(section.right, RECEIPT_WIDTH - PADDING - rw, section.y + 12);
          break;
        }
        case 'item': {
          ctx.font = MONO_FONT;
          ctx.fillStyle = '#333';
          for (let i = 0; i < section.lines.length; i++) {
            ctx.fillText(section.lines[i].text, PADDING, section.y + (i + 1) * section.lineHeight);
          }
          // Price right-aligned
          const priceW = ctx.measureText(section.price).width;
          ctx.fillText(section.price, RECEIPT_WIDTH - PADDING - priceW, section.y + section.lineHeight);
          break;
        }
        case 'paid_stamp': {
          ctx.save();
          const stampText = `✓ PAID — ${section.method}`;
          ctx.font = 'bold 13px "Courier New", monospace';
          const stampW = ctx.measureText(stampText).width;
          const stampX = (RECEIPT_WIDTH - stampW) / 2 - 12;
          const stampY = section.y + 4;

          // Green badge background
          ctx.fillStyle = '#2ed573';
          const badgeW = stampW + 24;
          const badgeH = 26;
          const r = 6;
          ctx.beginPath();
          ctx.moveTo(stampX + r, stampY);
          ctx.lineTo(stampX + badgeW - r, stampY);
          ctx.quadraticCurveTo(stampX + badgeW, stampY, stampX + badgeW, stampY + r);
          ctx.lineTo(stampX + badgeW, stampY + badgeH - r);
          ctx.quadraticCurveTo(stampX + badgeW, stampY + badgeH, stampX + badgeW - r, stampY + badgeH);
          ctx.lineTo(stampX + r, stampY + badgeH);
          ctx.quadraticCurveTo(stampX, stampY + badgeH, stampX, stampY + badgeH - r);
          ctx.lineTo(stampX, stampY + r);
          ctx.quadraticCurveTo(stampX, stampY, stampX + r, stampY);
          ctx.fill();

          // White text
          ctx.fillStyle = '#fff';
          ctx.fillText(stampText, stampX + 12, stampY + 18);
          ctx.restore();
          break;
        }
      }
    }
  }, [receiptLayout]);

  const handlePrint = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const win = window.open('', '_blank', 'width=380,height=650');
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt #${billData?.bill_number || ''}</title>
        <style>
          * { margin: 0; padding: 0; }
          body { display: flex; justify-content: center; padding: 10px; }
          img { max-width: 100%; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <img src="${dataUrl}" />
      </body>
      </html>
    `);
    win.document.close();
    setTimeout(() => win.print(), 300);
  };

  if (!billData) return null;

  return (
    <div className="pretext-receipt-overlay" onClick={onClose}>
      <div className="pretext-receipt-modal" onClick={e => e.stopPropagation()}>
        <div className="pretext-receipt-header">
          <h3>Receipt Preview</h3>
          <button className="pretext-receipt-close" onClick={onClose}>✕</button>
        </div>
        <div className="pretext-receipt-canvas-wrap">
          <canvas ref={canvasRef} className="pretext-receipt-canvas" />
        </div>
        <div className="pretext-receipt-actions">
          <button className="pretext-receipt-print-btn" onClick={handlePrint}>
            🖨️ Print Receipt
          </button>
          <button className="pretext-receipt-close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PretextReceipt;
