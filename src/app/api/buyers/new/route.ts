import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { fullName, email, phone, city, propertyType, bhk, purpose, budgetMin, budgetMax, timeline, source, notes, tags } = await request.json();

    const buyerLead = await prisma.buyer.create({
      data: {
        fullName,
        email,
        phone,
        city,
        propertyType,
        bhk,
        purpose,
        budgetMin,
        budgetMax,
        timeline,
        source,
        notes,
        tags,
        ownerId: "e4617870-7613-437e-beb5-5f0b93ff7864",
      },
    });

    if (!buyerLead) {
      return Response.json(
        {
          success: false,
          message: "Failed to create buylead",
        },
        {
          status: 500,
        }
      );
    }
    return Response.json(
      {
        success: false,
        message: "Buylead created successfully",
        data: buyerLead,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Failed to create buyer lead:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to create buylead",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
