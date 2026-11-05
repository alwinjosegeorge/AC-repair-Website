import { Booking } from "./store";

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
    "Date Created",
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
    "Preferred Date",
    "Preferred Slot",
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
    escapeCSV(b.createdAt || ""),
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
    escapeCSV(b.preferredDate || ""),
    escapeCSV(b.preferredSlot || ""),
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
      <td style="padding: 7px 8px;">
        <div style="font-weight: 700; color: #0f172a;">${b.customerName}</div>
        <div style="font-size: 10px; color: #64748b;">${b.phone}</div>
      </td>
      <td style="padding: 7px 8px;">
        <div style="font-weight: 600; color: #1e293b;">${b.serviceName}</div>
        <div style="font-size: 10px; color: #64748b;">${b.acType} (${b.unitCount} Unit${Number(b.unitCount) > 1 ? "s" : ""})</div>
      </td>
      <td style="padding: 7px 8px; font-size: 11px;">
        <div>${b.preferredDate || "Immediate"}</div>
        <div style="font-size: 10px; color: #64748b;">${b.preferredSlot || ""}</div>
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
              <th>Customer</th>
              <th>Service &amp; AC</th>
              <th>Preferred Slot</th>
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

