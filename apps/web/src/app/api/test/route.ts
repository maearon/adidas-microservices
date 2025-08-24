import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    console.log("Test route called");
    
    // Simple test query
    const productCount = await prisma.products.count();
    console.log("Product count:", productCount);
    
    // Test with filters
    const testProducts = await prisma.products.findMany({
      where: {
        gender: { in: ['men'] },
        category: { in: ['shoes'] }
      },
      take: 5,
      select: {
        id: true,
        name: true,
        gender: true,
        category: true
      }
    });
    
    console.log("Test products found:", testProducts.length);
    
    return Response.json({
      success: true,
      productCount,
      testProducts,
      message: "Database connection working"
    });
    
  } catch (error) {
    console.error("Test route error:", error);
    return Response.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
