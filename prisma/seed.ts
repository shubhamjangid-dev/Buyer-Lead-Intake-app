import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: {
      email: "test@test.com",
    },
    update: {},
    create: {
      email: "test@test.com",
      fullName: "test",
      password: "test@123",
    },
  });
  console.log({ user });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async e => {
    console.log(`ERROR :: ${e}`);
    await prisma.$disconnect();
    process.exit(1);
  });
