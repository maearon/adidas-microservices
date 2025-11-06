import { NextRequest, NextResponse } from "next/server";
import httpStatus from "http-status";
import { connectToDatabase } from "@/lib/mongoose";
import Address from "@/models/address.model.js";

/**
 * POST /api/v1/payments/webhook/momo
 * Handle MoMo payment webhook
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resultCode, orderId, amount, transId } = body;

    // Verify signature (should verify in production)
    const secretKey = process.env.MOMO_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { message: "MoMo secret key not configured" },
        { status: httpStatus.INTERNAL_SERVER_ERROR }
      );
    }

    // Update payment status in database
    // Publish event to RabbitMQ if needed

    if (resultCode === 0) {
      // Payment successful
      return NextResponse.json(
        { message: "Payment successful", orderId, transId },
        { status: httpStatus.OK }
      );
    } else {
      // Payment failed
      return NextResponse.json(
        { message: "Payment failed", resultCode },
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

