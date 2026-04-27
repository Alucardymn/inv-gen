let itemCount = 0;
let currencySymbol = '$';
const COOKIE_NAME = 'invoice_company_details';
const COOKIE_EXPIRY_DAYS = 365;
const THEME_COOKIE = 'invoice_theme';

function initApp() {
    loadCompanyDetails();
    generateInvoiceNumber();
    setDefaultDates();
    addItemRow();
    setupEventListeners();
    updateCurrencySymbol();
    checkCompanySaved();
    initTheme();
}

function setupEventListeners() {
    const customerInputs = ['customerName', 'customerEmail', 'customerPhone', 'customerAddress'];
    customerInputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', updateInvoicePreview);
        }
    });

    const invoiceInputs = ['invoiceDate', 'dueDate', 'paymentStatus', 'invoiceNotes'];
    invoiceInputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('change', updateInvoicePreview);
            el.addEventListener('input', updateInvoicePreview);
        }
    });

    document.getElementById('currencySelector').addEventListener('change', () => {
        updateCurrencySymbol();
        calculateTotals();
        updateInvoicePreview();
    });

    document.getElementById('companyLogo').addEventListener('change', handleLogoUpload);

    const logoUploadArea = document.getElementById('logoUploadArea');
    logoUploadArea.addEventListener('click', () => {
        document.getElementById('companyLogo').click();
    });
}

// Cookie utilities
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + expires.toUTCString() + ';path=/;SameSite=Strict';
}

function getCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
            return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
}

// Settings Modal
function openSettings() {
    document.getElementById('settingsModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeSettings() {
    document.getElementById('settingsModal').classList.add('hidden');
    document.body.style.overflow = '';
}

// Theme Toggle
function initTheme() {
    const savedTheme = getCookie(THEME_COOKIE);
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    if (current === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        setCookie(THEME_COOKIE, 'light', COOKIE_EXPIRY_DAYS);
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        setCookie(THEME_COOKIE, 'dark', COOKIE_EXPIRY_DAYS);
    }
}

function checkCompanySaved() {
    const saved = getCookie(COOKIE_NAME);
    if (saved) {
        const company = JSON.parse(saved);
        if (!company.name) {
            setTimeout(() => openSettings(), 500);
        }
    } else {
        setTimeout(() => openSettings(), 500);
    }
}

// Currency
function getCurrencySymbol() {
    const currency = document.getElementById('currencySelector').value;
    switch (currency) {
        case 'USD': return '$';
        case 'EUR': return '€';
        case 'TRY': return '₺';
        case 'IQD': return 'IQD ';
        default: return '$';
    }
}

function updateCurrencySymbol() {
    currencySymbol = getCurrencySymbol();
}

function formatCurrency(amount) {
    return currencySymbol + amount.toFixed(2);
}

// Company Details (Session Cookie)
function saveCompanyDetails() {
    const company = {
        name: document.getElementById('companyName').value,
        email: document.getElementById('companyEmail').value,
        phone: document.getElementById('companyPhone').value,
        address: document.getElementById('companyAddress').value,
        website: document.getElementById('companyWebsite').value,
        taxNumber: document.getElementById('companyTaxNumber').value,
        logo: localStorage.getItem('companyLogo') || ''
    };

    setCookie(COOKIE_NAME, JSON.stringify(company), COOKIE_EXPIRY_DAYS);
    alert('Company details saved successfully!');
    closeSettings();
    updateInvoicePreview();
}

function loadCompanyDetails() {
    const saved = getCookie(COOKIE_NAME);
    if (saved) {
        const company = JSON.parse(saved);
        document.getElementById('companyName').value = company.name || '';
        document.getElementById('companyEmail').value = company.email || '';
        document.getElementById('companyPhone').value = company.phone || '';
        document.getElementById('companyAddress').value = company.address || '';
        document.getElementById('companyWebsite').value = company.website || '';
        document.getElementById('companyTaxNumber').value = company.taxNumber || '';

        if (company.logo) {
            localStorage.setItem('companyLogo', company.logo);
            displayLogoInUpload(company.logo);
            displayLogoInPreview(company.logo);
        }
    }
}

function clearCompanyDetails() {
    if (confirm('Are you sure you want to clear all company details?')) {
        deleteCookie(COOKIE_NAME);
        localStorage.removeItem('companyLogo');
        document.getElementById('companyName').value = '';
        document.getElementById('companyEmail').value = '';
        document.getElementById('companyPhone').value = '';
        document.getElementById('companyAddress').value = '';
        document.getElementById('companyWebsite').value = '';
        document.getElementById('companyTaxNumber').value = '';
        document.getElementById('companyLogo').value = '';
        const logoUploadArea = document.getElementById('logoUploadArea');
        logoUploadArea.innerHTML = '<span class="logo-placeholder-text">Click to upload logo</span>';
        logoUploadArea.classList.remove('has-logo');
        updateInvoicePreview();
    }
}

function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64 = e.target.result;
            localStorage.setItem('companyLogo', base64);
            displayLogoInUpload(base64);
            displayLogoInPreview(base64);
        };
        reader.readAsDataURL(file);
    }
}

function displayLogoInUpload(base64) {
    const logoUploadArea = document.getElementById('logoUploadArea');
    logoUploadArea.innerHTML = '<img src="' + base64 + '" alt="Company Logo">';
    logoUploadArea.classList.add('has-logo');
}

function displayLogoInPreview(base64) {
    const invoiceLogoArea = document.getElementById('invoiceLogoArea');
    if (base64) {
        invoiceLogoArea.innerHTML = '<img src="' + base64 + '" alt="Company Logo">';
    } else {
        invoiceLogoArea.innerHTML = '<div class="no-logo-placeholder">No Logo</div>';
    }
}

// Invoice Number
function generateInvoiceNumber() {
    const currentYear = new Date().getFullYear();
    let invoiceCounter = localStorage.getItem('invoiceCounter');

    if (!invoiceCounter) {
        invoiceCounter = 1;
    } else {
        const storedYear = localStorage.getItem('invoiceYear');
        if (storedYear != currentYear) {
            invoiceCounter = 1;
            localStorage.setItem('invoiceYear', currentYear);
        }
    }

    const invoiceNumber = 'INV-' + currentYear + '-' + String(invoiceCounter).padStart(4, '0');
    document.getElementById('invoiceNumber').value = invoiceNumber;
    return invoiceNumber;
}

function incrementInvoiceCounter() {
    const currentYear = new Date().getFullYear();
    let invoiceCounter = parseInt(localStorage.getItem('invoiceCounter')) || 1;
    invoiceCounter++;
    localStorage.setItem('invoiceCounter', invoiceCounter);
    localStorage.setItem('invoiceYear', currentYear);
}

function setDefaultDates() {
    const today = new Date();
    const invoiceDate = today.toISOString().split('T')[0];
    document.getElementById('invoiceDate').value = invoiceDate;

    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + 14);
    const dueDateStr = dueDate.toISOString().split('T')[0];
    document.getElementById('dueDate').value = dueDateStr;
}

// Invoice Items
function addItemRow() {
    itemCount++;
    const tbody = document.getElementById('itemsTableBody');
    const row = document.createElement('tr');
    row.setAttribute('data-item-id', itemCount);
    row.innerHTML = `
        <td class="item-num">${itemCount}</td>
        <td><input type="text" class="item-description" placeholder="Item description" oninput="calculateTotals()"></td>
        <td><input type="number" class="item-quantity" min="1" value="1" oninput="calculateTotals()"></td>
        <td><input type="number" class="item-price" min="0" step="0.01" value="0" oninput="calculateTotals()"></td>
        <td class="item-total">${formatCurrency(0)}</td>
        <td><button class="item-remove-btn" onclick="removeItemRow(${itemCount})" type="button" aria-label="Remove item">&times;</button></td>
    `;
    tbody.appendChild(row);
    updateInvoicePreview();
}

function removeItemRow(itemId) {
    const row = document.querySelector(`tr[data-item-id="${itemId}"]`);
    if (row) {
        const tbody = document.getElementById('itemsTableBody');
        if (tbody.children.length > 1) {
            row.remove();
            renumberItems();
            calculateTotals();
            updateInvoicePreview();
        } else {
            alert('At least one item is required.');
        }
    }
}

function renumberItems() {
    const rows = document.querySelectorAll('#itemsTableBody tr');
    rows.forEach((row, index) => {
        row.querySelector('.item-num').textContent = index + 1;
        row.setAttribute('data-item-id', index + 1);
    });
    itemCount = rows.length;
}

function calculateTotals() {
    const rows = document.querySelectorAll('#itemsTableBody tr');
    let subtotal = 0;

    rows.forEach(row => {
        const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
        const price = parseFloat(row.querySelector('.item-price').value) || 0;
        const lineTotal = quantity * price;
        row.querySelector('.item-total').textContent = formatCurrency(lineTotal);
        subtotal += lineTotal;
    });

    const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
    const discountRate = parseFloat(document.getElementById('discountRate').value) || 0;
    const taxAmount = subtotal * (taxRate / 100);
    const discountAmount = subtotal * (discountRate / 100);
    const grandTotal = subtotal + taxAmount - discountAmount;

    document.getElementById('subtotalDisplay').textContent = formatCurrency(subtotal);
    document.getElementById('taxDisplay').textContent = formatCurrency(taxAmount);
    document.getElementById('discountDisplay').textContent = '-' + formatCurrency(discountAmount);
    document.getElementById('grandTotalDisplay').textContent = formatCurrency(grandTotal);

    updatePreviewTotals(subtotal, taxAmount, discountAmount, grandTotal);
}

function updatePreviewTotals(subtotal, taxAmount, discountAmount, grandTotal) {
    document.getElementById('previewSubtotal').textContent = formatCurrency(subtotal);
    document.getElementById('previewTax').textContent = formatCurrency(taxAmount);
    document.getElementById('previewDiscount').textContent = '-' + formatCurrency(discountAmount);
    document.getElementById('previewGrandTotal').textContent = formatCurrency(grandTotal);
}

// Invoice Preview
function updateInvoicePreview() {
    document.getElementById('previewCompanyName').textContent = document.getElementById('companyName').value || 'Your Company Name';
    document.getElementById('previewCompanyEmail').textContent = document.getElementById('companyEmail').value || 'company@email.com';
    document.getElementById('previewCompanyPhone').textContent = document.getElementById('companyPhone').value;
    document.getElementById('previewCompanyAddress').textContent = document.getElementById('companyAddress').value;
    document.getElementById('previewCompanyWebsite').textContent = document.getElementById('companyWebsite').value;
    document.getElementById('previewCompanyTax').textContent = document.getElementById('companyTaxNumber').value;

    document.getElementById('previewInvoiceNumber').textContent = document.getElementById('invoiceNumber').value;
    document.getElementById('previewInvoiceDate').textContent = document.getElementById('invoiceDate').value;
    document.getElementById('previewDueDate').textContent = document.getElementById('dueDate').value;

    const status = document.getElementById('paymentStatus').value;
    const statusBadge = document.getElementById('previewPaymentStatus');
    statusBadge.textContent = status;
    statusBadge.className = 'payment-status-badge ' + status;

    document.getElementById('previewCustomerName').textContent = document.getElementById('customerName').value || 'Customer Name';
    document.getElementById('previewCustomerEmail').textContent = document.getElementById('customerEmail').value || 'customer@email.com';
    document.getElementById('previewCustomerPhone').textContent = document.getElementById('customerPhone').value;
    document.getElementById('previewCustomerAddress').textContent = document.getElementById('customerAddress').value;

    updatePreviewItems();

    const notes = document.getElementById('invoiceNotes').value;
    document.getElementById('previewNotes').textContent = notes || 'No notes provided.';

    const logo = localStorage.getItem('companyLogo');
    displayLogoInPreview(logo);
}

function updatePreviewItems() {
    const previewBody = document.getElementById('previewItemsBody');
    previewBody.innerHTML = '';

    const rows = document.querySelectorAll('#itemsTableBody tr');

    rows.forEach((row, index) => {
        const description = row.querySelector('.item-description').value || 'Item description';
        const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
        const price = parseFloat(row.querySelector('.item-price').value) || 0;
        const total = quantity * price;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="inv-item-num">${index + 1}</td>
            <td class="inv-item-desc">${description}</td>
            <td class="inv-item-qty">${quantity}</td>
            <td class="inv-item-price">${formatCurrency(price)}</td>
            <td class="inv-item-total">${formatCurrency(total)}</td>
        `;
        previewBody.appendChild(tr);
    });
}

// Validation
function validateInvoice() {
    const errors = [];

    const companyName = document.getElementById('companyName').value.trim();
    if (!companyName) {
        errors.push('Company name is required. Please add your company details in Settings.');
    }

    const customerName = document.getElementById('customerName').value.trim();
    if (!customerName) {
        errors.push('Customer name is required.');
    }

    const invoiceDate = document.getElementById('invoiceDate').value;
    if (!invoiceDate) {
        errors.push('Invoice date is required.');
    }

    const rows = document.querySelectorAll('#itemsTableBody tr');
    if (rows.length === 0) {
        errors.push('At least one item is required.');
    } else {
        let hasValidItem = false;
        rows.forEach(row => {
            const description = row.querySelector('.item-description').value.trim();
            const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
            const price = parseFloat(row.querySelector('.item-price').value) || 0;

            if (description && quantity > 0) {
                hasValidItem = true;
            }

            if (description && quantity <= 0) {
                errors.push('Item quantity must be greater than 0.');
            }
            if (description && price < 0) {
                errors.push('Item price cannot be negative.');
            }
        });

        if (!hasValidItem) {
            errors.push('At least one item with description, quantity greater than 0 is required.');
        }
    }

    if (errors.length > 0) {
        alert('Please fix the following errors:\n\n' + errors.join('\n'));
        return false;
    }

    return true;
}

// Complete Invoice - Show Preview
function completeInvoice() {
    if (!validateInvoice()) {
        return;
    }

    document.getElementById('mainForm').classList.add('hidden');
    document.getElementById('previewSection').classList.remove('hidden');
    document.getElementById('previewSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function backToForm() {
    document.getElementById('previewSection').classList.add('hidden');
    document.getElementById('mainForm').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// PDF Download
async function downloadPDF() {
    if (!validateInvoice()) {
        return;
    }

    const invoicePreview = document.getElementById('invoicePreview');
    const invoiceNumber = document.getElementById('invoiceNumber').value;

    try {
        const { jsPDF } = window.jspdf;
        const canvas = await html2canvas(invoicePreview, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pageWidth - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 10;

        if (imgHeight <= pageHeight - 20) {
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        } else {
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight - 20;
            position = 0;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight + 10;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
        }

        pdf.save('Invoice_' + invoiceNumber + '.pdf');
        incrementInvoiceCounter();
        generateInvoiceNumber();

    } catch (error) {
        console.error('PDF generation error:', error);
        alert('Error generating PDF. Please try again.');
    }
}

function printInvoice() {
    if (!validateInvoice()) {
        return;
    }

    const printContent = document.getElementById('invoicePreview').innerHTML;
    const printWindow = window.open('', '_blank');

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Invoice - ${document.getElementById('invoiceNumber').value}</title>
            <link rel="stylesheet" href="style.css">
            <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
            <style>
                body { background: white; margin: 0; padding: 20px; }
                .invoice-preview { box-shadow: none; }
            </style>
        </head>
        <body>
            <div class="invoice-preview">
                <div class="invoice-paper">
                    ${printContent}
                </div>
            </div>
            <script>
                window.onload = function() {
                    window.print();
                    window.close();
                };
            </script>
        </body>
        </html>
    `);

    printWindow.document.close();
}

function resetInvoice() {
    if (confirm('Are you sure you want to reset the invoice? Customer details and items will be cleared.')) {
        document.getElementById('customerName').value = '';
        document.getElementById('customerEmail').value = '';
        document.getElementById('customerPhone').value = '';
        document.getElementById('customerAddress').value = '';

        document.getElementById('invoiceNotes').value = '';
        document.getElementById('taxRate').value = '0';
        document.getElementById('discountRate').value = '0';

        document.getElementById('itemsTableBody').innerHTML = '';
        addItemRow();

        setDefaultDates();
        document.getElementById('paymentStatus').value = 'Unpaid';

        updateInvoicePreview();
        calculateTotals();
    }
}

document.addEventListener('DOMContentLoaded', initApp);