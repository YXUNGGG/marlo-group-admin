import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    // This command tells Prisma how to execute your seed file
    seed: "tsx prisma/seed.ts",
  },
});