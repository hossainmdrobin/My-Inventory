import mongoose from "mongoose"
import Product from "../models/Product.js"
const suppliers = [
    "6996c4d509068ee46611dcbe",
    "6996c4eb09068ee46611dcc1",
    "6996c51609068ee46611dcc4",
];

const categories = [
    "Electronics",
    "Accessories",
    "Office",
    "Stationery",
    "Groceries",
    "Clothing",
];

export function generateProducts(count = 100) {
    const products = [];

    for (let i = 1; i <= count; i++) {
        const cost = Math.floor(Math.random() * 50) + 5;
        const price = cost + Math.floor(Math.random() * 20) + 5;

        products.push({
            name: `Demo Product ${i}`,
            sku: `SKU-${String(i).padStart(3, "0")}`,
            category: categories[i % categories.length],
            stock: Math.floor(Math.random() * 200),
            costPrice: cost,
            sellingPrice: price,
            supplier: suppliers[i % suppliers.length],
            unit: "pcs",
        });
    }

    return products;
}

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/myinventory", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as mongoose.ConnectOptions);

        console.log("🌱 Seeding database...");

        const products = generateProducts(100);


        // Insert initial products
        await Product.insertMany(products);
        // Insert some specific products for testin

        console.log("✅ Seed completed!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seed failed:", error);
        process.exit(1);
    }
}

seed();