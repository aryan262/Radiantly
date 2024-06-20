import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PokemonCard from './components/Card.jsx';
import './App.css';

const App = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [allPokemon, setAllPokemon] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState('');
  const [loading, setLoading] = useState(true); 

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
        setSearchResults(detailedPokemonList);

        const allResponse = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1302');
        setAllPokemon(allResponse.data.results);
      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term === '') {
      setSearchResults(pokemonList);
      setSearchError('');
      return;
    }

    const filteredList = pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(term.toLowerCase())
    );

    if (filteredList.length > 0) {
      setSearchResults(filteredList);
      setSearchError('');
    } else {
      const apiFilteredList = allPokemon.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(term.toLowerCase())
      );

      if (apiFilteredList.length > 0) {
        try {
          const detailedApiList = await Promise.all(apiFilteredList.map(async (pokemon) => {
            const pokemonDetail = await axios.get(pokemon.url);
            return pokemonDetail.data;
          }));
          setSearchResults(detailedApiList);
          setSearchError('');
        } catch (error) {
          setSearchResults([]);
          setSearchError('Invalid Search');
        }
      } else {
        setSearchResults([]);
        setSearchError('Invalid Search');
      }
    }
  };

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
        {loading ? (
          <div className="loading-container">
          <div className="loading-spinner">
            <div className="loading-text">Loading...</div>
          </div>
        </div>
        ) : searchResults.length > 0 ? (
          searchResults.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))
        ) : (
          <p>{searchError}</p>
        )}
      </div>
    </div>
  );
};

export default App;
