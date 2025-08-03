import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const InvoicePreview: React.FC = () => {
  const mockInvoiceData = {
    invoice_number: "INV-2024-001",
    issue_date: new Date().toISOString(),
    customer_name: "John Doe",
    customer_email: "john.doe@example.com",
    total_amount: 24.99,
    currency: "USD",
    items: [
      {
        description: "CAIR Personality Assessment",
        quantity: 1,
        unit_price: 24.99,
        total_price: 24.99
      }
    ]
  };

  const generateReceiptHtml = () => {
    const itemsHtml = mockInvoiceData.items.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #e5e5e5;">${item.description}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e5e5; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e5e5; text-align: right;">$${item.unit_price.toFixed(2)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e5e5; text-align: right;">$${item.total_price.toFixed(2)}</td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Receipt - Invoice #${mockInvoiceData.invoice_number}</title>
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">AuthenCore Analytics</h1>
          <p style="color: #666; margin: 5px 0 0 0;">Professional Assessment Platform</p>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h2 style="margin: 0 0 15px 0; color: #1e293b;">Receipt</h2>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span><strong>Invoice #:</strong> ${mockInvoiceData.invoice_number}</span>
            <span><strong>Date:</strong> ${new Date(mockInvoiceData.issue_date).toLocaleDateString()}</span>
          </div>
          <div style="margin-bottom: 10px;">
            <strong>Customer:</strong> ${mockInvoiceData.customer_name}
          </div>
          <div>
            <strong>Email:</strong> ${mockInvoiceData.customer_email}
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr style="background: #f1f5f9;">
              <th style="padding: 12px 8px; text-align: left; border-bottom: 2px solid #e2e8f0;">Description</th>
              <th style="padding: 12px 8px; text-align: center; border-bottom: 2px solid #e2e8f0;">Qty</th>
              <th style="padding: 12px 8px; text-align: right; border-bottom: 2px solid #e2e8f0;">Unit Price</th>
              <th style="padding: 12px 8px; text-align: right; border-bottom: 2px solid #e2e8f0;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 12px 8px; text-align: right; font-weight: bold; border-top: 2px solid #e2e8f0;">
                Total:
              </td>
              <td style="padding: 12px 8px; text-align: right; font-weight: bold; border-top: 2px solid #e2e8f0;">
                $${mockInvoiceData.total_amount.toFixed(2)} ${mockInvoiceData.currency}
              </td>
            </tr>
          </tfoot>
        </table>

        <div style="background: #ecfdf5; border: 1px solid #86efac; padding: 15px; border-radius: 8px; margin-bottom: 30px;">
          <p style="margin: 0; color: #166534;">
            <strong>Payment Status:</strong> ✅ Paid in full
          </p>
        </div>

        <div style="text-align: center; color: #666; font-size: 14px;">
          <p>Thank you for your purchase!</p>
          <p>If you have any questions, please contact us at support@authencore.org</p>
        </div>
      </body>
      </html>
    `;
  };

  const openReceiptPreview = () => {
    const receiptHtml = generateReceiptHtml();
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(receiptHtml);
      newWindow.document.close();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Invoice & Receipt Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Invoice Summary */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">Invoice Details</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><strong>Invoice #:</strong> {mockInvoiceData.invoice_number}</div>
            <div><strong>Date:</strong> {new Date(mockInvoiceData.issue_date).toLocaleDateString()}</div>
            <div><strong>Customer:</strong> {mockInvoiceData.customer_name}</div>
            <div><strong>Email:</strong> {mockInvoiceData.customer_email}</div>
          </div>
        </div>

        {/* Items Table */}
        <div>
          <h3 className="font-semibold mb-3">Items</h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Unit Price</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {mockInvoiceData.items.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-3">{item.description}</td>
                    <td className="p-3 text-center">{item.quantity}</td>
                    <td className="p-3 text-right">${item.unit_price.toFixed(2)}</td>
                    <td className="p-3 text-right">${item.total_price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 font-semibold">
                  <td colSpan={3} className="p-3 text-right">Total:</td>
                  <td className="p-3 text-right">
                    ${mockInvoiceData.total_amount.toFixed(2)} {mockInvoiceData.currency}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Payment Status */}
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <p className="text-green-800">
            <strong>Payment Status:</strong> ✅ Paid in full
          </p>
        </div>

        {/* Preview Button */}
        <div className="text-center">
          <Button onClick={openReceiptPreview} className="w-full sm:w-auto">
            Open Receipt Preview in New Window
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            This shows exactly what customers receive via email
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoicePreview;