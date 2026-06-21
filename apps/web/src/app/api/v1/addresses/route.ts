export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import httpStatus from "http-status";
import { connectToDatabase } from "@/lib/mongoose";
import { auth } from "@/lib/auth";
import Address from "@/models/address.model";

/**
 * GET /api/v1/addresses
 * Get all addresses for the authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: httpStatus.UNAUTHORIZED }
      );
    }

    const addresses = await Address.find({ userId: session.user.id })
      .sort({ isDefault: -1, createdAt: -1 })
      .lean();

    return NextResponse.json(
      { addresses },
      { status: httpStatus.OK }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch addresses";

    return NextResponse.json(
      { message },
      { status: httpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

/**
 * POST /api/v1/addresses
 * Create a new address for the authenticated user
 */
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: httpStatus.UNAUTHORIZED }
      );
    }

    const userId = session.user.id;
    const body = await req.json();
    const {
      firstName,
      lastName,
      street,
      apartment,
      city,
      state,
      zipCode,
      country = "US",
      phone,
      isDefault = false,
      type = "delivery",
      latitude,
      longitude,
    } = body;

    // Validation
    if (!firstName || !lastName || !street || !city || !state || !zipCode || !phone) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: httpStatus.BAD_REQUEST }
      );
    }

    // If this is set as default, unset other defaults
    if (isDefault) {
      await Address.updateMany(
        { userId },
        { $set: { isDefault: false } }
      );
    }

    const address = new Address({
      userId,
      firstName,
      lastName,
      street,
      apartment,
      city,
      state,
      zipCode,
      country,
      phone,
      isDefault,
      type,
      latitude,
      longitude,
    });

    await address.save();

    return NextResponse.json(
      { address },
      { status: httpStatus.CREATED }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create address";

    return NextResponse.json(
      { message },
      { status: httpStatus.BAD_REQUEST }
    );
  }
}

