import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  Breakfast,
  Lunch,
  Dinner,
  Snacks,
  MyRecipes,
  CustomFoods,
  DietReview,
  Water,
} from "./pages";

import "./App.css";

// Shared page routes for home screen, reused for normal and modal navigation.
const pageRoutes = [
  { path: "/breakfast", element: <Breakfast /> },
  { path: "/lunch", element: <Lunch /> },
  { path: "/dinner", element: <Dinner /> },
  { path: "/snacks", element: <Snacks /> },
  { path: "/myrecipes", element: <MyRecipes /> },
  { path: "/customfoods", element: <CustomFoods /> },
  { path: "/dietreview", element: <DietReview /> },
  { path: "/water", element: <Water /> },
];

// Home page
function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  // Opens a page over the current page when using modal navigation.
  function openPage(path: string) {
    navigate(path, {
      state: {
        backgroundLocation: location,
      },
    });
  }

  return (
    <div className="center">
      {/* Menu button and dropdown */}
      <div className="menu-container">
        <button
          className="menu-button"
          id="menu-button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {menuOpen && (
          <div className="menu-dropdown" id="menu">
            <a href="food.html">Settings</a>
            <a href="workout.html">Darkmode</a>
            <a href="settings.html">More themes</a>
          </div>
        )}
      </div>

      {/* Today's date and calorie heading */}
      <div className="date-section">
        <p className="date-title">Today is XXX</p>
      </div>

      {/* Main food dashboard */}
      <div className="food-dashboard">
        {/* Left-side for utility-navigation buttons */}
        <div className="utility-navigation">
          <button
            className="dashboard-button"
            onClick={() => openPage("/myrecipes")}
          >
            My recipes
          </button>

          <button
            className="dashboard-button"
            onClick={() => openPage("/customfoods")}
          >
            Custom foods
          </button>

          <button
            className="dashboard-button"
            onClick={() => openPage("/dietreview")}
          >
            Diet review
          </button>

          <button
            className="dashboard-button"
            onClick={() => openPage("/water")}
          >
            Water
          </button>
        </div>

        {/* Centre calorie summary */}
        <div className="calorie-summary-section">
          <div className="calorie-summary">
            <p className="calories-title">Today's Calories</p>

            <p className="calories-consumed">Calories Consumed</p>

            <button className="view-todays-food-button">
              View today's food
            </button>
          </div>
        </div>

        {/* Right-side for meal-navigation buttons */}
        <div className="meal-navigation">
          <button
            className="dashboard-button"
            onClick={() => openPage("/breakfast")}
          >
            Breakfast
          </button>

          <button
            className="dashboard-button"
            onClick={() => openPage("/lunch")}
          >
            Lunch
          </button>

          <button
            className="dashboard-button"
            onClick={() => openPage("/dinner")}
          >
            Dinner
          </button>

          <button
            className="dashboard-button"
            onClick={() => openPage("/snacks")}
          >
            Snacks
          </button>
        </div>
      </div>

      {/* Weight and goals sections under main dashboard*/}
      <button className="weight-section">weight_box</button>

      <button className="goals-section">goals_box</button>
    </div>
  );
}

// Handles normal routes and pages displayed over the home page.
function AppRoutes() {
  const location = useLocation();

  // Use the saved background URL when opening a page as a modal.
  const backgroundLocation = location.state?.backgroundLocation;

  return (
    <>
      {/* Main routes, using the background page when available. */}
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<Home />} />

        {pageRoutes.map((page) => (
          <Route key={page.path} path={page.path} element={page.element} />
        ))}
      </Routes>

      {/* Render the selected page again as the modal overlay. */}
      {backgroundLocation && (
        <Routes>
          {pageRoutes.map((page) => (
            <Route key={page.path} path={page.path} element={page.element} />
          ))}
        </Routes>
      )}
    </>
  );
}

// Sets up browser-based navigation for the application.
function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
