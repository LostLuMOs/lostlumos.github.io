// Generates a randomized Pokémon Team
async function generateTeam() {
    // Checkbox of each generation
    var generation1 = document.getElementById('gen1');
    var generation2 = document.getElementById('gen2');
    var generation3 = document.getElementById('gen3');
    var generation4 = document.getElementById('gen4');
    var generation5 = document.getElementById('gen5');
    var generation6 = document.getElementById('gen6');
    var generation7 = document.getElementById('gen7');
    var generation8 = document.getElementById('gen8');
    var generation9 = document.getElementById('gen9');

    // Team size
    var teamSize = document.getElementById('teamSize').value;

    // Available Pokémon
    let availablePokemon = [];
    
    if (generation1.checked) {
        availablePokemon = availablePokemon.concat(await fetchPokemonData('gen1'));
    }
    if (generation2.checked) {
        availablePokemon = availablePokemon.concat(await fetchPokemonData('gen2'));
    }
    if (generation3.checked) {
        availablePokemon = availablePokemon.concat(await fetchPokemonData('gen3'));
    }
    if (generation4.checked) {
        availablePokemon = availablePokemon.concat(await fetchPokemonData('gen4'));
    }
    if (generation5.checked) {
        availablePokemon = availablePokemon.concat(await fetchPokemonData('gen5'));
    }
    if (generation6.checked) {
        availablePokemon = availablePokemon.concat(await fetchPokemonData('gen6'));
    }
    if (generation7.checked) {
        availablePokemon = availablePokemon.concat(await fetchPokemonData('gen7'));
    }
    if (generation8.checked) {
        availablePokemon = availablePokemon.concat(await fetchPokemonData('gen8'));
    }
    if (generation9.checked) {
        availablePokemon = availablePokemon.concat(await fetchPokemonData('gen9'));
    }

    // Pokémon Team
    let team = [];

    for (let i = 0; i < teamSize; i++) {
        const randomIndex = getRandomInt(availablePokemon.length);
        team.push(availablePokemon[randomIndex]);
    }

    // Sprite for each team member
    displayTeam(team);
}

// Fetches needed Data from PokeAPI
async function fetchPokemonData(criteria) {
    const generationEndpoints = {
        gen1: 'https://pokeapi.co/api/v2/generation/1/',
        gen2: 'https://pokeapi.co/api/v2/generation/2/',
        gen3: 'https://pokeapi.co/api/v2/generation/3/',
        gen4: 'https://pokeapi.co/api/v2/generation/4/',
        gen5: 'https://pokeapi.co/api/v2/generation/5/',
        gen6: 'https://pokeapi.co/api/v2/generation/6/',
        gen7: 'https://pokeapi.co/api/v2/generation/7/',
        gen8: 'https://pokeapi.co/api/v2/generation/8/',
        gen9: 'https://pokeapi.co/api/v2/generation/9/'
    };

    // Fetches specified data
    const response = await fetch(generationEndpoints[criteria]);
    const data = await response.json();
    
    // Gets detailed information for each Pokémon
    const pokemonDetails = await Promise.all(data.pokemon_species.map(async (pokemon) => {
        try {
            const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
            const pokemonData = await pokemonResponse.json();
            // Returns only needed data
            return {
                name: pokemonData.name,
                sprite: pokemonData.sprites.front_default
            };
        } catch (error) {
            // Data not available
            console.error(`Failed to fetch data for ${pokemon.name}:`, error);
            return null;
        }
    }));
    
    // Filters not usable data
    return pokemonDetails.filter(pokemon => pokemon !== null);
}

// Gets a random integer (from 0 to max-1)
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// Displays a Pokémon Team
function displayTeam(team) {
    const teamDisplay = document.getElementById('teamDisplay');
    teamDisplay.innerHTML = '';

    // Creates HTML-Elements for each team member
    team.forEach(pokemon => {
        if (pokemon && pokemon.sprite) {
            // Creates element
            const pokemonDiv = document.createElement('div');
            pokemonDiv.className = 'pokemon';

            // Creates image with alt-text
            const pokemonImg = document.createElement('img');
            pokemonImg.src = pokemon.sprite;
            pokemonImg.alt = pokemon.name;
            
            // Appends elements
            pokemonDiv.appendChild(pokemonImg);
            teamDisplay.appendChild(pokemonDiv);
        } else {
            // Data not available
            console.warn('Skipped a Pokémon due to missing data:', pokemon);
        }
    });
}