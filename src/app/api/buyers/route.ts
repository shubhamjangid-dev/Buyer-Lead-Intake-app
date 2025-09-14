import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page") ?? 1);
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const city = searchParams.get("city");
    const propertyType = searchParams.get("propertyType");
    const status = searchParams.get("status");
    const timeline = searchParams.get("timeline");

    const search = searchParams.get("search");

    const where: any = {
      ...(city ? { city } : {}),
      ...(propertyType ? { propertyType } : {}),
      ...(status ? { status } : {}),
      ...(timeline ? { timeline } : {}),
      ...(search
        ? {
            OR: [{ fullName: { contains: search, mode: "insensitive" } }, { phone: { contains: search } }, { email: { contains: search, mode: "insensitive" } }],
          }
        : {}),
    };

    const allBuyerLead = await prisma.buyer.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { updatedAt: "desc" },
    });
    const totalCount = await prisma.buyer.count({ where });

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
        allBuyerLead,
        totalCount,
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
