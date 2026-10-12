// Imports
import "dotenv/config";
import express from "express";
import cors from "cors";
import { Pool } from "pg";

// App and Database Setup
const app = express();

const pool = new Pool({
  user: "postgres",
  password: process.env.DB_PASSWORD,
  host: "localhost",
  port: 5432,
  database: "nutrition_tracker",
});

// Test database connection
pool.query("SELECT NOW()", (error, result) => {
  if (error) {
    console.error("Database connection failed:", error);
  } else {
    console.log("Database connected:", result.rows[0]);
  }
});

// Middleware
app.use(cors());

// Basic Routes

// Backend health check
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

// Food API Routes

// Search Open Food Facts
app.get("/api/foods", async (req, res) => {
  try {
    const search = req.query.search;

    // Request matching foods from Open Food Facts
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(search)}&json=1&page_size=25`,
    );

    if (!response.ok) {
      console.error("Open Food Facts error:", response.status);

      return res.status(502).json({
        error: "Food search service failed",
      });
    }

    const data = await response.json();

    // Format food data for the frontend
    const foods = data.products
      .map((product) => ({
        name: product.product_name
          ?.toLowerCase()
          .includes(product.brands?.toLowerCase())
          ? product.product_name
          : `${product.brands} ${product.product_name}`,

        grams: product.product_quantity,
        calories: product.nutriments?.["energy-kcal_100g"],
        protein: product.nutriments?.["proteins_100g"],
        carbs: product.nutriments?.["carbohydrates_100g"],
        fat: product.nutriments?.["fat_100g"],
      }))
      .filter(
        (food) =>
          food.grams != null &&
          food.calories != null &&
          food.protein != null &&
          food.carbs != null &&
          food.fat != null,
      );

    res.json(foods);
  } catch (error) {
    console.error("Food search failed:", error);

    res.status(500).json({
      error: "Failed to search foods",
    });
  }
});

// Database Test Routes

// Get all foods from PostgreSQL
app.get("/api/test-foods", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM foods");

    res.json(result.rows);
  } catch (error) {
    console.error("Database query failed:", error);

    res.status(500).json({
      error: "Database query failed",
    });
  }
});

// Start Server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
