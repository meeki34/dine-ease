/**
 * Utility to convert an array of objects to a CSV string and trigger a download.
 * @param {Array<Object>} data - The data to export.
 * @param {string} filename - The name of the file (without extension).
 */
export const downloadCSV = (data, filename) => {
  if (!data || !data.length) {
    console.error('No data provided for CSV export');
    return;
  }

  // extract headers
  const headers = Object.keys(data[0]);

  // convert data to rows
  const csvRows = [
    headers.join(','), // join headers
    ...data.map(row => 
      headers.map(header => {
        let val = row[header];
        
        // handle nested objects/arrays
        if (typeof val === 'object' && val !== null) {
          val = JSON.stringify(val);
        }
        
        // handle special characters for CSV
        const strVal = String(val === undefined || val === null ? '' : val);
        const escaped = strVal.replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(',')
    )
  ];

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export billing history as CSV
 * @param {Array} bills - Array of bill objects
 */
export const downloadBillsCSV = (bills) => {
  if (!bills || !bills.length) return;

  const rows = bills.map(b => ({
    'Bill #': b.id,
    'Table': b.table_number,
    'Subtotal': Number(b.subtotal || 0).toFixed(2),
    'Tax Rate': `${b.tax_rate || 0}%`,
    'Tax Amount': Number(b.tax_amount || 0).toFixed(2),
    'Tip': Number(b.tip_amount || 0).toFixed(2),
    'Discount': Number(b.discount_amount || 0).toFixed(2),
    'Total': Number(b.total || 0).toFixed(2),
    'Payment Method': b.payment_method || '-',
    'Status': b.payment_status || '-',
    'Date': new Date(b.createdAt).toLocaleDateString(),
    'Time': new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }));

  downloadCSV(rows, 'Billing_Report');
};

/**
 * Open a printable PDF-style view in a new window.
 * @param {string} title - The report title
 * @param {string} htmlContent - The inner HTML content to render
 */
export const downloadPDF = (title, htmlContent) => {
  const win = window.open('', '_blank', 'width=900,height=700');
  if (!win) return;

  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title} — DINE-EASE</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Inter', sans-serif;
          padding: 40px;
          color: #1a1a1a;
          background: white;
          font-size: 13px;
          line-height: 1.5;
        }
        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f48c25;
        }
        .report-brand { font-size: 24px; font-weight: 800; color: #f48c25; }
        .report-title { font-size: 20px; font-weight: 700; color: #333; margin-top: 4px; }
        .report-meta { text-align: right; color: #888; font-size: 12px; }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 16px;
        }
        th {
          background: #f48c25;
          color: white;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.5px;
          padding: 10px 12px;
          text-align: left;
        }
        td {
          padding: 10px 12px;
          border-bottom: 1px solid #eee;
        }
        tr:nth-child(even) { background: #fafafa; }
        tr:hover { background: #fff5e6; }
        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        .summary-card {
          background: #f8f8f8;
          border: 1px solid #eee;
          border-radius: 12px;
          padding: 16px;
        }
        .summary-card-label { font-size: 11px; color: #888; text-transform: uppercase; font-weight: 700; }
        .summary-card-value { font-size: 22px; font-weight: 800; color: #1a1a1a; margin-top: 4px; }
        .report-footer {
          margin-top: 40px;
          padding-top: 16px;
          border-top: 1px solid #eee;
          text-align: center;
          color: #aaa;
          font-size: 11px;
        }
        @media print {
          body { padding: 20px; }
          .no-print { display: none !important; }
        }
        .print-btn {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #f48c25;
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(244,140,37,0.3);
        }
        .print-btn:hover { background: #e07d1a; }
      </style>
    </head>
    <body>
      <button class="print-btn no-print" onclick="window.print()">🖨️ Print / Save PDF</button>
      <div class="report-header">
        <div>
          <div class="report-brand">DINE-EASE</div>
          <div class="report-title">${title}</div>
        </div>
        <div class="report-meta">
          Generated: ${new Date().toLocaleDateString()}<br/>
          ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      ${htmlContent}
      <div class="report-footer">
        Report generated by DINE-EASE Restaurant Management Platform
      </div>
    </body>
    </html>
  `);
  win.document.close();
};

/**
 * Generate a printable billing report
 * @param {Array} bills - Array of bill objects
 * @param {Object} stats - Summary stats
 */
export const downloadBillsPDF = (bills, stats = {}) => {
  if (!bills || !bills.length) return;

  const summaryHTML = `
    <div class="summary-cards">
      <div class="summary-card">
        <div class="summary-card-label">Total Bills</div>
        <div class="summary-card-value">${bills.length}</div>
      </div>
      <div class="summary-card">
        <div class="summary-card-label">Revenue Collected</div>
        <div class="summary-card-value">₹${bills.filter(b => b.payment_status === 'paid').reduce((s, b) => s + Number(b.total || 0), 0).toFixed(2)}</div>
      </div>
      <div class="summary-card">
        <div class="summary-card-label">Paid Bills</div>
        <div class="summary-card-value">${bills.filter(b => b.payment_status === 'paid').length}</div>
      </div>
      <div class="summary-card">
        <div class="summary-card-label">Unpaid Bills</div>
        <div class="summary-card-value">${bills.filter(b => b.payment_status === 'pending').length}</div>
      </div>
    </div>
  `;

  const tableHTML = `
    <table>
      <thead>
        <tr>
          <th>Bill #</th>
          <th>Table</th>
          <th>Date</th>
          <th>Subtotal</th>
          <th>Tax</th>
          <th>Total</th>
          <th>Method</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${bills.map(b => `
          <tr>
            <td>#${b.id}</td>
            <td>Table ${b.table_number}</td>
            <td>${new Date(b.createdAt).toLocaleDateString()} ${new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
            <td>₹${Number(b.subtotal || 0).toFixed(2)}</td>
            <td>${b.tax_rate || 0}%</td>
            <td style="font-weight:700">₹${Number(b.total || 0).toFixed(2)}</td>
            <td>${b.payment_method || '—'}</td>
            <td style="color:${b.payment_status === 'paid' ? '#2ed573' : '#e74c3c'};font-weight:700">${b.payment_status}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  downloadPDF('Billing Report', summaryHTML + tableHTML);
};

/**
 * Generate a printable analytics report
 * @param {Object} data - Analytics data (totals, byDay, topItems)
 * @param {number} days - Time range
 */
export const downloadAnalyticsPDF = (data, days) => {
  if (!data) return;

  const { totals = {}, byDay = [], topItems = [] } = data;
  const fmtMoney = (v) => `₹${Number(v || 0).toFixed(2)}`;

  const summaryHTML = `
    <div class="summary-cards">
      <div class="summary-card">
        <div class="summary-card-label">Total Revenue</div>
        <div class="summary-card-value">${fmtMoney(totals.revenue)}</div>
      </div>
      <div class="summary-card">
        <div class="summary-card-label">COGS</div>
        <div class="summary-card-value">${fmtMoney(totals.cogs)}</div>
      </div>
      <div class="summary-card">
        <div class="summary-card-label">Labor Cost</div>
        <div class="summary-card-value">${fmtMoney(totals.labor)}</div>
      </div>
      <div class="summary-card">
        <div class="summary-card-label">Net Profit</div>
        <div class="summary-card-value" style="color:${totals.profit >= 0 ? '#2ed573' : '#e74c3c'}">${fmtMoney(totals.profit)}</div>
      </div>
    </div>
  `;

  let revenueTableHTML = '';
  if (byDay.length) {
    revenueTableHTML = `
      <h3 style="margin: 24px 0 8px; font-size: 16px;">Daily Revenue (${days}D)</h3>
      <table>
        <thead><tr><th>Date</th><th>Revenue</th><th>Orders</th><th>COGS</th></tr></thead>
        <tbody>
          ${byDay.map(d => `
            <tr>
              <td>${new Date(d.date).toLocaleDateString()}</td>
              <td style="font-weight:700">${fmtMoney(d.revenue)}</td>
              <td>${d.orders || 0}</td>
              <td>${fmtMoney(d.cogs)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  let topItemsHTML = '';
  if (topItems.length) {
    topItemsHTML = `
      <h3 style="margin: 24px 0 8px; font-size: 16px;">Top Selling Items</h3>
      <table>
        <thead><tr><th>#</th><th>Item Name</th><th>Quantity Sold</th></tr></thead>
        <tbody>
          ${topItems.map((item, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>${item.name}</td>
              <td style="font-weight:700">${item.count}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  downloadPDF(`Analytics Report — Last ${days} Days`, summaryHTML + revenueTableHTML + topItemsHTML);
};
