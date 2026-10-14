import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

type Food = {
  id: number;
  name: string;
  grams: number;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  meal: string;
  logged_at: string;
};

// Main breakfast page
function Breakfast() {
  // Navigation
  const navigate = useNavigate();

  // Panel visibility and animations
  const [isAddFoodPanelOpen, setIsAddFoodPanelOpen] = useState(false);
  const [isClosingAddFoodPanel, setIsClosingAddFoodPanel] = useState(false);
  const [isClosingSelectedFoodPanel, setIsClosingSelectedFoodPanel] =
    useState(false);
  const [isClosingMealPage, setIsClosingMealPage] = useState(false);

  // Food search and selection
  const [searchQuery, setSearchQuery] = useState("");

  const [searchResults, setSearchResults] = useState<Food[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);

  // Food quantity and logged foods
  const [gramsInput, setGramsInput] = useState("");
  const [loggedFoods, setLoggedFoods] = useState<Food[]>([]);

  // Call for logged foods from database on launch
  useEffect(() => {
    async function loadLoggedFoods() {
      const response = await fetch(
        "http://localhost:3000/api/food-logs?meal=Breakfast",
      );

      if (!response.ok) {
        throw new Error("Failed to load food logs");
      }

      const foods: Food[] = (await response.json()).map((food: Food) => ({
        ...food,
        grams: Number(food.grams),
        calories: Number(food.calories),
        carbs: Number(food.carbs),
        protein: Number(food.protein),
        fat: Number(food.fat),
      }));

      setLoggedFoods(foods);
    }

    loadLoggedFoods().catch(console.error);
  }, []);

  // Calculate the selected food's macros using the entered quantity.
  // Food values returned by the API are 100g if there are no entered quantities.
  const enteredGrams = gramsInput === "" ? 100 : Number(gramsInput);

  const calculatedFood: Food | null = selectedFood
    ? {
        id: selectedFood.id,
        name: selectedFood.name,
        grams: enteredGrams,
        calories: (enteredGrams / 100) * selectedFood.calories,
        carbs: (enteredGrams / 100) * selectedFood.carbs,
        protein: (enteredGrams / 100) * selectedFood.protein,
        fat: (enteredGrams / 100) * selectedFood.fat,
        meal: selectedFood.meal,
        logged_at: selectedFood.logged_at,
      }
    : null;

  // Close the add-food panel after its animation.
  const closeAddFoodPanel = () => {
    setIsClosingAddFoodPanel(true);

    setTimeout(() => {
      setIsAddFoodPanelOpen(false);
      setIsClosingAddFoodPanel(false);
    }, 140);
  };

  // Close the selected-food panel.
  const closeSelectedFoodPanel = () => {
    setIsClosingSelectedFoodPanel(true);

    setTimeout(() => {
      setSelectedFood(null);
      setIsClosingSelectedFoodPanel(false);
      setGramsInput("");
    }, 140);
  };

  // Return to the previous page.
  const closeMealPage = () => {
    setIsClosingMealPage(true);

    setTimeout(() => {
      navigate(-1);
      setIsClosingMealPage(false);
    }, 140);
  };

  // Search the backend for foods.
  const searchFoods = async () => {
    try {
      const searchParams = new URLSearchParams({
        search: searchQuery,
      });

      const response = await fetch(
        `http://localhost:3000/api/foods?${searchParams}`,
      );

      if (!response.ok) {
        throw new Error("Food search failed.");
      }

      const responseData: unknown = await response.json();

      if (Array.isArray(responseData)) {
        setSearchResults(responseData as Food[]);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching for foods:", error);
      setSearchResults([]);
    }
  };

  // Add the selected food to breakfast.
  const handleLogFood = async () => {
    if (!calculatedFood || !selectedFood) {
      return;
    }

    const response = await fetch("http://localhost:3000/api/food-logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...calculatedFood,
        meal: "Breakfast",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save food");
    }

    const savedFood: Food = await response.json();

    setLoggedFoods((previousLoggedFoods) => [
      ...previousLoggedFoods,
      savedFood,
    ]);

    setGramsInput("");
    closeAddFoodPanel();

    setTimeout(() => {
      setSelectedFood(null);
    }, 140);
  };

  // Calculate total calories and macros for breakfast.
  const mealTotals = loggedFoods.reduce(
    (total, food) => ({
      calories: total.calories + food.calories,
      carbs: total.carbs + food.carbs,
      protein: total.protein + food.protein,
      fat: total.fat + food.fat,
    }),
    {
      calories: 0,
      carbs: 0,
      protein: 0,
      fat: 0,
    },
  );

  return (
    <div
      className={
        isClosingMealPage
          ? "meal-page slide-right-animation"
          : "meal-page slide-left-animation"
      }
    >
      {/* Page header */}
      <div className="selected-meal-bar">
        <button
          className="back-button"
          onClick={closeMealPage} // go back a page when clicked
        >
          &lt;
        </button>

        <p className="selected-meal-name">Breakfast</p>

        <button className="more-button">
          <span>⋯</span>
        </button>
      </div>

      {/* Date navigation */}
      <p className="date">Date rotator</p>

      {/* Logged foods and meal totals */}
      <div className="logged-food-section">
        {loggedFoods.map((food, index) => (
          <div className="logged-foods" key={index}>
            <h3 className="logged-name">{food.name}</h3>

            <div className="show-logged-cal-quan">
              <p className="logged-calories">
                {Math.round(food.calories)} cals
              </p>

              <p className="logged-quantity">{Math.round(food.grams)}g</p>
            </div>
          </div>
        ))}

        <div className="calorie-sum-box">
          <div className="word-meal-total">Breakfast Total</div>

          <div className="word-total-cals">
            {Math.round(mealTotals.calories)} cals
          </div>
        </div>

        <div className="macro-sum-box">
          <p className="word-meal-macros">Breakfast Macros</p>

          <p className="word-carbs">Carbs: {Math.round(mealTotals.carbs)}g</p>

          <p className="word-protein">
            Protein: {Math.round(mealTotals.protein)}g
          </p>

          <p className="word-fat">Fat: {Math.round(mealTotals.fat)}g</p>
        </div>

        <button
          className="add-button"
          onClick={() => setIsAddFoodPanelOpen(true)} // when clicked turn state to true
        >
          +
        </button>
      </div>

      {/* Food Searching Panel */}
      {isAddFoodPanelOpen && (
        <div
          className={
            isClosingAddFoodPanel
              ? "add-food-panel slide-down-animation"
              : "add-food-panel slide-up-animation"
          }
        >
          <button
            className="close-food-search-button"
            onClick={closeAddFoodPanel}
          >
            X
          </button>

          <div className="food-search-word">Food Search</div>

          <div className="big-search-word">Search</div>

          {/* Food search input */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for a food"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  searchFoods();
                }
              }}
            />
          </div>

          {/* Search results */}
          <div className="food-results">
            {searchResults.map((food, index) => (
              <button
                className="food-result"
                key={index}
                onClick={() => {
                  setSelectedFood(food);
                  setGramsInput("");
                }}
              >
                <div className="food-name">
                  <div className="food-name-text">{food.name}</div>
                </div>

                <div className="food-stats">
                  <p className="calories">{Math.round(food.calories)} cals</p>

                  <div className="food-grams">
                    <p>100g</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Logging-food panel */}
          {selectedFood && (
            <div
              className={
                isClosingSelectedFoodPanel
                  ? "selected-food slide-right-animation"
                  : "selected-food slide-left-animation"
              }
            >
              <button
                className="close-logging-food-button"
                onClick={closeSelectedFoodPanel}
              >
                X
              </button>

              <h2 className="selected-name">{selectedFood.name}</h2>

              {/* Quantity and calories */}
              <div className="cal-calc">
                <div className="user-grams">
                  <input
                    className="grams-bar"
                    type="number"
                    min="0"
                    placeholder="grams"
                    value={gramsInput}
                    onChange={(event) => setGramsInput(event.target.value)}
                  />

                  <h2 className="show-grams">{enteredGrams} grams</h2>
                </div>
                {calculatedFood && (
                  <div className="user-calories">
                    <h2>{Math.round(calculatedFood.calories)} calories</h2>
                  </div>
                )}
              </div>

              {/* Quantity units */}
              <div className="unit-type">
                <button className="unit-button">Grams</button>

                <button className="unit-button">TBSP</button>

                <button className="unit-button">Cup</button>

                <button className="unit-button">OZ</button>
              </div>

              {/* Calculated macros */}
              {calculatedFood && (
                <div className="macros">
                  <h2>Carbs: {Math.round(calculatedFood.carbs)}g</h2>

                  <h2>Protein: {Math.round(calculatedFood.protein)}g</h2>

                  <h2>Fat: {Math.round(calculatedFood.fat)}g</h2>
                </div>
              )}

              <button
                className="log-button"
                onClick={handleLogFood}
                disabled={enteredGrams <= 0 || !Number.isFinite(enteredGrams)}
              >
                Log
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Breakfast; // Allows other files to import this
