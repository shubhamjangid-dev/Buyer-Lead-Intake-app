import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();

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

    const buyer = await prisma.buyer.findUnique({
      where: { id: params.id },
    });

    if (!buyer) {
      return Response.json(
        {
          success: false,
          message: "buylead not found",
        },
        {
          status: 404,
        }
      );
    }

    if (buyer.ownerId != user?.id) {
      return Response.json(
        {
          success: false,
          message: "Not Authorised",
        },
        {
          status: 401,
        }
      );
    }

    const updatedBuyerLead = await prisma.buyer.update({
      where: { id: params.id },
      data,
    });

    await prisma.buyerHistory.create({
      data: {
        buyerId: params.id,
        changedBy: "e4617870-7613-437e-beb5-5f0b93ff7864", // current user ID
        diff: {
          old: buyer,
          new: updatedBuyerLead,
        },
      },
    });
    if (!updatedBuyerLead) {
      return Response.json(
        {
          success: false,
          message: "Failed to update buylead",
        },
        {
          status: 500,
        }
      );
    }
    return Response.json(
      {
        success: false,
        message: "Buylead updated successfully",
        data: updatedBuyerLead,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error occured while updating buyer lead:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to update buylead",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const buyer = await prisma.buyer.findUnique({
      where: { id: params.id },
    });
    if (!buyer) {
      return Response.json(
        {
          success: false,
          message: "buylead not found",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        success: false,
        message: "Buylead fetched successfully",
        data: buyer,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error occured while fetching buyer lead:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to fetch buylead",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
