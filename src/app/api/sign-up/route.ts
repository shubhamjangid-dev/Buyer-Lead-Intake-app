import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs"; // install bcryptjs

export async function POST(request: Request) {
  try {
    const { fullName, email, password } = await request.json();

    // Basic validation
    if (!fullName || !email || !password) {
      return Response.json({ success: false, message: "All fields are required" }, { status: 400 });
    }

    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return Response.json({ success: false, message: "Email already exists" }, { status: 400 });
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
      },
    });

    return Response.json({ success: true, user: { id: newUser.id, fullName, email } }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
