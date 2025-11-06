import { NextRequest, NextResponse } from "next/server";
import httpStatus from "http-status";

/**
 * GET /api/v1/payments/webhook/vnpay
 * Handle VNPay payment callback (VNPay uses GET for return URL)
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const vnp_Params: Record<string, string> = {};

    // Get all VNPay params
    for (const [key, value] of searchParams.entries()) {
      if (key.startsWith("vnp_")) {
        vnp_Params[key] = value;
      }
    }

    const secretKey = process.env.VNPAY_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { message: "VNPay secret key not configured" },
        { status: httpStatus.INTERNAL_SERVER_ERROR }
      );
    }

    // Verify signature
    const vnp_SecureHash = vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHash"];

    const sortedParams = Object.keys(vnp_Params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = vnp_Params[key];
        return acc;
      }, {} as Record<string, string>);

    const signData = new URLSearchParams(sortedParams).toString();
    const crypto = await import("crypto");
    const signature = crypto.createHmac("sha512", secretKey).update(signData).digest("hex");

    if (signature !== vnp_SecureHash) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: httpStatus.BAD_REQUEST }
      );
    }

    const responseCode = vnp_Params["vnp_ResponseCode"];
    const orderId = vnp_Params["vnp_TxnRef"];

    if (responseCode === "00") {
      // Payment successful
      return NextResponse.json(
        { message: "Payment successful", orderId },
        { status: httpStatus.OK }
      );
    } else {
      // Payment failed
      return NextResponse.json(
        { message: "Payment failed", responseCode },
        { status: httpStatus.BAD_REQUEST }
      );
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to process webhook";

    return NextResponse.json(
      { message },
      { status: httpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

