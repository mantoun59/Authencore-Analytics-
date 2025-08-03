import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface GenerateInvoiceRequest {
  orderId: string;
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[GENERATE-INVOICE] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { orderId }: GenerateInvoiceRequest = await req.json();
    logStep("Request data parsed", { orderId });

    // Get order details with items
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      throw new Error(`Failed to fetch order: ${orderError?.message}`);
    }

    logStep("Order fetched", { orderId: order.id });

    // Generate invoice number
    const { data: invoiceNumber } = await supabaseClient
      .rpc('generate_invoice_number');

    // Create invoice
    const { data: invoice, error: invoiceError } = await supabaseClient
      .from('invoices')
      .insert({
        order_id: orderId,
        invoice_number: invoiceNumber,
        customer_email: order.guest_email || order.user_id,
        customer_name: order.guest_name || 'Registered User',
        subtotal: order.total_amount,
        tax_amount: 0,
        total_amount: order.total_amount,
        currency: order.currency,
        status: 'paid',
        issue_date: new Date().toISOString(),
        due_date: new Date().toISOString()
      })
      .select()
      .single();

    if (invoiceError) {
      throw new Error(`Failed to create invoice: ${invoiceError.message}`);
    }

    logStep("Invoice created", { invoiceId: invoice.id, invoiceNumber });

    // Create invoice items
    const invoiceItems = order.order_items.map((item: any) => ({
      invoice_id: invoice.id,
      description: `${item.assessment_type} Assessment`,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price
    }));

    const { error: itemsError } = await supabaseClient
      .from('invoice_items')
      .insert(invoiceItems);

    if (itemsError) {
      throw new Error(`Failed to create invoice items: ${itemsError.message}`);
    }

    logStep("Invoice items created");

    // Generate receipt HTML
    const receiptHtml = generateReceiptHtml(invoice, invoiceItems, order);

    // Send receipt email
    const customerEmail = order.guest_email || order.user_id;
    if (customerEmail) {
      try {
        await resend.emails.send({
          from: "AuthenCore Analytics <noreply@authencore.org>",
          to: [customerEmail],
          subject: `Receipt for Your Assessment Purchase - Invoice #${invoiceNumber}`,
          html: receiptHtml,
        });
        logStep("Receipt email sent", { email: customerEmail });
      } catch (emailError) {
        logStep("Email sending failed", { error: emailError });
        // Don't fail the whole process if email fails
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      invoiceId: invoice.id,
      invoiceNumber,
      message: 'Invoice generated and receipt sent successfully'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    logStep("ERROR in generate-invoice", { message: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

function generateReceiptHtml(invoice: any, items: any[], order: any): string {
  const itemsHtml = items.map(item => `
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
      <title>Receipt - Invoice #${invoice.invoice_number}</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin: 0;">AuthenCore Analytics</h1>
        <p style="color: #666; margin: 5px 0 0 0;">Professional Assessment Platform</p>
      </div>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="margin: 0 0 15px 0; color: #1e293b;">Receipt</h2>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span><strong>Invoice #:</strong> ${invoice.invoice_number}</span>
          <span><strong>Date:</strong> ${new Date(invoice.issue_date).toLocaleDateString()}</span>
        </div>
        <div style="margin-bottom: 10px;">
          <strong>Customer:</strong> ${invoice.customer_name}
        </div>
        <div>
          <strong>Email:</strong> ${invoice.customer_email}
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
              $${invoice.total_amount.toFixed(2)} ${invoice.currency}
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
}