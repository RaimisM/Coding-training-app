import "dotenv/config";
import { prisma } from "./db";

async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log("DB connection successful! Users:", users);
  } catch (err) {
    console.error("DB connection failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();