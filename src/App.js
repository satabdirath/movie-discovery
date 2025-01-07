import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import SearchBar from "./components/SearchBar";
import MovieCard from "./components/MovieCard";
import MovieDetail from "./pages/MovieDetail";
import { PlayIcon, MenuIcon, XIcon, UserIcon } from "@heroicons/react/solid";
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const API_KEY = "d9692375f0d37a505f8a47a4535a8f0d";
const API_URL = "https://api.themoviedb.org/3";

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [featuredMovieIndex, setFeaturedMovieIndex] = useState(0);
  const [likedMovies, setLikedMovies] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [heading, setHeading] = useState("Now Playing");

  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [email, setEmail] = useState(""); // State for email
  const [password, setPassword] = useState(""); // State for password

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

  const fetchMoviesByCategory = async (category) => {
    setLoading(true);
    let endpoint = ""; // Define endpoint variable
    
    try {
      // Set the heading based on the category clicked
      switch (category) {
        case "trending":
          setHeading("Trending Movies");
          endpoint = "/trending/movie/week"; // Trending movies endpoint
          break;
        case "popular":
          setHeading("Popular Movies");
          endpoint = "/movie/popular"; // Popular movies endpoint
          break;
        case "popular_tv_shows":
          setHeading("Popular TV Shows");
          endpoint = "/tv/popular"; // Popular TV shows endpoint
          break;
        case "bollywood":
          setHeading("Bollywood Movies");
          endpoint = "/discover/movie"; // Bollywood Movies endpoint (use discover)
          break;
        case "free_to_watch":
          setHeading("Free to Watch Movies");
          endpoint = "/movie/free_to_watch"; // Free to watch movies endpoint
          break;
        default:
          setHeading("Now Playing");
          endpoint = "/movie/popular"; // Default to popular movies if no category is specified
          break;
      }
    
      // Modify this URL with your API key and Hindi language filter
      const response = await axios.get(`${API_URL}${endpoint}`, {
        params: {
          api_key: API_KEY,
          language: "hi-IN",  // Set the language to Hindi (India)
          region: "IN",       // Set the region to India
          sort_by: "popularity.desc", // Sort by popularity
          page: 1,            // First page of results
          primary_release_year: 2018, // Optional, if you want movies from 2018
          with_original_language: "hi" // Filter only Hindi (original language)
        },
      });
  
      // Update state with the first 20 results
      setMovies(response.data.results.slice(0, 20));
    } catch (error) {
      console.error(`Error fetching ${category} movies`, error);
      setMovies([]); // Clear movies if error occurs
    } finally {
      setLoading(false); // Set loading state to false once request completes
    }
  };

  const searchMovies = async (query) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/search/movie`, {
        params: { api_key: API_KEY, query },
      });
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

  const handleLogin = (e) => {
    e.preventDefault();
    // Implement your login functionality here (e.g., validate credentials)
    console.log("Email:", email, "Password:", password);
    setIsModalOpen(false); // Close the modal after login
  };

  const handleLogout = () => {
    // Clear any user-related state (if applicable) and handle logout
    console.log("User logged out");
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
            <button
              onClick={() => setIsModalOpen(true)} // Open the modal when clicked
              className="ml-auto flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              <UserIcon className="h-5 w-5" />
              <span>Sign In</span>
            </button>
          </div>
        </header>

        {/* Modal for Sign-In */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-lg w-full sm:w-96">
              <h2 className="text-2xl font-semibold mb-4">Sign In</h2>
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2" htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2" htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)} // Close the modal
                  className="w-full mt-4 text-center text-sm text-gray-500"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Sidebar Menu */}
        {menuOpen && (
          <div className="fixed top-16 left-0 bg-white shadow-md w-64 h-full z-40">
            <ul className="space-y-4 p-6 flex flex-col justify-between h-full">
              {/* Categories */}
              <div>
                <li>
                  <Link to="/" className="text-gray-800 hover:text-red-600">
                    <button>Home</button>
                  </Link>
                </li>
                <li>
                  <button
                    className="text-gray-800 hover:text-red-600"
                    onClick={() => fetchMoviesByCategory("trending")}
                  >
                    Trending
                  </button>
                </li>
                <li>
                  <button
                    className="text-gray-800 hover:text-red-600"
                    onClick={() => fetchMoviesByCategory("popular_tv_shows")}
                  >
                    Popular TV Shows
                  </button>
                </li>
                <li>
                  <button
                    className="text-gray-800 hover:text-red-600"
                    onClick={() => fetchMoviesByCategory("bollywood")}
                  >
                    Bollywood Movies
                  </button>
                </li>
              </div>

              {/* Logout */}
              <div>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-gray-800 hover:text-red-600"
                  >
                    Logout
                  </button>
                </li>
              </div>
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
                  {/* Featured Movie - Only show if menu is not open */}
                  {!menuOpen && movies.length > 0 && movies[featuredMovieIndex] && (
                    <div
                      className="relative h-[80vh] sm:h-[80vh] bg-cover bg-center text-white"
                      style={{
                        backgroundImage: `url(${
                          movies[featuredMovieIndex]?.backdrop_path
                            ? `https://image.tmdb.org/t/p/original/${movies[featuredMovieIndex].backdrop_path}` 
                            : '/path/to/placeholder-image.jpg'
                        })`,

                      }}>
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
                      {heading}
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
                <footer className="bg-red-600 text-white py-8">
  <div className="container mx-auto text-center">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      <div className="flex flex-col items-center">
        <h4 className="text-xl font-semibold mb-4">Cineverse</h4>
        <p className="text-sm mb-4">Discover the world of movies with Cineverse. Your one-stop movie exploration platform.</p>
      </div>
      <div className="flex flex-col items-center">
        <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
        <ul className="text-sm">
          <li><a href="/home" className="hover:underline">Home</a></li>
          <li><a href="/about" className="hover:underline">About</a></li>
          <li><a href="/contact" className="hover:underline">Contact</a></li>
          <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
        </ul>
      </div>
      <div className="flex flex-col items-center">
  <h4 className="text-xl font-semibold mb-4">Follow Us</h4>
  <ul className="flex space-x-6 justify-center text-lg">
    <li>
      <a href="https://facebook.com" className="hover:text-gray-200">
        <FaFacebook size={28} />
      </a>
    </li>
    <li>
      <a href="https://twitter.com" className="hover:text-gray-200">
        <FaTwitter size={28} />
      </a>
    </li>
    <li>
      <a href="https://instagram.com" className="hover:text-gray-200">
        <FaInstagram size={28} />
      </a>
    </li>
  </ul>
</div>
      <div className="flex flex-col items-center">
        <h4 className="text-xl font-semibold mb-4">Newsletter</h4>
        <p className="text-sm mb-4">Subscribe to our newsletter for the latest movie updates and releases.</p>
        <input type="email" placeholder="Enter your email" className="p-2 rounded-md w-full max-w-xs mb-2" />
        <button className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-full w-full max-w-xs">Subscribe</button>
      </div>
    </div>
    
    {/* Copyright Section - Centered */}
    <div className="mt-8 text-center">
      <p className="text-sm">&copy; 2025 Cineverse. All Rights Reserved.</p>
    </div>
  </div>
</footer>


      </div>
    </Router>
  );
}

export default App;

