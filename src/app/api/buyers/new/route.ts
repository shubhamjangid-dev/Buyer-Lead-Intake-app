import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(request: Request) {
  try {
    const { fullName, email, phone, city, propertyType, bhk, purpose, budgetMin, budgetMax, timeline, source, notes, tags } = await request.json();

    const session = await getServerSession(authOptions);

    const user = session?.user;

    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          message: "Not Authenticated",
        },
        {
          status: 401,
        }
      );
    }

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
        ownerId: user?.id as string,
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
        success: true,
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
