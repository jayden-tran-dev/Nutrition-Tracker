import { useNavigate } from "react-router-dom"; // add browser navigation to this page
import { useState } from "react"; // importing states for pull up panel specifically

type Food = {
    name: string;
    grams: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
};

function Breakfast() {
    const navigate = useNavigate(); // create navigate function using Navigate import to move between pages
    const [showAddFood, setShowAddFood] = useState(false); // variable showAddFood with a current state of false and setShowAddFood changes it
    const [closingAddP, setClosingAddP] = useState(false); // variable to check in when closing page is on or off to play sliding down animation
    const [search, setSearch] = useState(""); // variable to hold the actual text we have in a search bar
    const [foods, setFoods] = useState<Food[]>([]); // variable to hold searched information from the free API
    const [selectedFood, setSelectedFood] = useState<Food | null>(null); // variable selectedFood variable will hold either a food or nothing
    const [closingSelected, setClosingSelected] = useState(false); // variable to check if closing Selected page or not
    const [calcGrams, setCalcGrams] = useState(""); // variable to hold the actual amount of grams we want to calculate

    const [calculatedFood, setCalculatedFood] = useState({ // another const to hold updated quantity of food macros
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
    });



    // A function to properly close panel (sets closing true then after 140ms setShowAddFood and setClosing are false, meaning panel is no longer displayed after animation and closing is false again)
    const closeAddFood = () => {
        setClosingAddP(true); 

        setTimeout(() => {
            setShowAddFood(false);
            setClosingAddP(false);
        }, 140);
    };

    const closeSelected = () => {
        setClosingSelected(true); 

        setTimeout(() => {
            setClosingSelected(false);
            setSelectedFood(null);
        }, 140);
    };

    const loggedFood = () => {
        closeAddFood();

        setTimeout(() => {
            setSelectedFood(null);
        }, 140);
    };

    // searchFood variable that connects to the free openfoodfacts which is a free api, this uses my backend which is local 3000 for no CORS
    const searchFood = async () => {
        const response = await fetch(
            `http://localhost:3000/api/foods?search=${search}`
        );

        const data = await response.json();

        if (Array.isArray(data)) {
            setFoods(data);
        } else {
            console.log(data.error);
            setFoods([]);
        }
    };

    // Calculates the macros of new food
    const calcMacros = (gramsInput: string) => {
        if (!selectedFood) {
            return;
        }

        const grams = Number(gramsInput);

        setCalculatedFood({
            calories: (grams / 100) * selectedFood.calories,
            protein: (grams / 100) * selectedFood.protein,
            carbs: (grams / 100) * selectedFood.carbs,
            fat: (grams / 100) * selectedFood.fat
        });
    };

    return (
        <div className="SelectPage">

            {/* Top for category */}
            <div className="category">

                <button 
                    className="backButton"
                    onClick={() => navigate(-1)} // go back a page when clicked
                >
                    &lt;
                </button>

                <p className="categoryFont">Breakfast</p>

                <button className = "moreButton"> 
                    <span>⋯</span>
                </button>


            </div>

            {/* chunk for the date */}
            <p className="date">Date rotator

            </p>

            {/* Bottom piece to control adding foods ect */}
            <p className="food_area">Big space for 70% of other stuff
                <button 
                    className = "addButton"
                    onClick={() => setShowAddFood(true)} // when clicked turn state to true
                    > 
                    {/* literal plus icon here */}
                    + 
                </button>
            </p>

            {/* When  setShowAddFood is True*/}
            {showAddFood && (
                // Checks state of closing, if true then have the panel slideDown, if false add food panel with slideUp
                <div className={closingAddP ? "addFoodPanel slideDownAnimation" : "addFoodPanel slideUpAnimation"}>

                    <button className="closeButton" onClick={closeAddFood}>
                        X
                    </button>

                    <div className = "foodSearchWord">
                        Food Search
                    </div>

                    <div className = "bigSearchWord">
                        Search
                    </div>

                    <div className = "searchBar">
                        {/* Making user clicked search bar work*/}
                        <input
                            type="text"
                            placeholder="Search for a food"
                            value = {search}
                            onChange={(event) => setSearch(event.target.value)} // fill the variable that holds our search bar information and actually registers it

                            onKeyDown={(event) => { // make hitting enter on keyboard or mobile keyboard checkmark work
                            if (event.key === "Enter") {
                                searchFood();
                            }
                        }}
                        />
                    </div>

                    {/* Big zone that contains each search result*/}
                    <div className="foodResults">
                        
                        {foods.map((food, index) => (
                            <button 
                                className="foodResult" 
                                key={index}
                                onClick={() => setSelectedFood(food)}
                            >
                                
                                <div className="foodName">
                                    {food.name}
                                </div>

                                <div className="foodStats"> 

                                    <p className="calories">
                                        {Math.round(food.calories)} cals               
                                    </p>
                                    
                                    <div className="foodGrams">                                
                                        <p>{Math.round(food.grams)}g</p>
                                    </div>

                                </div>

                            </button>
                        ))}
                    </div>

                    {/* When a food has been selected*/}
                    {selectedFood && (

                        // If closing mode is true, display the selectedFoodpage with closing animation, if false, vise versa
                        <div className={closingSelected ? "selectedFood slideRightAnimation" : "selectedFood slideLeftAnimation"}>

                            {/* When clicked, run function to close out of the page properly*/}
                            <button 
                                className="closeButton" 
                                onClick={closeSelected}
                            >

                                X
                            </button>

                            <h2 className = "selectedName">
                                {selectedFood.name}
                            </h2>

                            <div className="calCalc">

                                <div className="userGrams">

                                    <input className="gramsBar"
                                        type="number"
                                        placeholder="grams"
                                        value={calcGrams}

                                        /* everytime a new gram is typed, update setCalcGrams and then call function to update values live*/                        
                                        onChange={(event) => {
                                            setCalcGrams(event.target.value);
                                            calcMacros(event.target.value);
                                        }}
                                    />

                                    <h2 className="showGrams">
                                        {calcGrams === ""
                                            ? Math.round(selectedFood.grams)
                                            : calcGrams
                                        } grams
                                    </h2>

                                </div>

                                <div className="userCalories">

                                    {/* display updated cals only if user changed*/}
                                    <h2>
                                        {calcGrams === ""
                                            ? Math.round(selectedFood.calories)
                                            : Math.round(calculatedFood.calories)
                                        } calories
                                    </h2>
                                    
                                </div>

                            </div>


                            <div className="unitType">

                                <button className="unitButton">
                                    Grams
                                </button>

                                <button className="unitButton">
                                    TBSP
                                </button>

                                <button className="unitButton">
                                    Cup
                                </button>

                                <button className="unitButton">
                                    OZ
                                </button>

                            </div>

                            <div className="macros">

                                <h2>Carbs: 
                                    {calcGrams === ""

                                        ? Math.round(selectedFood.carbs)
                                        : Math.round(calculatedFood.carbs)
                                    }g
                                </h2>
                            
                                <h2>Protein:                                     
                                    {calcGrams === ""
                                        ? Math.round(selectedFood.protein)
                                        : Math.round(calculatedFood.protein)
                                    }g
                                </h2>


                                <h2>Fat:                                     
                                    {calcGrams === ""
                                        ? Math.round(selectedFood.fat)
                                        : Math.round(calculatedFood.fat)
                                    }g
                                </h2>

                            </div>

                            <button 
                                className="logButton"
                                onClick={loggedFood}
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