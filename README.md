# Invoice Generator Website

## Course: SWE402 Internet Programming

---

## Student Information

- **Student Name:** Muaien Al-ahmar
- **Student ID:** 210513526
- **Instructor:** F. Kuzey Edes Huyal
- **Repository Link:** https://github.com/[username]/invoice-gen

---

## Project Description

This is a fully functional **Invoice Generator Website** built for the **SWE402 Internet Programming** course. The application allows users to create professional invoices directly in the browser without requiring any backend server or database. Features a modern dark-themed UI with geometric accents and real-time live preview.

## Features

### Core Features

1. **Company Profile Management**
   - Save company details (name, email, phone, address, website, tax number)
   - Upload and display company logo
   - All data persists using browser cookies and localStorage

2. **Customer Details**
   - Enter customer information
   - Display customer info in the "Bill To" section

3. **Invoice Information**
   - Auto-generated invoice number (format: INV-YEAR-0001)
   - Invoice date (defaults to today)
   - Due date selection (defaults to 14 days from today)
   - Payment status with colored badges (Unpaid, Paid, Pending, Overdue)
   - Notes/payment terms textarea

4. **Invoice Items**
   - Dynamic item rows (add/remove)
   - Description, quantity, unit price per item
   - Auto-calculated line totals
   - Real-time preview updates

5. **Calculations**
   - Automatic subtotal calculation
   - Configurable tax percentage
   - Configurable discount percentage
   - Grand total calculation (Subtotal + Tax - Discount)

6. **Currency Selection**
   - Support for USD ($), EUR (€), TRY (₺), IQD
   - Currency symbol updates across all calculations and PDF

7. **Live Invoice Preview**
   - Professional invoice layout with modern aesthetic
   - Live preview updates as you type
   - Company logo display
   - Payment status badge
   - All items and totals displayed
   - Complete Invoice flow with preview step before PDF generation

8. **PDF Generation**
   - Download invoice as PDF using jsPDF and html2canvas
   - Professional A4 format
   - Filename includes invoice number
   - High-quality output with 2x scale factor

9. **Print Functionality**
   - Print invoice directly from browser
   - Print-optimized CSS (hides form, shows only invoice)

10. **Reset Invoice**
    - Clear customer details and items
    - Keep company profile saved
    - Add one empty item row

11. **Dark/Light Theme Toggle**
    - Switch between dark mode (default) and light mode
    - Theme preference persists in browser cookies

### Data Persistence

- Company details saved in cookies (365-day expiry)
- Company logo (Base64) saved in localStorage
- Invoice counter persists per year
- Theme preference saved in cookies
- Form data auto-loads on page refresh

---

## Technologies Used

- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with CSS variables, dark/light theming
- **Vanilla JavaScript** - No frameworks, pure JS functionality
- **jsPDF** - PDF generation (via CDN)
- **html2canvas** - HTML to canvas conversion for PDF (via CDN)
- **localStorage** - Logo image persistence
- **Cookies** - Company details, theme preference, invoice counter

---

## Design System

### Aesthetic: Obsidian Ledger

A sophisticated dark-themed design with electric cyan accents and geometric patterns:

- **Primary Background:** #0c0c0f (deep obsidian)
- **Accent Color:** #00d4aa (electric cyan)
- **Secondary Accent:** #ffb347 (warm amber)
- **Typography:** Cormorant Garamond (display), DM Sans (body), JetBrains Mono (numbers)
- **Ambient Effects:** Subtle grid pattern, glowing orbs, card hover animations

### Color Palette

| Role | Dark Mode | Light Mode |
|------|-----------|------------|
| Background Primary | #0c0c0f | #f5f5f7 |
| Card Background | #1a1a21 | #ffffff |
| Accent | #00d4aa | #00a888 |
| Text Primary | #f0f0f5 | #1a1a21 |
| Text Secondary | #a0a0b0 | #606070 |
| Border | #2a2a35 | #e0e0e8 |

### Payment Status Colors

| Status | Color |
|--------|-------|
| Unpaid | #ffb347 (amber) |
| Paid | #00d4aa (cyan) |
| Pending | #64b5f6 (blue) |
| Overdue | #ff6b6b (red) |

---

## Project Structure

```
invoice-gen/
│
├── index.html      # Main HTML structure with embedded SVG icons
├── style.css       # Complete stylesheet with dark/light themes
├── script.js       # Application logic
└── README.md       # This documentation
```

---

## How to Run

1. **No installation required!**
2. Simply open `index.html` in any modern web browser
3. Supported browsers: Chrome, Firefox, Edge, Safari

### Steps:

1. Open `index.html` in your browser
2. On first visit, the Company Settings modal opens automatically
3. Fill in your company information and click "Save Company Details"
4. Upload your company logo (optional)
5. Enter customer details
6. Add invoice items by clicking "Add Item"
7. Set tax and discount percentages
8. Click "Complete Invoice" to preview
9. Download PDF, Print, or go Back to Edit

---

## How to Use

### Company Profile (Settings Modal)

- Click the Settings button in the header to open modal
- Fill in your company information
- Upload your company logo (JPG, PNG, GIF supported)
- Click "Save Company Details" to persist in browser
- "Clear Company Details" removes all saved data

### Invoice Details

- Invoice number auto-generates (INV-YEAR-XXXX)
- Invoice date defaults to today
- Select a due date (defaults to 14 days from today)
- Choose payment status from dropdown
- Add notes for payment terms

### Adding Items

1. Click "+ Add Item" button
2. Enter item description
3. Enter quantity (must be > 0)
4. Enter unit price
5. Line total calculates automatically
6. Click "×" to remove an item

### Totals

- Subtotal auto-calculates from all items
- Enter tax percentage (e.g., 10 for 10%)
- Enter discount percentage (e.g., 5 for 5%)
- Grand Total = Subtotal + Tax - Discount

### Completing Invoice

1. Fill in all required fields
2. Click "Complete Invoice" to see full preview
3. From preview, you can:
   - **Download PDF** - Generates and downloads PDF file
   - **Print** - Opens browser print dialog
   - **Back to Edit** - Returns to form for modifications

### Reset Invoice

- Click "Reset" to clear current invoice
- Keeps company profile and logo saved
- Resets customer details, items, tax, discount, and notes

---

## LocalStorage & Cookie Notes

This application stores data in your browser:

| Storage | Key | Data Stored |
|---------|-----|------------|
| localStorage | `companyLogo` | Base64 encoded logo image |
| cookie | `invoice_company_details` | Company profile (JSON, 365-day expiry) |
| cookie | `invoice_theme` | Theme preference ("dark" or "light") |
| localStorage | `invoiceCounter` | Current invoice number |
| localStorage | `invoiceYear` | Current year for invoice numbering |

- Data persists across browser sessions
- Data is specific to this browser on this device
- Clearing browser data will clear saved information
- Logo is stored as Base64 string (~5MB recommended max)

---

## Validation Rules

Before PDF download or print, the following validations occur:

1. **Company Name** - Required (from saved company details)
2. **Customer Name** - Required
3. **Invoice Date** - Required
4. **At least one item** with:
   - Non-empty description
   - Quantity greater than 0
   - Price >= 0

If validation fails, an alert shows all errors and prevents generation.

---

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Edge 80+
- Safari 13+
- Mobile browsers (iOS Safari, Chrome for Android)

---

## PDF Generation Technical Details

- Uses html2canvas to render invoice preview to canvas
- Uses jsPDF to create A4 document
- Scale factor of 2 for high quality
- Multi-page support for long invoices
- CORS enabled for logo images
- Page breaks handled automatically

---

## Responsive Design

The application is fully responsive:

| Breakpoint | Layout |
|------------|--------|
| Desktop (>768px) | Full layout with all form cards visible |
| Tablet (768px) | Stacked form cards, adjusted spacing |
| Mobile (<480px) | Compact cards, reduced fonts and padding |

---

## Print CSS

When printing, the following changes apply:
- Header, forms, settings modal, and footer are hidden
- Only invoice preview is printed
- White background for clean printing
- Proper page margins
- Invoice scales to fit page width

---

## License

This project was created for educational purposes as part of the SWE402 Internet Programming course.

---

## Author

**Student Name:** Muaien Al-ahmar
**Student ID:** 210513526
**Course:** SWE402 Internet Programming
**Project:** Invoice Generator Website
**Date:** 2026
