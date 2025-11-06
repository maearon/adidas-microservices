import { NextRequest, NextResponse } from "next/server";
import httpStatus from "http-status";
import { requireUserFromRequest } from "@/lib/utils/getUserFromRequest";

/**
 * POST /api/v1/payments/create-intent
 * Create payment intent for Stripe, MoMo, VNPay
 */
export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserFromRequest(req);
    const body = await req.json();
    const { orderId, amount, currency = "USD", paymentMethod } = body;

    if (!orderId || !amount || !paymentMethod) {
      return NextResponse.json(
        { message: "Missing required fields: orderId, amount, paymentMethod" },
        { status: httpStatus.BAD_REQUEST }
      );
    }

    // Route to appropriate payment provider
    switch (paymentMethod) {
      case "stripe":
        return await createStripeIntent(orderId, amount, currency);
      case "momo":
        return await createMoMoPayment(orderId, amount, currency);
      case "vnpay":
        return await createVNPayPayment(orderId, amount, currency);
      case "cod":
        return NextResponse.json(
          {
            paymentId: `cod-${Date.now()}`,
            method: "cod",
            status: "pending",
            message: "Payment will be collected on delivery",
          },
          { status: httpStatus.OK }
        );
      default:
        return NextResponse.json(
          { message: "Invalid payment method" },
          { status: httpStatus.BAD_REQUEST }
        );
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create payment intent";

    return NextResponse.json(
      { message },
      { status: httpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

/**
 * Create Stripe Payment Intent
 */
async function createStripeIntent(orderId: string, amount: number, currency: string) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  
  if (!stripeSecretKey) {
    throw new Error("STRIPE_SECRET_KEY not configured");
  }

  // Convert amount to cents (Stripe uses smallest currency unit)
  const amountInCents = Math.round(amount * (currency === "VND" ? 1 : 100));

  const response = await fetch("https://api.stripe.com/v1/payment_intents", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${stripeSecretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      amount: amountInCents.toString(),
      currency: currency.toLowerCase(),
      metadata: `order_id=${orderId}`,
      automatic_payment_methods: "enabled",
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Failed to create Stripe payment intent");
  }

  const data = await response.json();

  return NextResponse.json(
    {
      paymentId: data.id,
      clientSecret: data.client_secret,
      method: "stripe",
      status: data.status,
    },
    { status: httpStatus.OK }
  );
}

/**
 * Create MoMo Payment
 */
async function createMoMoPayment(orderId: string, amount: number, currency: string) {
  const partnerCode = process.env.MOMO_PARTNER_CODE;
  const accessKey = process.env.MOMO_ACCESS_KEY;
  const secretKey = process.env.MOMO_SECRET_KEY;
  const endpoint = process.env.MOMO_ENDPOINT || "https://test-payment.momo.vn/v2/gateway/api/create";

  if (!partnerCode || !accessKey || !secretKey) {
    throw new Error("MoMo credentials not configured");
  }

  // MoMo uses VND, convert if needed
  const amountInVND = currency === "VND" ? amount : Math.round(amount * 24000); // Approximate conversion

  const requestId = `${Date.now()}`;
  const orderInfo = `Order ${orderId}`;
  const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://adidas-mocha.vercel.app"}/payment/callback?method=momo`;
  const ipnUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://adidas-mocha.vercel.app"}/api/v1/payments/webhook/momo`;
  const extraData = "";

  // Create signature
  const rawSignature = `accessKey=${accessKey}&amount=${amountInVND}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=captureWallet`;
  
  const crypto = await import("crypto");
  const signature = crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");

  const requestBody = {
    partnerCode,
    partnerName: "Adidas Clone",
    storeId: "MomoTestStore",
    requestId,
    amount: amountInVND,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    lang: "vi",
    autoCapture: true,
    extraData,
    requestType: "captureWallet",
    signature,
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create MoMo payment");
  }

  const data = await response.json();

  return NextResponse.json(
    {
      paymentId: data.orderId,
      payUrl: data.payUrl,
      method: "momo",
      status: "pending",
      qrCodeUrl: data.qrCodeUrl,
    },
    { status: httpStatus.OK }
  );
}

/**
 * Create VNPay Payment
 */
async function createVNPayPayment(orderId: string, amount: number, currency: string) {
  const tmnCode = process.env.VNPAY_TMN_CODE;
  const secretKey = process.env.VNPAY_SECRET_KEY;
  const vnpUrl = process.env.VNPAY_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

  if (!tmnCode || !secretKey) {
    throw new Error("VNPay credentials not configured");
  }

  // VNPay uses VND
  const amountInVND = currency === "VND" ? amount : Math.round(amount * 24000);

  const vnp_Params: Record<string, string> = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Amount: (amountInVND * 100).toString(), // VNPay uses smallest unit
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: `Order ${orderId}`,
    vnp_OrderType: "other",
    vnp_Locale: "vn",
    vnp_ReturnUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://adidas-mocha.vercel.app"}/payment/callback?method=vnpay`,
    vnp_IpAddr: "127.0.0.1", // Should get from request in production
    vnp_CreateDate: new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "00",
  };

  // Sort params and create signature
  const sortedParams = Object.keys(vnp_Params)
    .sort()
    .reduce((acc, key) => {
      acc[key] = vnp_Params[key];
      return acc;
    }, {} as Record<string, string>);

  const signData = new URLSearchParams(sortedParams).toString();
  
  const crypto = await import("crypto");
  const signature = crypto.createHmac("sha512", secretKey).update(signData).digest("hex");

  const paymentUrl = `${vnpUrl}?${signData}&vnp_SecureHash=${signature}`;

  return NextResponse.json(
    {
      paymentId: orderId,
      payUrl: paymentUrl,
      method: "vnpay",
      status: "pending",
    },
    { status: httpStatus.OK }
  );
}

