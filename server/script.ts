import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const main = async () => {
  await prisma.user.deleteMany();
  const user = await prisma.user.create({
    data: {
      name: "Ed",
      email: "ed@test.com",
      age: 25,
      userPreference: {
        create: {
          emailUpdates: true,
        },
      },
    },
    select: {
      name: true,
      userPreference: { select: { id: true } },
    },
  });

  console.log(user);
};

try {
  main();
} catch (err) {
  console.log(err);
}
