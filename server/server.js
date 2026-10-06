// the backened of my workout-tracker, using express framework 
import express from "express";
import cors from "cors";

// pool is to manage connections to SQL database
import { Pool } from "pg"; // using package postgre, this line says, load package pg, grab pool that comes from it and put it into variable pool

const app = express(); // creates an Express application instance, lets you use express

const pool = new Pool({
    user: "postgres",
    password: "ASDpoi339$",
    host: "localhost",
    port: 5432,
    database: "nutrition_tracker"
});

pool.query("SELECT NOW()", (error, result) => {
    if (error) {
        console.error("Database connection failed:", error);
    } else {
        console.log("Database connected:", result.rows[0]);
    }
});

app.use(cors());

// gets user request, req holds info about visitor, response holds tools to send data back to visitor
app.get("/", (req, res) => {
    res.send("Backend is working!");
});

// another get route but at /api/foods
app.get("/api/foods", async (req, res) => {
    const search = req.query.search; // extracts parameter from url, basically the string user typed

    // requests to API, encodeURIComponent(search) makes sure special characters don't break URL, await just waits to make sure everything loads in order
    const response = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(search)}&json=1&page_size=25`
    );

    // if something went wrong with API, let us know something is wrong
    if (!response.ok) {
        console.log("Open Food Facts error:", response.status);
        return res.status(response.status).json({
            error: `Open Food Facts returned ${response.status}`
        });
    }

    // reponse is fine now, convert to json and return result to us
    const data = await response.json();

    // filter the data to only give us cal, pro, carb and fats
    const foods = data.products.map(product => ({

        // My food API sometimes will do, search for dorito, it only returns the word "cheese" with no context so, add searched food in name if doesn't exist
        name: product.product_name?.toLowerCase().includes(product.brands?.toLowerCase())
            ? product.product_name
            : `${product.brands} ${product.product_name}`,   // backticks allow variables to be put in strings more conveniently  

        grams: product.product_quantity,
        calories: product.nutriments?.["energy-kcal_100g"],
        protein: product.nutriments?.["proteins_100g"],
        carbs: product.nutriments?.["carbohydrates_100g"],
        fat: product.nutriments?.["fat_100g"]
    }))
    // Makes sure the food item we get has all nutritional data or else we can't track it properly
    .filter(food =>
        food.grams != null &&
        food.calories != null &&
        food.protein != null &&
        food.carbs != null &&
        food.fat != null
    );

    // take filtered data and send it to us
    res.json(foods);

});

// test route for PostgreSQL foods table
app.get("/api/test-foods", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM foods");

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database query failed" });
    }
});

// waits to see that server works then lets me know on terminal whenever
app.listen(3000, () => {
    console.log("Server running on port 3000");
});