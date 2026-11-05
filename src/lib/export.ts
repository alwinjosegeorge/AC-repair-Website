import {
  Booking,
  formatDisplayDate,
  formatDateTime,
  EGSInvoice,
  EGS_COMPANY_DETAILS,
  generateTaxInvoiceWhatsAppURL,
} from "./store";

/**
 * Exports an array of bookings to CSV (compatible with Excel via UTF-8 BOM)
 */
export function exportBookingsToCSV(
  bookings: Booking[],
  filenamePrefix = "EGS-Bookings-Report"
) {
  if (typeof window === "undefined" || !bookings) return;

  const headers = [
    "Booking ID",
    "Booked On (Website Date)",
    "Booked At (Website Time)",
    "Status",
    "Customer Name",
    "Phone Number",
    "WhatsApp",
    "Email",
    "City",
    "Area",
    "Full Address",
    "Pincode",
    "Service Category",
    "Service Name",
    "AC Type",
    "AC Brand",
    "Unit Count",
    "Scheduled Date",
    "Scheduled Slot",
    "Issue / Description",
    "Estimated Amount (INR)",
    "Assigned Technician",
    "Traffic Source",
    "UTM Campaign",
  ];

  const escapeCSV = (val: unknown): string => {
    if (val === null || val === undefined) return '""';
    const clean = String(val).replace(/"/g, '""');
    return `"${clean}"`;
  };

  const rows = bookings.map((b) => [
    escapeCSV(b.id),
    escapeCSV(formatDateTime(b.createdAt).date),
    escapeCSV(formatDateTime(b.createdAt).time),
    escapeCSV(b.status),
    escapeCSV(b.customerName),
    escapeCSV(b.phone),
    escapeCSV(b.whatsappNumber || b.phone),
    escapeCSV(b.email || ""),
    escapeCSV(b.city),
    escapeCSV(b.area || ""),
    escapeCSV(b.address || ""),
    escapeCSV(b.pincode || ""),
    escapeCSV(b.serviceCategory || ""),
    escapeCSV(b.serviceName || ""),
    escapeCSV(b.acType || ""),
    escapeCSV(b.acBrand || ""),
    escapeCSV(b.unitCount || 1),
    escapeCSV(formatDisplayDate(b.preferredDate, b.createdAt)),
    escapeCSV(b.preferredSlot || "Morning Slot"),
    escapeCSV(b.issueDescription || ""),
    escapeCSV(b.estimatedAmount || 0),
    escapeCSV(b.assignedTechnicianName || "Unassigned"),
    escapeCSV(b.attribution?.utm_source || "direct"),
    escapeCSV(b.attribution?.utm_campaign || "none"),
  ]);

  // UTF-8 BOM so Excel opens Malayalam / Indian English text with proper encoding
  const csvContent =
    "\uFEFF" +
    [headers.map((h) => `"${h}"`).join(","), ...rows.map((r) => r.join(","))].join(
      "\r\n"
    );

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateStr = new Date().toISOString().split("T")[0];
  link.setAttribute("href", url);
  link.setAttribute("download", `${filenamePrefix}-${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Opens a print-ready formatted report in a new tab and triggers window.print()
 * so the user can save as PDF with 1 click.
 */
export function exportBookingsToPDF(
  bookings: Booking[],
  title = "EGS INDIA — All Bookings & Enquiries Master Report"
) {
  if (typeof window === "undefined" || !bookings) return;

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to download or print the PDF report.");
    return;
  }

  const dateStr = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const totalAmount = bookings.reduce(
    (sum, b) => sum + (b.estimatedAmount || 0),
    0
  );

  const statusColorMap: Record<string, string> = {
    NEW: "#2563eb",
    CONTACTED: "#4f46e5",
    CONFIRMED: "#0891b2",
    ASSIGNED: "#7c3aed",
    "TECHNICIAN ON THE WAY": "#d97706",
    "SERVICE STARTED": "#ea580c",
    COMPLETED: "#059669",
    "PAYMENT RECEIVED": "#15803d",
    CANCELLED: "#dc2626",
  };

  const rowsHtml = bookings
    .map(
      (b, idx) => `
    <tr style="background-color: ${idx % 2 === 0 ? "#ffffff" : "#f8fafc"};">
      <td style="padding: 7px 8px; font-weight: 700; font-family: monospace; color: #0284c7; font-size: 11px;">
        ${b.id}
      </td>
      <td style="padding: 7px 8px; font-size: 10px;">
        <div style="font-weight: 700; color: #0f172a;">${formatDateTime(b.createdAt).date}</div>
        <div style="font-size: 9.5px; color: #64748b;">🕒 ${formatDateTime(b.createdAt).time}</div>
      </td>
      <td style="padding: 7px 8px;">
        <div style="font-weight: 700; color: #0f172a;">${b.customerName}</div>
        <div style="font-size: 10px; color: #64748b;">${b.phone}</div>
      </td>
      <td style="padding: 7px 8px;">
        <div style="font-weight: 600; color: #1e293b;">${b.serviceName}</div>
        <div style="font-size: 10px; color: #64748b;">${b.acType} (${b.unitCount} Unit${Number(b.unitCount) > 1 ? "s" : ""})</div>
      </td>
      <td style="padding: 7px 8px; font-size: 11px;">
        <div style="font-weight: 700; color: #0f172a;">${formatDisplayDate(b.preferredDate, b.createdAt)}</div>
        <div style="font-size: 10px; color: #64748b;">${b.preferredSlot || "Morning Slot"}</div>
      </td>
      <td style="padding: 7px 8px; font-size: 11px;">
        <div style="font-weight: 600; color: #0f172a;">${b.city}</div>
        <div style="font-size: 10px; color: #64748b; max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
          ${b.area || b.address || ""}
        </div>
      </td>
      <td style="padding: 7px 8px;">
        <span style="display: inline-block; padding: 2px 7px; border-radius: 9999px; font-size: 9px; font-weight: 800; background-color: ${
          statusColorMap[b.status] ? statusColorMap[b.status] + "18" : "#f1f5f9"
        }; color: ${statusColorMap[b.status] || "#334155"}; border: 1px solid ${
        statusColorMap[b.status] ? statusColorMap[b.status] + "35" : "#cbd5e1"
      };">
          ${b.status}
        </span>
      </td>
      <td style="padding: 7px 8px; font-weight: 800; text-align: right; color: #0f172a;">
        ${b.estimatedAmount > 0 ? "₹" + b.estimatedAmount.toLocaleString("en-IN") : "Quote"}
      </td>
    </tr>
  `
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>${title}</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          @page {
            size: A4 landscape;
            margin: 10mm;
          }
          * { box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: #0f172a;
            margin: 0;
            padding: 16px;
            font-size: 11px;
            line-height: 1.4;
            background: #fff;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #0284c7;
            padding-bottom: 10px;
            margin-bottom: 14px;
          }
          .brand-title {
            margin: 0;
            font-size: 18px;
            font-weight: 900;
            color: #0284c7;
            letter-spacing: -0.3px;
          }
          .brand-subtitle {
            margin: 2px 0 0;
            font-size: 11px;
            color: #64748b;
            font-weight: 600;
          }
          .report-meta {
            text-align: right;
            font-size: 10px;
            color: #475569;
          }
          .kpi-row {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 14px;
          }
          .kpi-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 8px 10px;
          }
          .kpi-label {
            font-size: 9px;
            font-weight: 800;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .kpi-num {
            font-size: 16px;
            font-weight: 900;
            color: #0f172a;
            margin-top: 2px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
          }
          th {
            background-color: #0f172a;
            color: #ffffff;
            font-weight: 800;
            text-align: left;
            padding: 7px 8px;
            font-size: 9.5px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          th.right { text-align: right; }
          td { border-bottom: 1px solid #e2e8f0; }
          .footer-note {
            margin-top: 14px;
            border-top: 1px solid #e2e8f0;
            padding-top: 8px;
            font-size: 9px;
            color: #94a3b8;
            display: flex;
            justify-content: space-between;
          }
          .no-print {
            margin-bottom: 12px;
            display: flex;
            gap: 8px;
          }
          .btn {
            background: #0284c7;
            color: #fff;
            border: none;
            padding: 7px 14px;
            border-radius: 6px;
            font-weight: 700;
            font-size: 11px;
            cursor: pointer;
          }
          .btn-secondary {
            background: #f1f5f9;
            color: #334155;
            border: 1px solid #cbd5e1;
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        <div class="no-print">
          <button class="btn" onclick="window.print()">
            🖨️ Print / Save as PDF
          </button>
          <button class="btn btn-secondary" onclick="window.close()">
            Close
          </button>
        </div>

        <div class="header">
          <div>
            <h1 class="brand-title">❄️ EGS INDIA — HVAC OPERATIONS</h1>
            <p class="brand-subtitle">Master Bookings & Customer Enquiries Ledger</p>
          </div>
          <div class="report-meta">
            <div><strong>Generated:</strong> ${dateStr}</div>
            <div><strong>Total Entries:</strong> ${bookings.length} Bookings</div>
            <div><strong>Helpline:</strong> +91 98956 88833</div>
          </div>
        </div>

        <div class="kpi-row">
          <div class="kpi-box">
            <div class="kpi-label">Total Enquiries &amp; Bookings</div>
            <div class="kpi-num">${bookings.length}</div>
          </div>
          <div class="kpi-box">
            <div class="kpi-label">Total Revenue Value</div>
            <div class="kpi-num">₹${totalAmount.toLocaleString("en-IN")}</div>
          </div>
          <div class="kpi-box">
            <div class="kpi-label">Completed / Paid</div>
            <div class="kpi-num">
              ${bookings.filter((b) => b.status === "COMPLETED" || b.status === "PAYMENT RECEIVED").length}
            </div>
          </div>
          <div class="kpi-box">
            <div class="kpi-label">New &amp; Active Queue</div>
            <div class="kpi-num">
              ${bookings.filter((b) => b.status === "NEW" || b.status === "CONTACTED" || b.status === "CONFIRMED").length}
            </div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Booked At (Web)</th>
              <th>Customer</th>
              <th>Service &amp; AC</th>
              <th>Scheduled Date &amp; Time</th>
              <th>City &amp; Area</th>
              <th>Status</th>
              <th class="right">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <div class="footer-note">
          <div>EGS INDIA — Expert HVAC &amp; Air Conditioner Solutions • www.egsindia.in</div>
          <div>Confidential Internal Record • Generated for Operations &amp; Dispatch</div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 350);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * Opens an isolated print-ready GST Tax Invoice & 30-Day Warranty Certificate
 * in a new tab and triggers window.print(). Ensures 0% page bleeding, flawless A4 layout.
 */
export function exportTaxInvoiceToPDF(invoice: EGSInvoice) {
  if (typeof window === "undefined" || !invoice) return;

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to open and print the GST Tax Invoice.");
    return;
  }

  const itemsHtml = invoice.items
    .map(
      (item, idx) => `
    <tr>
      <td style="padding: 9px 12px; font-weight: 600; color: #64748b; border-bottom: 1px solid #e2e8f0; width: 30px;">
        ${idx + 1}
      </td>
      <td style="padding: 9px 12px; font-weight: 700; color: #0f172a; border-bottom: 1px solid #e2e8f0;">
        ${item.description}
      </td>
      <td style="padding: 9px 12px; font-family: monospace; color: #64748b; border-bottom: 1px solid #e2e8f0; width: 85px;">
        ${item.hsnCode || "998719"}
      </td>
      <td style="padding: 9px 12px; text-align: center; font-weight: 700; color: #0f172a; border-bottom: 1px solid #e2e8f0; width: 50px;">
        ${item.quantity}
      </td>
      <td style="padding: 9px 12px; text-align: right; font-family: monospace; color: #334155; border-bottom: 1px solid #e2e8f0; width: 105px;">
        ₹${Number(item.unitPrice).toFixed(2)}
      </td>
      <td style="padding: 9px 12px; text-align: right; font-family: monospace; font-weight: 700; color: #0f172a; border-bottom: 1px solid #e2e8f0; width: 115px;">
        ₹${Number(item.amount).toFixed(2)}
      </td>
    </tr>
  `
    )
    .join("");

  const whatsappUrl = generateTaxInvoiceWhatsAppURL(invoice);

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>Tax Invoice — ${invoice.invoiceNo} — EGS INDIA</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          * {
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #0f172a;
            background: #ffffff;
            margin: 0;
            padding: 16px;
            font-size: 11.5px;
            line-height: 1.4;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .invoice-card {
            max-width: 800px;
            margin: 0 auto;
            background: #ffffff;
          }
          .header-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #0284c7;
            padding-bottom: 14px;
            margin-bottom: 14px;
          }
          .brand-col {
            flex: 1;
          }
          .logo-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: #0284c7;
            color: #ffffff;
            font-weight: 900;
            font-size: 13px;
            letter-spacing: 0.5px;
            padding: 5px 10px;
            border-radius: 6px;
            margin-bottom: 5px;
          }
          .brand-title {
            font-size: 15px;
            font-weight: 900;
            color: #0f172a;
            margin: 0;
          }
          .brand-sub {
            font-size: 10.5px;
            color: #64748b;
            font-weight: 600;
            margin-top: 1px;
          }
          .company-meta {
            font-size: 10px;
            color: #475569;
            margin-top: 5px;
            line-height: 1.35;
          }
          .company-meta strong {
            color: #0f172a;
          }
          .invoice-meta-col {
            text-align: right;
            min-width: 260px;
          }
          .tax-inv-badge {
            color: #0284c7;
            font-size: 10.5px;
            font-weight: 900;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            margin-bottom: 4px;
          }
          .inv-num {
            font-size: 17px;
            font-weight: 900;
            font-family: monospace;
            color: #0f172a;
            margin-bottom: 5px;
          }
          .inv-meta-line {
            font-size: 10.5px;
            color: #475569;
            margin-bottom: 2px;
          }
          .inv-meta-line strong {
            color: #0f172a;
          }
          .details-box {
            display: flex;
            justify-content: space-between;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 12px 16px;
            margin-bottom: 14px;
            gap: 16px;
          }
          .details-col {
            flex: 1;
          }
          .details-label {
            font-size: 9px;
            font-weight: 900;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 3px;
          }
          .customer-name {
            font-size: 13.5px;
            font-weight: 900;
            color: #0f172a;
            margin-bottom: 2px;
          }
          .customer-text {
            font-size: 10.5px;
            color: #475569;
            line-height: 1.35;
          }
          .service-name {
            font-size: 12.5px;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 2px;
          }
          .paid-badge {
            display: inline-block;
            background: #dcfce7;
            color: #15803d;
            border: 1px solid #86efac;
            border-radius: 9999px;
            padding: 2.5px 9px;
            font-size: 9.5px;
            font-weight: 800;
            margin-top: 5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 14px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            overflow: hidden;
            font-size: 11px;
          }
          th {
            background: #f1f5f9;
            color: #475569;
            font-size: 9px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding: 8px 10px;
            border-bottom: 1px solid #cbd5e1;
            text-align: left;
          }
          th.right { text-align: right; }
          th.center { text-align: center; }
          .summary-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 16px;
            margin-bottom: 14px;
          }
          .terms-box {
            flex: 1;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 10px 12px;
            font-size: 10px;
            color: #64748b;
          }
          .terms-title {
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 3px;
          }
          .terms-box ol {
            margin: 0;
            padding-left: 14px;
            line-height: 1.4;
          }
          .totals-box {
            width: 270px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 10px 14px;
            font-family: monospace;
            font-size: 11px;
          }
          .total-line {
            display: flex;
            justify-content: space-between;
            color: #475569;
            margin-bottom: 3px;
          }
          .total-line.grand {
            border-top: 2px solid #cbd5e1;
            padding-top: 5px;
            margin-top: 5px;
            font-size: 13.5px;
            font-weight: 900;
            color: #0284c7;
          }
          .warranty-card {
            border: 2px solid #10b981;
            background: #ecfdf5;
            border-radius: 10px;
            padding: 12px 16px;
            margin-top: 8px;
          }
          .warranty-top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 14px;
          }
          .warranty-badge {
            display: inline-block;
            background: #059669;
            color: #ffffff;
            font-size: 9px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding: 2.5px 9px;
            border-radius: 9999px;
            margin-bottom: 3px;
          }
          .warranty-title {
            font-size: 12px;
            font-weight: 900;
            color: #064e3b;
            margin-bottom: 2px;
          }
          .warranty-desc {
            font-size: 10px;
            color: #047857;
            line-height: 1.35;
            max-width: 500px;
          }
          .warranty-expiry-box {
            text-align: right;
            background: #ffffff;
            border: 1px solid #a7f3d0;
            border-radius: 7px;
            padding: 5px 10px;
            font-family: monospace;
          }
          .warranty-exp-label {
            font-size: 8px;
            font-weight: 900;
            color: #64748b;
            text-transform: uppercase;
          }
          .warranty-exp-date {
            font-size: 12px;
            font-weight: 900;
            color: #059669;
            margin-top: 1px;
          }
          .warranty-footer {
            margin-top: 8px;
            padding-top: 6px;
            border-top: 1px solid #a7f3d0;
            display: flex;
            justify-content: space-between;
            font-size: 9.5px;
            color: #065f46;
          }
          .no-print {
            max-width: 800px;
            margin: 0 auto 14px auto;
            display: flex;
            gap: 10px;
            align-items: center;
          }
          .btn {
            background: #0284c7;
            color: #ffffff;
            border: none;
            padding: 8px 14px;
            border-radius: 8px;
            font-weight: 800;
            font-size: 11.5px;
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 6px;
          }
          .btn:hover { background: #0369a1; }
          .btn-whatsapp { background: #25d366; }
          .btn-whatsapp:hover { background: #20ba59; }
          .btn-secondary {
            background: #f1f5f9;
            color: #334155;
            border: 1px solid #cbd5e1;
          }
          .btn-secondary:hover { background: #e2e8f0; }
          @media print {
            body { padding: 0; }
            .no-print { display: none !important; }
            .invoice-card { max-width: 100%; }
          }
        </style>
      </head>
      <body>
        <div class="no-print">
          <button class="btn" onclick="window.print()">
            🖨️ Print / Save as PDF
          </button>
          <a class="btn btn-whatsapp" href="${whatsappUrl}" target="_blank" rel="noopener noreferrer">
            💬 Send to Customer via WhatsApp
          </a>
          <button class="btn btn-secondary" onclick="window.close()">
            ✕ Close
          </button>
        </div>

        <div class="invoice-card">
          <!-- Header -->
          <div class="header-row">
            <div class="brand-col">
              <div class="logo-badge">EGS</div>
              <h1 class="brand-title">${EGS_COMPANY_DETAILS.name}</h1>
              <div class="brand-sub">${EGS_COMPANY_DETAILS.legalName}</div>
              <div class="company-meta">
                <div>${EGS_COMPANY_DETAILS.registeredOffice}</div>
                <div>Branches: Kollam • Kochi • Thiruvananthapuram • Thrissur • Chennai</div>
                <div>GSTIN: <strong>${EGS_COMPANY_DETAILS.gstin}</strong> | PAN: <strong>${EGS_COMPANY_DETAILS.pan}</strong></div>
                <div>Helpline: ${EGS_COMPANY_DETAILS.phone} | ${EGS_COMPANY_DETAILS.email}</div>
              </div>
            </div>

            <div class="invoice-meta-col">
              <div class="tax-inv-badge">TAX INVOICE (RULE 46 OF CGST RULES)</div>
              <div class="inv-num">${invoice.invoiceNo}</div>
              <div class="inv-meta-line">Date: <strong>${invoice.date}</strong></div>
              <div class="inv-meta-line">Reference: <strong>${invoice.bookingId || invoice.amcContractNo || "Direct"}</strong></div>
              <div class="inv-meta-line">Payment Mode: <strong>${invoice.paymentMethod}</strong></div>
              ${
                invoice.transactionRef
                  ? `<div class="inv-meta-line">Ref: <strong style="font-family: monospace;">${invoice.transactionRef}</strong></div>`
                  : ""
              }
            </div>
          </div>

          <!-- Billed to & Service details -->
          <div class="details-box">
            <div class="details-col">
              <div class="details-label">BILLED TO (CUSTOMER):</div>
              <div class="customer-name">${invoice.customerName}</div>
              <div class="customer-text">${invoice.customerAddress}</div>
              <div class="customer-text">${invoice.customerCity}</div>
              <div class="customer-text" style="margin-top: 4px; font-weight: 700; color: #0f172a;">
                Phone: ${invoice.customerPhone}
              </div>
              ${
                invoice.customerEmail
                  ? `<div class="customer-text">${invoice.customerEmail}</div>`
                  : ""
              }
            </div>

            <div class="details-col" style="text-align: right;">
              <div class="details-label">SERVICE DETAILS:</div>
              <div class="service-name">${invoice.acType || "Split AC"}</div>
              <div class="customer-text">
                Assigned Specialist: <strong>${invoice.technicianName || "Arun Kumar"}</strong>
              </div>
              <div style="margin-top: 5px;">
                <span class="paid-badge">✓ Payment Received</span>
              </div>
            </div>
          </div>

          <!-- Items Table -->
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>DESCRIPTION OF GOODS / SERVICES</th>
                <th>HSN/SAC</th>
                <th class="center">QTY</th>
                <th class="right">RATE (₹)</th>
                <th class="right">TAXABLE AMOUNT (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <!-- Terms & Summary Totals -->
          <div class="summary-row">
            <div class="terms-box">
              <div class="terms-title">Payment Terms &amp; Conditions:</div>
              <ol>
                <li>All charges are inclusive of 18% GST (CGST 9% + SGST 9%).</li>
                <li>This is a computer-generated tax invoice and requires no physical signature.</li>
                <li>EGS INDIA helpline: +91 98956 88833 (24/7 HVAC Breakdown Support).</li>
              </ol>
            </div>

            <div class="totals-box">
              <div class="total-line">
                <span>Taxable Subtotal:</span>
                <span>₹${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div class="total-line">
                <span>CGST (9.0%):</span>
                <span>₹${invoice.cgst.toFixed(2)}</span>
              </div>
              <div class="total-line">
                <span>SGST (9.0%):</span>
                <span>₹${invoice.sgst.toFixed(2)}</span>
              </div>
              <div class="total-line grand">
                <span>Grand Total:</span>
                <span>₹${invoice.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <!-- 30-Day Guarantee Warranty Certificate -->
          <div class="warranty-card">
            <div class="warranty-top">
              <div>
                <div class="warranty-badge">30-DAY POST-SERVICE GUARANTEE WARRANTY CERTIFICATE</div>
                <div class="warranty-title">Certified Cooling &amp; Workmanship Protection</div>
                <div class="warranty-desc">
                  This unit is protected under EGS INDIA 30-Day No-Questions-Asked Revisit Guarantee. If any cooling loss or gas drop occurs within 30 days, our senior technician will re-attend free of charge.
                </div>
              </div>

              <div class="warranty-expiry-box">
                <div class="warranty-exp-label">WARRANTY EXPIRY</div>
                <div class="warranty-exp-date">${invoice.warrantyValidUntil}</div>
                <div style="font-size: 8.5px; color: #64748b; margin-top: 1px;">30 Days Validity</div>
              </div>
            </div>

            <div class="warranty-footer">
              <div style="font-weight: 700;">Verified by EGS Quality Assurance Desk • Kollam &amp; Kochi Hub</div>
              <div style="font-family: monospace;">Authorized Digital Stamp • EGS INDIA</div>
            </div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 350);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

