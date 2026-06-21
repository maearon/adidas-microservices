export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import httpStatus from "http-status";
import { connectToDatabase } from "@/lib/mongoose";
import { auth } from "@/lib/auth";
import Address from "@/models/address.model";

/**
 * PUT /api/v1/addresses/default
 * Set an address as default for the user
 */
export async function PUT(req: NextRequest) {
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
    const { addressId } = body;

    if (!addressId) {
      return NextResponse.json(
        { message: "addressId is required" },
        { status: httpStatus.BAD_REQUEST }
      );
    }

    // Verify address belongs to user
    const address = await Address.findOne({
      _id: addressId,
      userId,
    });

    if (!address) {
      return NextResponse.json(
        { message: "Address not found" },
        { status: httpStatus.NOT_FOUND }
      );
    }

    // Unset all other defaults
    await Address.updateMany(
      { userId, _id: { $ne: addressId } },
      { $set: { isDefault: false } }
    );

    // Set this address as default
    address.isDefault = true;
    await address.save();

    return NextResponse.json(
      { address },
      { status: httpStatus.OK }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to set default address";

    return NextResponse.json(
      { message },
      { status: httpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

