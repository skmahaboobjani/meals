var meals;
//let favoriteMealsG;
String.prototype.replaceAt = function (index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

// Function to generate the HTML for a single meal
function generateMealHTML(meal) {
    // here we are stringfying and encoding to string from object,we are doing this because here we can transfer only strings within backtik
    let mealString = encodeURIComponent(JSON.stringify(meal));


    // we cant encode  ' single quote so we can replace it with - , where ` is encoded in encodeURIComponent method

    for (let i = 0; i < mealString.length; i++) {
        //console.log(es.charAt(i));
        if (mealString.charAt(i) == "'") {
            //console.log(mealString.charAt(i));
            mealString = mealString.replaceAt(i, "`");
        }
    }
    console.log("mealString    ", mealString);

    return `
      <li class='mealItemInFavorites'>
        <img src="${meal.strMealThumb}" alt="Meal image" />
        <span>${meal.strMeal}</span>
        <svg class="icon add-icon" viewBox="0 0 24 24" onclick="addToFavorites('${mealString}')">
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M19 13H5v-2h14v2z" />
        </svg>
      </li>
    `;
}

// Function to generate the entire HTML for the meals list
function generateMealsListHTML(favoriteMeals) {
    let mealsListHTML = '';
    favoriteMeals.forEach(meal => {
        mealsListHTML += generateMealHTML(meal);
    });
    return `<ul id="meal-list">${mealsListHTML}</ul>`;
}

// add or remove from the favorites

function addToFavorites(mealString) {

    for (let i = 0; i < mealString.length; i++) {
        //console.log(es.charAt(i));
        if (mealString.charAt(i) == "`") {
            //console.log(mealString.charAt(i));
            mealString = mealString.replaceAt(i, "\'");
        }
    }

    // Convert the meal string back to a JavaScript object
    const meal = JSON.parse(decodeURIComponent(mealString));
    let favoriteMeals = JSON.parse(localStorage.getItem("favoriteMeals")) || [];

    let favoriteMealsnew = favoriteMeals.filter(fmeal => {
        return meal.idMeal != fmeal.idMeal;
    })

    localStorage.setItem("favoriteMeals", JSON.stringify(favoriteMealsnew));

    updateFavoritesContainer();
    document.getElementById(meal.idMeal).innerHTML = 'Add to favorites';
    document.getElementById(meal.idMeal).setAttribute("class", "btn btn-primary");

}

function DoesMealExistsInFavoriteMeals(meal, favoriteMeals) {
    for (const element of favoriteMeals) {
        if (element.idMeal === meal.idMeal) {
            return true;
        }
    }
    return false;
}
async function addMealItem(meal, favoriteMeals) {
    // create a new div element
    var div = document.createElement("div");
    div.setAttribute("class", "card");
    div.setAttribute("style", "width: 18rem;");
    div.addEventListener("click", function (e) {
        if (e.target.tagName !== "BUTTON") {
            //window.location.href = window.location.origin + `/mealdetail.html?idMeal=${meal.idMeal}`;

            window.location.assign(`/MealApp/mealdetail.html?idMeal=${meal.idMeal}`);
        }
    })


    // create a new img element
    var img = document.createElement("img");
    img.setAttribute("src", meal.strMealThumb);
    img.setAttribute("class", "card-img-top");
    img.setAttribute("alt", "...");
    img.addEventListener("click", function (e) {
        //alert('clicled on img');
    })


    // append the img element to the div element
    div.appendChild(img);

    // create a new div element for the card body
    var cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body");

    // create a new h5 element for the card title
    var cardTitle = document.createElement("h5");
    cardTitle.setAttribute("class", "card-title");
    cardTitle.innerHTML = meal.strMeal;

    // create a new p element for the card text
    var cardText = document.createElement("p");
    cardText.setAttribute("class", "card-text");
    //cardText.innerHTML = "Some quick example text to build on the card title and make up the bulk of the card's content.";
    //cardText.innerHTML = category.strCategoryDescription.slice(0, 90) + "........";


    // create a new a element for the card button
    var cardButton = document.createElement("a");
    cardButton.setAttribute("href", "#");
    cardButton.setAttribute("class", "btn btn-primary");
    cardButton.innerHTML = "Go somewhere";

    let AddToFavorite = document.createElement("button");
    AddToFavorite.setAttribute("id", meal.idMeal);


    let cnf = DoesMealExistsInFavoriteMeals(meal, favoriteMeals);

    if (cnf) {
        AddToFavorite.innerHTML = "Remove from Favorites";
        AddToFavorite.setAttribute("class", "btn btn-secondary");
    } else {
        AddToFavorite.setAttribute("class", "btn btn-primary");
        AddToFavorite.innerHTML = "Add to favorites";
    }



    AddToFavorite.addEventListener("click", function (e) {


        //favoriteMeals = JSON.parse(localStorage.getItem("favoriteMeals")) || [];
        try {
            favoriteMeals = JSON.parse(localStorage.getItem("favoriteMeals")) || [];
        } catch (e) {
            favoriteMeals = [];
        }

        if (AddToFavorite.innerHTML == "Add to favorites") {

            // add the meal name to the list of favorite meals
            favoriteMeals.push(meal);
            console.log(favoriteMeals);

            // save the list of favorite meals to local storage
            localStorage.setItem("favoriteMeals", JSON.stringify(favoriteMeals));
            AddToFavorite.innerHTML = "Added to favorites";

            setTimeout(() => {
                AddToFavorite.innerHTML = "Remove from Favorites";
                AddToFavorite.setAttribute("class", "btn btn-secondary");
            }, 500);
            AddToFavorite.setAttribute("class", "btn btn-success");

        } else if (AddToFavorite.innerHTML == "Remove from Favorites") {

            const favoriteMealsNew = favoriteMeals.filter((fmeal) => {
                return (meal.idMeal != fmeal.idMeal)
            });

            localStorage.setItem("favoriteMeals", JSON.stringify(favoriteMealsNew));
            console.log(favoriteMealsNew);
            AddToFavorite.setAttribute("class", "btn btn-primary");
            AddToFavorite.innerHTML = "Add to favorites";
        }

        updateFavoritesContainer();
    });


    // append the card title, text, and button to the card body
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    //cardBody.appendChild(cardButton);
    cardBody.appendChild(AddToFavorite);

    // append the card body to the div element
    div.appendChild(cardBody);

    // append the div element to the body of the document
    //document.body.appendChild(div);

    document.getElementById("allMeals-container").appendChild(div);
}

async function fetchMeals() {
    let favoriteMeals;
    try {
        favoriteMeals = JSON.parse(localStorage.getItem("favoriteMeals")) || [];
    } catch (e) {
        favoriteMeals = [];
    }

    const urlParams = new URLSearchParams(window.location.search);
    const catName = urlParams.get('cat');
    await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${catName}`)
        .then(response => response.json())
        .then(data => {
            console.log(data.meals);
            let meals = data.meals;

            meals.forEach(meal => {
                addMealItem(meal, favoriteMeals);
            })



        })
        .catch(error => console.error(error));

    // generate the HTML and insert it into the DOM
    let favoriteMealsListContainer = document.getElementById('favourites-container');
    favoriteMealsListContainer.innerHTML = generateMealsListHTML(favoriteMeals);

}

function updateFavoritesContainer() {
    let favoriteMeals = JSON.parse(localStorage.getItem("favoriteMeals")) || [];
    let favoriteMealsListContainer = document.getElementById('favourites-container');
    favoriteMealsListContainer.innerHTML = generateMealsListHTML(favoriteMeals);
}

fetchMeals();


const searchInput = document.getElementById("search-input");
//const searchButton = document.getElementById("search-btn");

searchInput.addEventListener("keyup", () => {
    const searchTerm = searchInput.value.trim();


    if (searchTerm) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
            .then(response => response.json())
            .then(data => {
                // Do something with the fetched data, such as displaying it on the page
                console.log("search results ", data);
                let meals = data.meals;

                let favoriteMeals;
                try {
                    favoriteMeals = JSON.parse(localStorage.getItem("favoriteMeals")) || [];
                } catch (e) {
                    favoriteMeals = [];
                }

                document.getElementById("allMeals-container").innerHTML = '';

                meals.forEach(meal => {
                    addMealItem(meal, favoriteMeals);
                });
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }
});