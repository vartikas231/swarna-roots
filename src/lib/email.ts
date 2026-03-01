import nodemailer from "nodemailer";
import { Resend } from "resend";

interface OrderEmailItem {
  name: string;
  quantity: number;
  unitLabel: string;
}

interface SendOrderConfirmationInput {
  to: string;
  customerName: string;
  orderNumber: string;
  total: number;
  paymentMethod: string;
  items: OrderEmailItem[];
}

interface SendOrderConfirmationResult {
  sent: boolean;
  provider: "resend" | "gmail" | "console";
  error?: string;
}

interface SendAuthMagicLinkInput {
  to: string;
  url: string;
}

interface SendAuthMagicLinkResult {
  sent: boolean;
  provider: "resend" | "gmail" | "console";
  error?: string;
}

const orderFromAddress =
  process.env.ORDER_EMAIL_FROM ?? "Swarna Roots <onboarding@resend.dev>";
const authFromAddress = process.env.AUTH_EMAIL_FROM ?? orderFromAddress;
const gmailUser = process.env.GMAIL_SMTP_USER;
const gmailAppPassword = process.env.GMAIL_SMTP_APP_PASSWORD;

interface SendMailPayload {
  to: string;
  subject: string;
  text: string;
  html: string;
  from: string;
}

async function sendViaGmail(
  payload: SendMailPayload,
): Promise<{ sent: boolean; provider: "gmail" | "console"; error?: string }> {
  if (!gmailUser || !gmailAppPassword) {
    return { sent: false, provider: "console" };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });

    await transporter.sendMail({
      from: payload.from,
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    });

    return { sent: true, provider: "gmail" };
  } catch (error) {
    return {
      sent: false,
      provider: "gmail",
      error: error instanceof Error ? error.message : "Unknown Gmail send error.",
    };
  }
}

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new Resend(apiKey);
}

function buildEmailText(input: SendOrderConfirmationInput) {
  const lines = input.items.map((item) => `- ${item.name} x ${item.quantity} (${item.unitLabel})`);
  return [
    `Hi ${input.customerName},`,
    "",
    `Your order ${input.orderNumber} has been received.`,
    `Payment method: ${input.paymentMethod.toUpperCase()}`,
    `Order total: INR ${Math.round(input.total)}`,
    "",
    "Items:",
    ...lines,
    "",
    "Thank you for choosing Swarna Roots.",
  ].join("\n");
}

function buildEmailHtml(input: SendOrderConfirmationInput) {
  const items = input.items
    .map((item) => `<li>${item.name} x ${item.quantity} (${item.unitLabel})</li>`)
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; color: #213328; line-height: 1.5;">
      <p>Hi ${input.customerName},</p>
      <p>Your order <strong>${input.orderNumber}</strong> has been received.</p>
      <p>
        Payment method: <strong>${input.paymentMethod.toUpperCase()}</strong><br />
        Order total: <strong>INR ${Math.round(input.total)}</strong>
      </p>
      <p><strong>Items:</strong></p>
      <ul>${items}</ul>
      <p>Thank you for choosing Swarna Roots.</p>
    </div>
  `;
}

export async function sendOrderConfirmationEmail(
  input: SendOrderConfirmationInput,
): Promise<SendOrderConfirmationResult> {
  const subject = `Order Confirmed: ${input.orderNumber}`;
  const text = buildEmailText(input);
  const html = buildEmailHtml(input);
  const gmailResult = await sendViaGmail({
    to: input.to,
    subject,
    text,
    html,
    from: orderFromAddress,
  });

  if (gmailResult.sent) {
    return { sent: true, provider: "gmail" };
  }

  if (gmailResult.provider === "gmail" && gmailResult.error) {
    return {
      sent: false,
      provider: "gmail",
      error: gmailResult.error,
    };
  }

  const resend = getResendClient();
  if (!resend) {
    console.log("[email:fallback] Missing Gmail SMTP and RESEND_API_KEY, logging email.", {
      to: input.to,
      subject,
      text,
    });
    return { sent: false, provider: "console" };
  }

  try {
    await resend.emails.send({
      from: orderFromAddress,
      to: [input.to],
      subject,
      text,
      html,
    });
    return { sent: true, provider: "resend" };
  } catch (error) {
    return {
      sent: false,
      provider: "resend",
      error: error instanceof Error ? error.message : "Unknown email send error.",
    };
  }
}

export async function sendAuthMagicLinkEmail(
  input: SendAuthMagicLinkInput,
): Promise<SendAuthMagicLinkResult> {
  const subject = "Your sign-in link for Swarna Roots";
  const text = [
    "Use this secure link to sign in to your Swarna Roots account:",
    input.url,
    "",
    "If you did not request this, you can ignore this email.",
  ].join("\n");
  const html = `
    <div style="font-family: Arial, sans-serif; color: #223329; line-height: 1.5;">
      <p>Use this secure link to sign in to your Swarna Roots account:</p>
      <p>
        <a href="${input.url}" target="_blank" rel="noopener noreferrer"
          style="display:inline-block;padding:10px 16px;border-radius:8px;background:#1f6d4e;color:#fff;text-decoration:none;font-weight:700;">
          Sign in to Swarna Roots
        </a>
      </p>
      <p style="word-break: break-all; color: #52635a;">${input.url}</p>
      <p>If you did not request this, you can ignore this email.</p>
    </div>
  `;
  const gmailResult = await sendViaGmail({
    to: input.to,
    subject,
    text,
    html,
    from: authFromAddress,
  });

  if (gmailResult.sent) {
    return { sent: true, provider: "gmail" };
  }

  if (gmailResult.provider === "gmail" && gmailResult.error) {
    return {
      sent: false,
      provider: "gmail",
      error: gmailResult.error,
    };
  }

  const resend = getResendClient();
  if (!resend) {
    console.log("[auth-email:fallback] Missing Gmail SMTP and RESEND_API_KEY, magic link:", {
      to: input.to,
      url: input.url,
    });
    return { sent: false, provider: "console" };
  }

  try {
    await resend.emails.send({
      from: authFromAddress,
      to: [input.to],
      subject,
      text,
      html,
    });
    return { sent: true, provider: "resend" };
  } catch (error) {
    return {
      sent: false,
      provider: "resend",
      error: error instanceof Error ? error.message : "Unknown auth email send error.",
    };
  }
}
