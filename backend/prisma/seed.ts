import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import axios from "axios";
import "dotenv/config";

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool as any);
  const prisma = new PrismaClient({ adapter });

  console.log(
    "📡 PUNK RECORDS : Lancement du protocole d'aspiration des fruits...",
  );

  try {
    // 1. Récupération des données depuis l'API v2
    const response = await axios.get(
      "https://api.api-onepiece.com/v2/fruits/fr",
    );
    const fruits = response.data;

    console.log(
      `🧬 ${fruits.length} fruits détectés. Analyse du facteur lignage en cours...`,
    );

    // 2. Boucle pour insérer chaque fruit
    for (const fruit of fruits) {
      // Nettoyage rapide du type pour coller à tes Enums
      let fruitType: "Paramecia" | "Logia" | "Zoan" = "Paramecia";
      const apiType = fruit.type?.toLowerCase() || "";

      if (apiType.includes("zoan")) fruitType = "Zoan";
      else if (apiType.includes("logia")) fruitType = "Logia";

      await prisma.devilFruit.upsert({
        where: { originalName: fruit.name },
        update: {}, // On ne touche à rien si le fruit existe déjà
        create: {
          originalName: fruit.name,
          translatedName: fruit.roman_name || fruit.name,
          type: fruitType,
          description:
            fruit.description || "Données manquantes dans les archives.",
          ability: fruit.description
            ? fruit.description.substring(0, 150)
            : "Capacité inconnue.",
          imageUrl: fruit.filename || null,
          rarity: "RARE", // Par défaut
          user: "Inconnu", // L'API v2 ne donne pas toujours l'utilisateur direct
        },
      });
    }

    console.log("✅ MISSION ACCOMPLIE : La base de données est pleine !");
  } catch (error) {
    console.error("❌ ERREUR CRITIQUE :", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

seed();
