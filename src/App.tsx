// Imports
import { BrowserRouter, Routes, Route, useNavigate, useLocation} from "react-router-dom"; // Tools from react-router-dom, (page navigation, holds routes, a route, go to this page)
import { useState } from "react"; // Enables state checking for things like menu
import { Breakfast, Lunch, Dinner, Snacks, MyRecipes, CustomFoods, DietReview, Water} from "./pages"; // imports my pages
import "./App.css"; // imports the css file I made before

// A function that contains everything on the home page
function Home() { 
    const navigate = useNavigate(); // shortcut that replaces useNavigate() then takes user to yourwebsite.com/breakfast without doing a page reload 
    const location = useLocation(); // same thing as navigate, comes from tools within react-router
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
                        onClick={() => navigate("/myrecipes", {
                            state: {
                                backgroundLocation: location
                            }
                        })}      
                    >
                        My recipes
                    </button>

                    <button 
                        className="food_green_box_button"                    
                        onClick={() => navigate("/customfoods", {
                            state: {
                                backgroundLocation: location
                            }
                        })}      
                    >
                        Custom foods
                    </button>

                    <button 
                        className="food_green_box_button"                    
                        onClick={() => navigate("/dietreview", {
                            state: {
                                backgroundLocation: location
                            }
                        })}      
                    >
                        Diet review
                    </button>

                    <button 
                        className="food_green_box_button"
                        onClick={() => navigate("/water", {
                            state: {
                                backgroundLocation: location
                            }
                        })}      
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
                        onClick={() => navigate("/breakfast", {
                            state: {
                                backgroundLocation: location
                            }
                        })} 
                    >
                        {/* Literal stuff inside the button */}
                        Breakfast
                    </button>

                    <button 
                        className="food_green_box_button"
                        onClick={() => navigate("/lunch", {
                            state: {
                                backgroundLocation: location
                            }
                        })}            
                    >
                        Lunch
                    </button>

                    <button 
                        className="food_green_box_button"
                        onClick={() => navigate("/dinner", {
                            state: {
                                backgroundLocation: location
                            }
                        })}                        
                    >
                        Dinner
                    </button>

                    <button 
                        className="food_green_box_button"
                        onClick={() => navigate("/snacks", {
                            state: {
                                backgroundLocation: location
                            }
                        })}            
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

// Function to control routes and page navigation
function AppRoutes() {
    const location = useLocation(); // contains information about current location

    const backgroundLocation = location.state?.backgroundLocation; // created from onclick navigate(), when you swap pages, make the background page our current page, as long as it exist

    return (
        <> 
            {/* reads location based off of if backgroundLocation exist or not*/}
            {/* Routes is, display current route*/}
            <Routes location={backgroundLocation || location}>
                <Route path="/" element={<Home />} />
                <Route path="/breakfast" element={<Breakfast />} />
                <Route path="/lunch" element={<Lunch />} />
                <Route path="/dinner" element={<Dinner />} />   
                <Route path="/snacks" element={<Snacks />} />
                <Route path="/customFoods" element={<CustomFoods />} />
                <Route path="/myRecipes" element={<MyRecipes />} />
                <Route path="/dietReview" element={<DietReview />} />
                <Route path="/water" element={<Water />} />
            </Routes>

            {/* If background location exist, render the current route so it can go over the now background of current*/}
            {backgroundLocation && (
                <Routes>
                    <Route path="/breakfast" element={<Breakfast />} />
                    <Route path="/lunch" element={<Lunch />} />
                    <Route path="/dinner" element={<Dinner />} />
                    <Route path="/snacks" element={<Snacks />} />
                    <Route path="/customfoods" element={<CustomFoods />} />
                    <Route path="/myrecipes" element={<MyRecipes />} />
                    <Route path="/dietreview" element={<DietReview />} />
                    <Route path="/water" element={<Water />} />
                </Routes>
            )}
        </>
    );
}

// Basically says app is going to use the browser URL's and navigation history for routing
function App() {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
}

export default App; // Allows other files to import this