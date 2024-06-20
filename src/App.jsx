import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PokemonCard from './components/Card.jsx';
import './App.css';

const App = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=150');
        const results = response.data.results;

        const detailedPokemonList = await Promise.all(results.map(async (pokemon) => {
          const pokemonDetail = await axios.get(pokemon.url);
          return pokemonDetail.data;
        }));

        setPokemonList(detailedPokemonList);
      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPokemonList = pokemonList.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <header className="App-header">
      <h1>Pokémon Search</h1>
        <input
          type="text"
          placeholder="Search Pokémon"
          value={searchTerm}
          onChange={handleSearch}
        />
      </header>
      <div className="pokemon-container">
        {filteredPokemonList.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
    </div>
  );
};

export default App;
