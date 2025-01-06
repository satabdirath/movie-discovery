import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import SearchBar from "./components/SearchBar";
import MovieCard from "./components/MovieCard";
import MovieDetail from "./pages/MovieDetail";
import { PlayIcon, MenuIcon, XIcon, UserIcon } from "@heroicons/react/solid";

const API_KEY = "d9692375f0d37a505f8a47a4535a8f0d";
const API_URL = "https://api.themoviedb.org/3";

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [featuredMovieIndex, setFeaturedMovieIndex] = useState(0);
  const [likedMovies, setLikedMovies] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetchPopularMovies();

    const interval = setInterval(() => {
      setFeaturedMovieIndex((prevIndex) => (prevIndex + 1) % 5);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchPopularMovies = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/movie/popular`, {
        params: { api_key: API_KEY },
      });
      setMovies(response.data.results.slice(0, 20)); // Limit to 20 movies
    } catch (error) {
      console.error("Error fetching popular movies", error);
    } finally {
      setLoading(false);
    }
  };

  const searchMovies = async (query) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/search/movie`, {
        params: { api_key: API_KEY, query },
      });

      // Check if there are results, otherwise set an empty array
      setMovies(response.data.results.length > 0 ? response.data.results : []);
    } catch (error) {
      console.error("Error searching movies", error);
      setMovies([]); // Clear the movie list in case of an error
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = (movieId) => {
    setLikedMovies((prevState) => ({
      ...prevState,
      [movieId]: !prevState[movieId], // Toggle like state
    }));
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-md fixed w-full top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-4 flex justify-start items-center">
            {/* Hamburger Menu */}
            <button
              className="flex items-center text-gray-800 focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>

            {/* Brand Logo / Application Name */}
            <h1 className="ml-4 text-xl font-bold text-gray-800">
              Cineverse
            </h1>

            {/* Sign-In Option */}
            <button className="ml-auto flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              <UserIcon className="h-5 w-5" />
              <span>Sign In</span>
            </button>
          </div>
        </header>

        {/* Sidebar Menu */}
        {menuOpen && (
          <div className="fixed top-16 left-0 bg-white shadow-md w-64 h-full z-40">
            <ul className="space-y-4 p-6">
              <li>
                <Link to="/" className="text-gray-800 hover:text-red-600">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/trending" className="text-gray-800 hover:text-red-600">
                  Trending
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-gray-800 hover:text-red-600">
                  Favorites
                </Link>
              </li>
            </ul>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-grow pt-18">
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  {/* Featured Movie */}
                  {movies.length > 0 && movies[featuredMovieIndex] && (
                    <div
                      className="relative h-[80vh] sm:h-[80vh] bg-cover bg-center text-white"
                      style={{
                        backgroundImage: `url(${
                          movies[featuredMovieIndex]?.backdrop_path
                            ? `https://image.tmdb.org/t/p/original/${movies[featuredMovieIndex].backdrop_path}`
                            : '/path/to/placeholder-image.jpg' // Default or placeholder image if backdrop_path is missing
                        })`,
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70"></div>
                      <div className="relative w-full sm:w-[80%] md:w-[70%] lg:w-[60%] mx-auto px-4 sm:px-6 lg:px-10 py-10 flex flex-col justify-center h-full">
                        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-4">
                          {movies[featuredMovieIndex]?.title || 'Loading...'}
                        </h1>
                        <div className="flex items-center space-x-4 mb-4">
                          <span className="bg-yellow-500 text-black px-3 py-1 rounded text-sm sm:text-base">
                            IMDb {movies[featuredMovieIndex]?.vote_average?.toFixed(1) || 'N/A'}
                          </span>
                          <span className="bg-red-500 px-3 py-1 rounded text-sm sm:text-base">
                            97% 🍅
                          </span>
                        </div>
                        <p className="text-sm sm:text-lg mb-6 line-clamp-3">
                          {movies[featuredMovieIndex]?.overview || 'No overview available.'}
                        </p>
                        <Link
                          to={`/movie/${movies[featuredMovieIndex]?.id}`}
                          className="bg-red-600 w-full sm:w-[50%] flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 text-white font-semibold rounded hover:bg-red-700 space-x-2"
                        >
                          <PlayIcon className="h-5 w-5" />
                          <span>Watch Trailer</span>
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Search Bar and Movie Grid */}
                  <div className="container mx-auto px-4 sm:px-6 lg:px-10 mt-6">
                    <SearchBar searchMovies={searchMovies} />
                  </div>

                  <div className="container mx-auto px-4 sm:px-6 lg:px-10 mt-10 mb-20">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6">
                      Now Playing
                    </h2>
                    {loading ? (
                      <div>Loading...</div>
                    ) : movies.length === 0 ? (
                      <div>No results found</div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                        {movies.map((movie) => (
                          <MovieCard
                            key={movie.id}
                            movie={movie}
                            isLiked={likedMovies[movie.id] || false}
                            toggleLike={toggleLike}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              }
            />
            <Route path="/movie/:movieId" element={<MovieDetail />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-4">
          <div className="container mx-auto text-center">
            <p>&copy; 2025 Cineverse. All Rights Reserved.</p>
            <p>Powered by TMDB API.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
