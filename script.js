var categories;
var trie;

function addMealCategories(category) {
    // create a new div element
    var div = document.createElement("div");
    div.setAttribute("class", "card");
    div.setAttribute("style", "width: 18rem;");
    div.addEventListener("click", function (e) {

        // let cc = document.getElementById("categories-container");
        // cc.style.visibility = "hidden";
        // cc.style.height = '0px';

        document.getElementById("categories-container").style.visibility = "hidden";
        document.getElementById("categories-container").style.height = "0px";
        //document.getElementById("meals-container").style.visibility = 'visible';

        //window.location.href = window.location.origin + `/meals.html?cat=${category.strCategory}`;

        window.location.assign(`/meals.html?cat=${category.strCategory}`);

    })

    // create a new img element
    var img = document.createElement("img");
    img.setAttribute("src", category.strCategoryThumb);
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
    cardTitle.innerHTML = category.strCategory;

    // create a new p element for the card text
    var cardText = document.createElement("p");
    cardText.setAttribute("class", "card-text");
    //cardText.innerHTML = "Some quick example text to build on the card title and make up the bulk of the card's content.";
    cardText.innerHTML = category.strCategoryDescription.slice(0, 90) + "........";


    // create a new a element for the card button
    var cardButton = document.createElement("a");
    cardButton.setAttribute("href", "#");
    cardButton.setAttribute("class", "btn btn-primary");
    cardButton.innerHTML = "Go somewhere";


    // append the card title, text, and button to the card body
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    //cardBody.appendChild(cardButton);


    // append the card body to the div element
    div.appendChild(cardBody);

    // append the div element to the body of the document
    //document.body.appendChild(div);

    document.getElementById("categories-container").appendChild(div);
}

async function fetchMealCategories() {
    await fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
        .then(response => response.json())
        .then(data => {
            console.log(data.categories);
            categories = data.categories;

            categories.forEach(category => {
                //addMealItem(category, favoriteMeals);
                addMealCategories(category);
            })

        })
        .catch(error => console.error(error));

    console.log("categories ", categories);
    trie = createTrieNode();

    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        insert(trie, category.strCategory.toLowerCase(), i);
    }

}

//fetchMeals();

fetchMealCategories();

const searchInput = document.getElementById("search-input");

searchInput.addEventListener("keyup", () => {

    let searchTerm = searchInput.value.trim().toLowerCase();
    console.log("search Term ", searchTerm);


    document.getElementById('categories-container').innerHTML = '';

    if (searchTerm) {
        const searchResult = search(trie, searchTerm);

        console.log("cats", categories);
        console.log("searchResult ", searchResult);

        console.log(typeof (searchResult));


        categories.forEach(category => {
            //if category.strCategory contains in searchResult
            // then add the category to the categories-container
            searchResult.forEach(str => {
                if (str == category.strCategory.toLowerCase()) {
                    addMealCategories(category);
                }
            });

        })
    } else {
        fetchMealCategories();
    }

});



// Building a trie for searching

function createTrieNode() {
    return {
        children: {},
        isEndOfWord: false,
        words: [],
    };
}

function insert(trie, word, index) {
    let current = trie;
    for (let i = 0; i < word.length; i++) {
        const char = word[i];
        if (!current.children[char]) {
            current.children[char] = createTrieNode();
        }
        current = current.children[char];
        //current.words.push(index);
        current.words.push(word);
    }
    current.isEndOfWord = true;
}

function search(trie, prefix) {
    let current = trie;
    for (let i = 0; i < prefix.length; i++) {
        const char = prefix[i];
        if (!current.children[char]) {
            return [];
        }
        current = current.children[char];
    }
    return current.words;
}


// var baseTag = document.getElementById("base-tag");
// baseTag.href = window.location.origin + "/MealApp/";
// const searchResult = search(trie, "sai");
// const matchedWords = searchResult.map((index) => words[index]);

// console.log(matchedWords);