import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import httpStatus from "http-status"

/**
 * GET /api/v1/admin/products/[productId]/translations/[locale]
 * Get a specific translation
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { productId: string; locale: string } }
) {
  try {
    const { productId, locale } = params

    const translation = await prisma.product_translations.findUnique({
      where: {
        product_id_locale: {
          product_id: BigInt(productId),
          locale,
        },
      },
    })

    if (!translation) {
      return NextResponse.json(
        { message: "Translation not found" },
        { status: httpStatus.NOT_FOUND }
      )
    }

    return NextResponse.json(
      {
        translation: {
          id: translation.id.toString(),
          productId: translation.product_id?.toString(),
          locale: translation.locale,
          data: translation.data,
        },
      },
      { status: httpStatus.OK }
    )
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch translation"

    return NextResponse.json(
      { message },
      { status: httpStatus.INTERNAL_SERVER_ERROR }
    )
  }
}

/**
 * PUT /api/v1/admin/products/[productId]/translations/[locale]
 * Update a translation
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { productId: string; locale: string } }
) {
  try {
    const { productId, locale } = params
    const body = await req.json()
    const { data } = body

    if (!data) {
      return NextResponse.json(
        { message: "Missing required field: data" },
        { status: httpStatus.BAD_REQUEST }
      )
    }

    const translation = await prisma.product_translations.update({
      where: {
        product_id_locale: {
          product_id: BigInt(productId),
          locale,
        },
      },
      data: {
        data,
      },
    })

    return NextResponse.json(
      {
        translation: {
          id: translation.id.toString(),
          productId: translation.product_id?.toString(),
          locale: translation.locale,
          data: translation.data,
        },
      },
      { status: httpStatus.OK }
    )
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update translation"

    return NextResponse.json(
      { message },
      { status: httpStatus.INTERNAL_SERVER_ERROR }
    )
  }
}

/**
 * DELETE /api/v1/admin/products/[productId]/translations/[locale]
 * Delete a translation
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { productId: string; locale: string } }
) {
  try {
    const { productId, locale } = params

    await prisma.product_translations.delete({
      where: {
        product_id_locale: {
          product_id: BigInt(productId),
          locale,
        },
      },
    })

    return NextResponse.json(
      { message: "Translation deleted successfully" },
      { status: httpStatus.OK }
    )
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete translation"

    return NextResponse.json(
      { message },
      { status: httpStatus.INTERNAL_SERVER_ERROR }
    )
  }
}

