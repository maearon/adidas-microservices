import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import httpStatus from "http-status"

/**
 * GET /api/v1/admin/products/[productId]/translations
 * Get all translations for a product
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params

    const translations = await prisma.product_translations.findMany({
      where: {
        product_id: BigInt(productId),
      },
      orderBy: {
        locale: "asc",
      },
    })

    return NextResponse.json(
      {
        translations: translations.map((t) => ({
          id: t.id.toString(),
          productId: t.product_id?.toString(),
          locale: t.locale,
          data: t.data,
        })),
      },
      { status: httpStatus.OK }
    )
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch translations"

    return NextResponse.json(
      { message },
      { status: httpStatus.INTERNAL_SERVER_ERROR }
    )
  }
}

/**
 * POST /api/v1/admin/products/[productId]/translations
 * Create or update a translation for a product
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params
    const body = await req.json()
    const { locale, data } = body

    if (!locale || !data) {
      return NextResponse.json(
        { message: "Missing required fields: locale, data" },
        { status: httpStatus.BAD_REQUEST }
      )
    }

    // Upsert translation
    const translation = await prisma.product_translations.upsert({
      where: {
        product_id_locale: {
          product_id: BigInt(productId),
          locale,
        },
      },
      update: {
        data,
      },
      create: {
        product_id: BigInt(productId),
        locale,
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
      error instanceof Error ? error.message : "Failed to save translation"

    return NextResponse.json(
      { message },
      { status: httpStatus.INTERNAL_SERVER_ERROR }
    )
  }
}

