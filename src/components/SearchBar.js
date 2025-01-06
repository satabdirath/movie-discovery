import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

const SearchBar = ({ searchMovies }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) searchMovies(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center shadow-lg rounded-full overflow-hidden bg-white"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="What do you want to watch?"
        className="w-full p-4 focus:outline-none text-gray-700"
      />
      <button
        type="submit"
        className="p-4 bg-red-600 text-white flex items-center justify-center hover:bg-red-700"
      >
        <AiOutlineSearch size={24} />
      </button>
    </form>
  );
};

export default SearchBar;


