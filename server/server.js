// Imports
import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { Pool } from "pg";
import session from "express-session";

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
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// Setup Using Express-Session To Remember Logged In Users
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
);

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

// Send back logged foods from database
app.get("/api/food-logs", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not logged in" });
  }

  try {
    const result = await pool.query(
      `SELECT
        id, food_name AS name, grams, calories,
        carbs, protein, fat, meal, logged_at
       FROM food_logs
       WHERE user_id = $1 AND meal = $2`,
      [req.session.userId, req.query.meal],
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Failed to load food logs:", error);
    res.status(500).json({ error: "Failed to load food logs" });
  }
});

// Save a logged food to PostgreSQL.
app.post("/api/food-logs", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const { name, grams, calories, protein, carbs, fat, meal } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO food_logs
            (food_name, grams, calories, carbs, protein, fat, meal, user_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING
                id,
                food_name AS name,
                grams,
                calories,
                carbs,
                protein,
                fat,
                meal,
                logged_at,
                user_id`,
      [name, grams, calories, carbs, protein, fat, meal, req.session.userId],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Failed to save food:", error);
    res.status(500).json({ error: "Failed to save food" });
  }
});

// Adds a user to PostgreSQL For Registration.
app.post("/api/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }

  const cleanFirstName = firstName.trim();
  const cleanLastName = lastName.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanFirstName || !cleanLastName || !cleanEmail || !password) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }

  if (password.length < 8 || password.length > 72) {
    return res.status(400).json({
      error: "Password must be between 8 and 72 characters",
    });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users
        (first_name, last_name, email, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, first_name, last_name, email`,
      [
        cleanFirstName.trim(),
        cleanLastName.trim(),
        cleanEmail.trim().toLowerCase(),
        passwordHash,
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        error: "An account with this email already exists",
      });
    }

    console.error("Failed to register user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// Validates Log In Data
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name, email, password_hash
       FROM users
       WHERE email = $1`,
      [email.trim().toLowerCase()],
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    req.session.userId = user.id;

    res.json({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
    });
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Logs Out A User
app.post("/api/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("Logout failed:", error);
      return res.status(500).json({ error: "Logout failed" });
    }

    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
});

// Start Server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
