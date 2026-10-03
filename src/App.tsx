// Imports
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom"; // Tools from react-router-dom, (page navigation, holds routes, a route, go to this page)
import { useState } from "react"; // Enables state checking for things like menu
import { Breakfast, Lunch, Dinner, Snacks, MyRecipes, CustomFoods, DietReview, Water} from "./pages"; // imports my pages
import "./App.css"; // imports the css file I made before

// A function that contains everything on the home page
function Home() { 
    const navigate = useNavigate(); // shortcut that replaces useNavigate() then takes user to yourwebsite.com/breakfast without doing a page reload somehow
    const [menuOpen, setMenuOpen] = useState(false); // creates menuOpen variable, uses the imported state from earlier to define if it is currently opened or not

    // returns all the items in here onto the actual screen
    return (
        // uses className instead of class because that's a javascript keyword
        <div className="center">

            <div className="menu_box">
                <button
                    className="menu_button"
                    id="menuButton"
                    // on click, changes setMenuOpen to reverse current state
                    onClick={() => setMenuOpen(!menuOpen)} 
                >
                    ☰
                </button>

            {/* Basically an if statement, if menuOpen true, display what's under */}
            {menuOpen && (
                <div className="menu" id="menu">
                    <a href="food.html">Settings</a>
                    <a href="workout.html">Darkmode</a>
                    <a href="settings.html">More themes</a>
                </div>
            )}

            </div>

            {/* The visual for date box */}
            <div className="date_box">
                <p className="calories_title">Today's Calories</p>
            </div>

            {/* The alignment with all objects inside the main green box */}
            <div className="food_green_box">

                <div className="food_left_items">
                    <button 
                        className="food_green_box_button"
                        onClick={() => navigate("/MyRecipes")} 
                    >
                        My recipes
                    </button>

                    <button 
                        className="food_green_box_button"
                        onClick={() => navigate("/CustomFoods")} 
                    >
                        Custom foods
                    </button>

                    <button 
                        className="food_green_box_button"
                        onClick={() => navigate("/DietReview")} 
                    >
                        Diet review
                    </button>

                    <button 
                        className="food_green_box_button"
                        onClick={() => navigate("/Water")} 
                    >
                        Water
                    </button>
                </div>

                <div className="food_mid_objects">
                    <div className="food_blue_box">
                        <p className="calories_title">
                            Today's Calories
                        </p>

                        <p className="calories_consumed">
                            Calories Consumed
                        </p>

                        <button className="view_all_food">
                            View today's food
                        </button>
                    </div>
                </div>

                <div className="food_right_items">

                    <button 
                        // information/attributes to the button here
                        className="food_green_box_button"
                        // using one of the react router dom imports to reroute user to next place onClick
                        onClick={() => navigate("/breakfast")} 
                    >
                        {/* Literal stuff inside the button */}
                        Breakfast
                    </button>

                    <button 
                        className="food_green_box_button"
                        onClick={() => navigate("/Lunch")}                     
                    >
                        Lunch
                    </button>

                    <button 
                        className="food_green_box_button"
                        onClick={() => navigate("/Dinner")}                     
                    >
                        Dinner
                    </button>

                    <button 
                        className="food_green_box_button"
                        onClick={() => navigate("/Snacks")}  
                    >                   
                        Snacks
                    </button>

                </div>
            </div>

            <button className="weight_box">
                weight_box
            </button>

            <button className="goals_box">
                goals_box
            </button>

        </div>
    );
}

function App() {
    return (
        <BrowserRouter> {/* Tells computer we will use URL's to navigate */}
            <Routes> {/* All the possible routes we can go to */}
                <Route path="/" element={<Home />} />

                <Route path="/breakfast" element={<Breakfast />} />
                <Route path="/Lunch" element={<Lunch />} />
                <Route path="/Dinner" element={<Dinner />} />
                <Route path="/Snacks" element={<Snacks />} />
                <Route path="/CustomFoods" element={<CustomFoods />} />
                <Route path="/MyRecipes" element={<MyRecipes />} />
                <Route path="/DietReview" element={<DietReview />} />
                <Route path="/Water" element={<Water />} />
                

            </Routes>
        </BrowserRouter>
    );
}

export default App; // Allows other files to import this