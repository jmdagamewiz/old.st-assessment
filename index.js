const API_URL = "https://pokeapi.co/api/v2/";
let offset = 0;
let loadedPokemons = [];
let filteredPokemons = [];


function filterPokemons() {
    let search = document.getElementsByClassName("search-bar")[0].value;

    if (/^\d+$/.test(search)) {
        filteredPokemons = loadedPokemons.filter(function(pokemon) {
            return pokemon.id.toString().includes(search);
        });
    } else {
        filteredPokemons = loadedPokemons.filter(function(pokemon) {
            return pokemon.name.includes(search);
        });
    }

    let cardListDiv = document.getElementsByClassName("card-view-list")[0];
    cardListDiv.innerHTML = '';

    for (pokemon of filteredPokemons) {
        renderPokemon(pokemon);
    }
}

function sortPokemonsByName() {
    let cardListDiv = document.getElementsByClassName("card-view-list")[0];
    cardListDiv.innerHTML = '';

    loadedPokemons = loadedPokemons.sort(function(a, b) {
        return a.name.localeCompare(b.name);
    });

    for (pokemon of loadedPokemons) {
        renderPokemon(pokemon);
    }
}

function sortPokemonsById() {
    let cardListDiv = document.getElementsByClassName("card-view-list")[0];
    cardListDiv.innerHTML = '';

    loadedPokemons.sort(function(a, b) {
        return a.id - b.id;
    });

    for (pokemon of loadedPokemons) {
        renderPokemon(pokemon);
    }
}

function renderPokemon(pokemon) {

    let card = document.getElementsByTagName("template")[0];
    const cardTemplate = card.content.querySelector("div");

    let newCard = cardTemplate.cloneNode(true);

    let cardListDiv = document.getElementsByClassName("card-view-list")[0];
    cardListDiv.appendChild(newCard);

    newCard.classList.add(`card-${pokemon.id}`);
    newCard.getElementsByClassName("id")[0].innerHTML = `ID No.: ${pokemon.id}`;
    newCard.getElementsByClassName("name")[0].innerHTML = `Name: ${pokemon.name}`;
    newCard.getElementsByClassName("type")[0].innerHTML = `Type: ${pokemon.types[0].type.name}`;
    newCard.getElementsByClassName("card-image")[0].src = pokemon.sprites.other.home.front_default;
    newCard.setAttribute('onclick', `createPageForPokemon(${pokemon.id})`);
}

async function getAndRenderPokemon(url) {
    const response = await fetch(url);
    const pokemon = await response.json();

    loadedPokemons.push(pokemon);

    renderPokemon(pokemon);
}

async function getAndRenderFirst10Pokemons() {
    const response = await fetch(API_URL + "pokemon/?limit=10");
    const data = await response.json();

    let pokemons = data.results;

    for (pokemon of pokemons) {
        getAndRenderPokemon(pokemon.url);
    }

    offset += 10;
}

async function append10MorePokemons() {
    const response = await fetch(API_URL + `pokemon/?limit=10&offset=${offset}`);
    const data = await response.json();

    let pokemons = data.results;

    for (pokemon of pokemons) {
        getAndRenderPokemon(pokemon.url);
    }
    
    offset += 10;
}

async function createPageForPokemon(id) {

    const response = await fetch(API_URL + `pokemon/${id}/`);
    const pokemon = await response.json();

    var opened = window.open("");

    // TODO: Add more information fields and list down types, abilities, stats instead of giving first only

    opened.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${pokemon.name} - A Detailed View</title>
        <link rel="stylesheet" href="./main.css">
        <script src="index.js"></script>
    </head>
    <body>
        <h1 class="header">${pokemon.name}</h1>

        <div class="info-container">
            <img class="image" src="${pokemon.sprites.other.home.front_default}" alt="Pokemon Image">
            <div class="detailed-container">
                <p>ID No.: ${pokemon.id}</p>
                <p>Name: ${pokemon.id}</p>
                <p>Height: ${pokemon.height}</p>
                <p>Base Experience: ${pokemon.base_experience}</p>
                <p>Types: ${pokemon.types[0].type.name}</p>
                <p>Abilities: ${pokemon.abilities[0].ability.name}</p>
                <p>Stats: ${pokemon.stats[0].stat.name} - Base: ${pokemon.stats[0].base_stat}, Effort: ${pokemon.stats[0].effort}</p>
            </div>
            <br>
            <div class="weaknesses-container">
                Weaknesses: {weaknesses here}
            </div>
        </div>

        <div class="directions-container">
            <button type="button" onclick="createPageForPokemon(${parseInt(pokemon.id) - 1})">Previous</button>
            <button type="button" onclick="createPageForPokemon(${parseInt(pokemon.id) + 1})">Next</button>
        </div>

    </body>
    </html>
    `);
}