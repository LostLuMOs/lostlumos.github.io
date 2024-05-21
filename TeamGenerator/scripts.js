// Fetches needed Data from PokeAPI
async function fetchPokemonData(generation) {
    const generationEndpoints = {
        1: 'https://pokeapi.co/api/v2/generation/1/',
        2: 'https://pokeapi.co/api/v2/generation/2/',
        3: 'https://pokeapi.co/api/v2/generation/3/',
        4: 'https://pokeapi.co/api/v2/generation/4/',
        5: 'https://pokeapi.co/api/v2/generation/5/',
        6: 'https://pokeapi.co/api/v2/generation/6/',
        7: 'https://pokeapi.co/api/v2/generation/7/',
        8: 'https://pokeapi.co/api/v2/generation/8/',
        9: 'https://pokeapi.co/api/v2/generation/9/'
    };

    const response = await fetch(generationEndpoints[generation]);
    const data = await response.json();
    
    // Gets detailed information for each Pokémon
    const pokemonDetails = await Promise.all(data.pokemon_species.map(async (pokemon) => {
        const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
        const pokemonData = await pokemonResponse.json();
        return {
            name: pokemon.name,
            sprite: pokemonData.sprites.front_default
        };
    }));
    
    return pokemonDetails;
}

// Gets a random integer (from 1 to max)
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// Generates a randomized Pokémon Team
async function generateTeam() {
    const generation = document.getElementById('generation').value;
    const teamSize = document.getElementById('teamSize').value;

    const availablePokemon = await fetchPokemonData(generation);
    let team = [];

    for (let i = 0; i < teamSize; i++) {
        const randomIndex = getRandomInt(availablePokemon.length);
        team.push(availablePokemon[randomIndex]);
    }

    displayTeam(team);
}

// Displays a Pokémon Team
function displayTeam(team) {
    const teamDisplay = document.getElementById('teamDisplay');
    teamDisplay.innerHTML = '';

    team.forEach(pokemon => {
        const pokemonDiv = document.createElement('div');
        pokemonDiv.className = 'pokemon';

        const pokemonImg = document.createElement('img');
        pokemonImg.src = pokemon.sprite;
        pokemonImg.alt = pokemon.name;
        
        pokemonDiv.appendChild(pokemonImg);
        teamDisplay.appendChild(pokemonDiv);
    });
}

