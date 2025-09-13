import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const allBuyerLead = await prisma.buyer.findMany({
      orderBy: { updatedAt: "desc" },
    });

    if (!allBuyerLead) {
      return Response.json(
        {
          success: false,
          message: "Failed to get all buylead",
        },
        {
          status: 500,
        }
      );
    }
    return Response.json(
      {
        success: false,
        message: "Buylead fetched successfully",
        data: allBuyerLead,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Failed to fetch all buyer lead:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to fetch all buylead",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
