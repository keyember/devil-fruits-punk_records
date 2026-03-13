import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma", // Juste la string, pas d'objet !
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
