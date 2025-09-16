import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const { id } = await params;
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
      where: { id },
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
      where: { id },
      data,
    });

    const diff: Record<string, { old: any; new: any }> = {};

    for (const key in buyer) {
      const parsedKey = key as keyof typeof buyer;

      if (buyer[parsedKey] !== updatedBuyerLead[parsedKey]) {
        diff[parsedKey] = {
          old: buyer[parsedKey],
          new: updatedBuyerLead[parsedKey],
        };
      }
    }

    await prisma.buyerHistory.create({
      data: {
        buyerId: id,
        changedBy: user?.id as string,
        diff,
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
    const { id } = await params;
    const buyer = await prisma.buyer.findUnique({
      where: { id },
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

    const history = await prisma.buyerHistory.findMany({
      where: {
        buyerId: id,
      },
      orderBy: {
        changedAt: "desc",
      },
      take: 5,
    });

    return Response.json(
      {
        success: false,
        message: "Buylead fetched successfully",
        data: buyer,
        history,
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
