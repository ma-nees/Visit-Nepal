'use client';

export interface ReceiptLineItem {
  description: string;
  details?: string;
  qty?: number | string;
  rateNpr?: number;
  amountNpr: number;
}

export interface OfficialReceiptData {
  invoiceNumber: string;
  bookingId: string;
  qrCode?: string;
  issuedAt?: string;
  status?: string;

  // Traveler info
  travelerName: string;
  travelerEmail: string;
  travelerPhone: string;
  travelerNationality?: string;
  passportNumber?: string;
  emergencyContact?: string;
  dietaryOrMedicalNotes?: string;

  // Expedition info
  packageTitle: string;
  departureDate: string;
  duration?: string;
  groupSize?: string;
  provider?: string;
  assignedGuide?: string;
  meetingPoint?: string;

  // Financial breakdown
  items: ReceiptLineItem[];
  subtotalNpr: number;
  serviceChargeNpr: number;
  vatNpr: number;
  totalNpr: number;
  totalUsd?: number;
  paymentMethod?: string;
}

export function sanitizeName(name?: string): string {
  if (!name) return 'Aayush Pradhan';
  return (
    name
      .replace(/\./g, ' ')
      .replace(/\s+Explorer/i, '')
      .replace(/\s+Traveler/i, '')
      .trim() || 'Aayush Pradhan'
  );
}

export function generateReceiptHtml(data: OfficialReceiptData): string {
  const cleanName = sanitizeName(data.travelerName);
  const now = data.issuedAt || new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const invoiceNo = data.invoiceNumber || `VN-INV-2026-${Math.floor(10000 + Math.random() * 89999)}`;
  const bookingId = data.bookingId || `VN-BKG-2026-${Math.floor(10000 + Math.random() * 89999)}`;
  const qrHash = data.qrCode || `VN-PASS-${bookingId}-VERIFIED-2026`;
  const paymentMethod = data.paymentMethod || 'Nepal Tourism Gateway (eSewa / Khalti / International Card)';
  const status = data.status || 'PAID IN FULL • CLEARED';

  const rowsHtml = data.items
    .map(
      (item, idx) => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 5px 8px; font-size: 10px; color: #64748b; font-family: monospace;">0${idx + 1}</td>
          <td style="padding: 5px 8px; font-size: 10.5px; font-weight: 600; color: #0f172a;">
            ${item.description}
            ${item.details ? `<div style="font-size: 9px; font-weight: 400; color: #64748b; margin-top: 1px;">${item.details}</div>` : ''}
          </td>
          <td style="padding: 5px 8px; font-size: 10px; color: #475569; text-align: center;">${item.qty || '1 Unit'}</td>
          <td style="padding: 5px 8px; font-size: 10.5px; font-weight: 600; color: #0f172a; text-align: right; font-family: monospace;">
            NPR ${item.amountNpr.toLocaleString()}
          </td>
        </tr>
      `
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Official Receipt - ${invoiceNo}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm 10mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    html, body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      line-height: 1.35;
      padding: 0;
      margin: 0 auto;
      max-width: 820px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body {
      padding: 12px;
    }
    .receipt-container {
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      padding: 16px 20px;
      background: #ffffff;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    .badge-pill {
      display: inline-block;
      padding: 2px 7px;
      font-size: 9px;
      font-weight: 700;
      border-radius: 5px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .badge-success {
      background: #dcfce7;
      color: #15803d;
      border: 1px solid #bbf7d0;
    }
    @media print {
      html, body {
        height: 100% !important;
        max-height: 100% !important;
        overflow: hidden !important;
        margin: 0 !important;
        padding: 0 !important;
        background: transparent !important;
        page-break-after: avoid !important;
        page-break-before: avoid !important;
        break-after: avoid !important;
        break-before: avoid !important;
      }
      .receipt-container {
        border: 1px solid #94a3b8 !important;
        box-shadow: none !important;
        padding: 12px 16px !important;
        max-height: 275mm !important;
        box-sizing: border-box !important;
        page-break-inside: avoid !important;
        page-break-after: avoid !important;
        break-inside: avoid !important;
        overflow: hidden !important;
      }
      tr {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="receipt-container">
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0552A2; padding-bottom: 8px; margin-bottom: 10px;">
      <div>
        <div style="display: flex; align-items: center; gap: 6px;">
          <div style="width: 8px; height: 8px; border-radius: 50%; background: #EC1F27;"></div>
          <span style="font-size: 9px; font-weight: 800; letter-spacing: 1.2px; color: #EC1F27; text-transform: uppercase;">
            GOVERNMENT OF NEPAL • MINISTRY OF TOURISM
          </span>
        </div>
        <h1 style="font-size: 18px; font-weight: 800; color: #0552A2; margin-top: 2px; letter-spacing: -0.3px; line-height: 1.2;">
          NEPAL TOURISM BOARD (NTB)
        </h1>
        <p style="font-size: 10px; color: #64748b; margin-top: 1px;">
          Official Tax Invoice & Expedition Permit Clearance Desk • Kathmandu, Nepal
        </p>
        <p style="font-size: 9.5px; color: #94a3b8; margin-top: 1px; font-family: monospace;">
          PAN: 301295847 &nbsp;|&nbsp; VAT Reg: 601928471 &nbsp;|&nbsp; NTB Clearance ID: 2026-HIM-09
        </p>
      </div>
      <div style="text-align: right;">
        <span class="badge-pill badge-success">${status}</span>
        <div style="font-size: 14px; font-weight: 800; font-family: monospace; color: #0f172a; margin-top: 4px;">
          ${invoiceNo}
        </div>
        <div style="font-size: 9.5px; color: #64748b; font-family: monospace; margin-top: 1px;">
          Date: ${now}
        </div>
      </div>
    </div>

    <!-- Meta Summary Bar -->
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 7px 10px; margin-bottom: 9px;">
      <div>
        <span style="font-size: 8.5px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Booking Reference</span>
        <div style="font-size: 11px; font-weight: 700; color: #0552A2; font-family: monospace; margin-top: 1px;">${bookingId}</div>
      </div>
      <div>
        <span style="font-size: 8.5px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Departure Date</span>
        <div style="font-size: 11px; font-weight: 700; color: #0f172a; margin-top: 1px;">${data.departureDate}</div>
      </div>
      <div>
        <span style="font-size: 8.5px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Payment Channel</span>
        <div style="font-size: 10.5px; font-weight: 600; color: #0f172a; margin-top: 1px;">${paymentMethod.split('(')[0].trim()}</div>
      </div>
      <div>
        <span style="font-size: 8.5px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Total Amount Paid</span>
        <div style="font-size: 12px; font-weight: 800; color: #15803d; font-family: monospace; margin-top: 1px;">
          NPR ${data.totalNpr.toLocaleString()}
        </div>
      </div>
    </div>

    <!-- 2 Column Dossier: Traveler & Expedition -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 9px;">
      <!-- Traveler Box -->
      <div style="border: 1px solid #e2e8f0; border-radius: 6px; padding: 9px 11px; background: #ffffff;">
        <div style="font-size: 9px; font-weight: 800; text-transform: uppercase; color: #0552A2; letter-spacing: 0.8px; margin-bottom: 5px; border-bottom: 1px solid #f1f5f9; padding-bottom: 2px;">
          Lead Traveler & Permit Holder
        </div>
        <div style="font-size: 11.5px; font-weight: 700; color: #0f172a;">${cleanName}</div>
        <div style="font-size: 10px; color: #475569; margin-top: 2px;">
          <strong>Nationality:</strong> ${data.travelerNationality || 'International'}
        </div>
        <div style="font-size: 10px; color: #475569; margin-top: 1px;">
          <strong>Passport / National ID:</strong> ${data.passportNumber || 'NP-VERIFIED-PASS'}
        </div>
        <div style="font-size: 10px; color: #475569; margin-top: 1px;">
          <strong>Phone:</strong> ${data.travelerPhone}
        </div>
        <div style="font-size: 10px; color: #475569; margin-top: 1px;">
          <strong>Email:</strong> ${data.travelerEmail}
        </div>
        ${
          data.emergencyContact
            ? `<div style="font-size: 9.5px; color: #64748b; margin-top: 3px; padding-top: 3px; border-top: 1px dashed #e2e8f0;">
                <strong>Emergency Contact:</strong> ${data.emergencyContact}
              </div>`
            : ''
        }
      </div>

      <!-- Expedition Logistics Box -->
      <div style="border: 1px solid #e2e8f0; border-radius: 6px; padding: 9px 11px; background: #ffffff;">
        <div style="font-size: 9px; font-weight: 800; text-transform: uppercase; color: #0552A2; letter-spacing: 0.8px; margin-bottom: 5px; border-bottom: 1px solid #f1f5f9; padding-bottom: 2px;">
          Expedition & Checkpoint Clearance
        </div>
        <div style="font-size: 11.5px; font-weight: 700; color: #0f172a;">${data.packageTitle}</div>
        <div style="font-size: 10px; color: #475569; margin-top: 2px;">
          <strong>Duration:</strong> ${data.duration || 'Scheduled Itinerary'}
        </div>
        <div style="font-size: 10px; color: #475569; margin-top: 1px;">
          <strong>Travelers:</strong> ${data.groupSize || 'Confirmed Party'}
        </div>
        <div style="font-size: 10px; color: #475569; margin-top: 1px;">
          <strong>Licensed Operator:</strong> ${data.provider || 'Himalayan Sherpa Expeditions'}
        </div>
        <div style="font-size: 10px; color: #475569; margin-top: 1px;">
          <strong>Assigned Route Leader:</strong> ${data.assignedGuide || 'IFMGA Certified Sherpa Guide'}
        </div>
        <div style="font-size: 9.5px; color: #64748b; margin-top: 3px; padding-top: 3px; border-top: 1px dashed #e2e8f0;">
          <strong>Rendezvous Base:</strong> ${data.meetingPoint || 'Kathmandu Departure Base (TIA / Thamel)'}
        </div>
      </div>
    </div>

    <!-- Itemized Quotation / Invoice Table -->
    <div style="margin-bottom: 9px;">
      <div style="font-size: 9px; font-weight: 800; text-transform: uppercase; color: #475569; letter-spacing: 0.5px; margin-bottom: 4px;">
        Itemized Statement of Charges (Compliant with NTB & IRD Regulations)
      </div>
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #cbd5e1; border-radius: 6px; overflow: hidden;">
        <thead>
          <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1; text-align: left;">
            <th style="padding: 5px 8px; font-size: 9px; font-weight: 700; text-transform: uppercase; color: #475569;">#</th>
            <th style="padding: 5px 8px; font-size: 9px; font-weight: 700; text-transform: uppercase; color: #475569;">Description & Included Services</th>
            <th style="padding: 5px 8px; font-size: 9px; font-weight: 700; text-transform: uppercase; color: #475569; text-align: center;">Qty / Unit</th>
            <th style="padding: 5px 8px; font-size: 9px; font-weight: 700; text-transform: uppercase; color: #475569; text-align: right;">Amount (NPR)</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
          <!-- Subtotal -->
          <tr style="background: #f8fafc; font-weight: 600; border-top: 1px solid #cbd5e1;">
            <td colspan="3" style="padding: 4px 8px; font-size: 10px; text-align: right; color: #475569;">Subtotal (Taxable Amount):</td>
            <td style="padding: 4px 8px; font-size: 10.5px; text-align: right; font-family: monospace; color: #0f172a;">
              NPR ${data.subtotalNpr.toLocaleString()}
            </td>
          </tr>
          <!-- Tourism Service Charge -->
          <tr style="background: #f8fafc;">
            <td colspan="3" style="padding: 3px 8px; font-size: 9.5px; text-align: right; color: #64748b;">Nepal Tourism Service Charge (5%):</td>
            <td style="padding: 3px 8px; font-size: 9.5px; text-align: right; font-family: monospace; color: #475569;">
              NPR ${data.serviceChargeNpr.toLocaleString()}
            </td>
          </tr>
          <!-- Inland Revenue VAT -->
          <tr style="background: #f8fafc;">
            <td colspan="3" style="padding: 3px 8px; font-size: 9.5px; text-align: right; color: #64748b;">Nepal Inland Revenue VAT (13%):</td>
            <td style="padding: 3px 8px; font-size: 9.5px; text-align: right; font-family: monospace; color: #475569;">
              NPR ${data.vatNpr.toLocaleString()}
            </td>
          </tr>
          <!-- Grand Total -->
          <tr style="background: #eff6ff; border-top: 2px solid #0552A2;">
            <td colspan="3" style="padding: 6px 8px; font-size: 11px; font-weight: 800; text-align: right; color: #0552A2;">
              TOTAL AMOUNT PAID:
            </td>
            <td style="padding: 6px 8px; font-size: 12.5px; font-weight: 800; text-align: right; color: #0552A2; font-family: monospace;">
              NPR ${data.totalNpr.toLocaleString()}
              ${data.totalUsd ? `<span style="font-size: 9.5px; font-weight: 500; color: #64748b; margin-left: 4px;">(~${data.totalUsd.toLocaleString()} USD)</span>` : ''}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Security & Boarding Pass Strip -->
    <div style="background: #0f172a; color: #ffffff; border-radius: 6px; padding: 7px 12px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 9px;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <div style="background: #ffffff; padding: 3px; border-radius: 4px; display: inline-block;">
          <!-- SVG QR Code Icon -->
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0552A2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        </div>
        <div>
          <div style="font-size: 8.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">
            Digital Pass Verification Hash
          </div>
          <div style="font-size: 10.5px; font-weight: 700; font-family: monospace; color: #38bdf8;">
            ${qrHash}
          </div>
          <div style="font-size: 8.5px; color: #94a3b8; margin-top: 1px;">
            Valid for immigration inspection, TIMS counters, and Sagarmatha / Annapurna checkpoint entries.
          </div>
        </div>
      </div>
      <div style="text-align: right;">
        <span style="display: inline-block; background: #0552A2; color: #ffffff; font-size: 9px; font-weight: 800; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">
          NTB AUTHENTICATED
        </span>
      </div>
    </div>

    <!-- Footer Disclaimers & Emergency -->
    <div style="display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid #e2e8f0; padding-top: 6px; font-size: 9px; color: #64748b;">
      <div style="max-width: 520px; line-height: 1.35;">
        <p><strong>Official Notice:</strong> Present this receipt & boarding pass along with your original passport at Nepal Tourism Board checkpoints. High-altitude medical evacuation coverage is registered under your booking reference.</p>
        <p style="margin-top: 2px; color: #dc2626; font-weight: 600;">
          🚨 NTB 24/7 Satellite Search & Rescue Emergency Coordination Hotline: 1144 | +977-1-4256909
        </p>
      </div>
      <div style="text-align: right; min-width: 140px;">
        <div style="border-top: 1px solid #94a3b8; padding-top: 2px; margin-top: 8px; font-size: 8.5px; color: #475569; font-weight: 700; line-height: 1.2;">
          Controller of Tourism Desk<br/>
          Government of Nepal
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Clean isolated printing of the receipt.
 * Creates an off-screen iframe, writes ONLY the receipt HTML,
 * and calls window.print() on the iframe context.
 * The main browser window (modals, navbar, dark backdrops) is NEVER printed!
 */
export function printOfficialReceipt(data: OfficialReceiptData) {
  if (typeof window === 'undefined') return;

  const html = generateReceiptHtml(data);

  // Remove any stale print frame if one exists
  const existingFrame = document.getElementById('vn-isolated-print-frame');
  if (existingFrame && existingFrame.parentNode) {
    existingFrame.parentNode.removeChild(existingFrame);
  }

  // Create isolated off-screen iframe
  const iframe = document.createElement('iframe');
  iframe.id = 'vn-isolated-print-frame';
  iframe.style.position = 'fixed';
  iframe.style.top = '0';
  iframe.style.left = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = 'none';
  iframe.style.opacity = '0';
  iframe.style.pointerEvents = 'none';
  iframe.setAttribute('aria-hidden', 'true');

  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    // Fallback in rare case iframe doc isn't accessible
    window.print();
    return;
  }

  doc.open();
  doc.write(html);
  doc.close();

  // Focus and trigger print on the iframe only
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.error('Isolated receipt print failed:', e);
      window.print();
    } finally {
      // Clean up after 2.5s
      setTimeout(() => {
        if (iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
      }, 2500);
    }
  }, 350);
}

/**
 * Downloads the clean receipt as an offline HTML file.
 */
export function downloadOfficialReceiptHtml(data: OfficialReceiptData) {
  if (typeof window === 'undefined') return;

  const html = generateReceiptHtml(data);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const inv = data.invoiceNumber || data.bookingId || 'receipt';
  a.download = `Official-Receipt-${inv}.html`;
  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    if (a.parentNode) {
      a.parentNode.removeChild(a);
    }
    URL.revokeObjectURL(url);
  }, 300);
}
