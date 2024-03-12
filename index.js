const API_URL = "https://pokeapi.co/api/v2/";
let offset = 0;
let isInitialLoad = true;

async function getAndRenderPokemon(url) {
    const response = await fetch(url);
    const pokemon = await response.json();

    console.log(pokemon);

    let cardTemplate = document.getElementsByClassName("card")[0];
    cardTemplate.style.display = "inline-block";
    let newCard = cardTemplate.cloneNode(true);
    cardTemplate.style.display = "none";

    let cardListDiv = document.getElementsByClassName("card-view-list")[0];
    cardListDiv.appendChild(newCard);

    newCard.classList.add(`card-${pokemon.id}`);
    newCard.getElementsByClassName("id")[0].innerHTML = `ID No.: ${pokemon.id}`;
    newCard.getElementsByClassName("name")[0].innerHTML = `Name: ${pokemon.name}`;
    newCard.getElementsByClassName("type")[0].innerHTML = `Type: ${pokemon.types[0].type.name}`;
    newCard.getElementsByClassName("card-image")[0].src = pokemon.sprites.other.home.front_default;
    newCard.setAttribute('onclick', `createPageForPokemon(${pokemon.id})`);
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
    console.log(`Detailed Page for Pokemon ${id}`);

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