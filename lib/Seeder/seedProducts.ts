import mongoose from "mongoose";
import Product from "../../models/Product";
import { connectToDB } from "../../db";
import fs from "fs/promises";
import path from "path";

const JSON_FILE_PATH = path.join(process.cwd(), "lib", "Seeder", "products_with_stock.json");

interface RawProduct {
  institute: { $oid: string };
  name: string;
  sku: string;
  stock: number;
  costPrice: number;
  sellingPrice: number;
  supplier: { $oid: string };
  unit: string;
}

function transformProduct(raw: RawProduct) {
  return {
    institute: new mongoose.Types.ObjectId(raw.institute.$oid),
    name: raw.name,
    sku: raw.sku,
    stock: raw.stock,
    costPrice: raw.costPrice,
    sellingPrice: raw.sellingPrice,
    supplier: new mongoose.Types.ObjectId(raw.supplier.$oid),
    unit: raw.unit,
  };
}

const seedProducts = async () => {
  try {
    await connectToDB();

    const fileContent = await fs.readFile(JSON_FILE_PATH, "utf-8");
    const rawProducts: RawProduct[] = JSON.parse(fileContent);

    if (!Array.isArray(rawProducts)) {
      throw new Error("Invalid JSON format: expected an array of products");
    }

    const products = rawProducts.map(transformProduct);

    const result = await Product.insertMany(products, { ordered: false });

    console.log(`Successfully seeded ${result.length} products.`);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Seeding failed:", error.message);
    } else {
      console.error("Seeding failed:", error);
    }
    process.exit(1);
  }
};

seedProducts();
