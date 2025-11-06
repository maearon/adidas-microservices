export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import httpStatus from "http-status";
import { connectToDatabase } from "@/lib/mongoose";
import { requireUserFromRequest } from "@/lib/utils/getUserFromRequest";
import Address, { IAddress } from "@/models/Address";

/**
 * GET /api/v1/addresses/[addressId]
 * Get a specific address by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { addressId: string } }
) {
  try {
    await connectToDatabase();

    const userId = await requireUserFromRequest(req);
    const { addressId } = params;

    const address = await Address.findOne({
      _id: addressId,
      userId,
    }).lean();

    if (!address) {
      return NextResponse.json(
        { message: "Address not found" },
        { status: httpStatus.NOT_FOUND }
      );
    }

    return NextResponse.json(
      { address },
      { status: httpStatus.OK }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch address";

    return NextResponse.json(
      { message },
      { status: httpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

/**
 * PUT /api/v1/addresses/[addressId]
 * Update an existing address
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { addressId: string } }
) {
  try {
    await connectToDatabase();

    const userId = await requireUserFromRequest(req);
    const { addressId } = params;

    const body = await req.json();
    const {
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
    } = body;

    // Find address and verify ownership
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

    // Update fields
    if (firstName !== undefined) address.firstName = firstName;
    if (lastName !== undefined) address.lastName = lastName;
    if (street !== undefined) address.street = street;
    if (apartment !== undefined) address.apartment = apartment;
    if (city !== undefined) address.city = city;
    if (state !== undefined) address.state = state;
    if (zipCode !== undefined) address.zipCode = zipCode;
    if (country !== undefined) address.country = country;
    if (phone !== undefined) address.phone = phone;
    if (type !== undefined) address.type = type;
    if (latitude !== undefined) address.latitude = latitude;
    if (longitude !== undefined) address.longitude = longitude;

    // Handle isDefault - if setting to true, unset others
    if (isDefault !== undefined) {
      address.isDefault = isDefault;
      if (isDefault) {
        await Address.updateMany(
          { userId, _id: { $ne: addressId } },
          { $set: { isDefault: false } }
        );
      }
    }

    await address.save();

    return NextResponse.json(
      { address },
      { status: httpStatus.OK }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update address";

    return NextResponse.json(
      { message },
      { status: httpStatus.BAD_REQUEST }
    );
  }
}

/**
 * DELETE /api/v1/addresses/[addressId]
 * Delete an address
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { addressId: string } }
) {
  try {
    await connectToDatabase();

    const userId = await requireUserFromRequest(req);
    const { addressId } = params;

    const address = await Address.findOneAndDelete({
      _id: addressId,
      userId,
    });

    if (!address) {
      return NextResponse.json(
        { message: "Address not found" },
        { status: httpStatus.NOT_FOUND }
      );
    }

    return NextResponse.json(
      { message: "Address deleted successfully" },
      { status: httpStatus.OK }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete address";

    return NextResponse.json(
      { message },
      { status: httpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

