const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Create or update test user
  await prisma.user.upsert({
    where: {
      id: "user_test_pro_id",
    },
    update: {},
    create: {
      id: "user_test_pro_id",
      email: "test@gmail.com",
      name: "Test User",
      role: "USER",
    },
  });

  // Create or update subscription
  await prisma.subscription.upsert({
    where: {
      userId: "user_test_pro_id",
    },
    update: {
      status: "ACTIVE",
      tier: "PRO",
      wordTokensRemaining: 500000,
    },
    create: {
      userId: "user_test_pro_id",
      stripeCustomerId: "cus_test_001",
      tier: "PRO",
      status: "ACTIVE",
      wordTokensRemaining: 500000,
    },
  });

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });