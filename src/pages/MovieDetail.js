import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const MovieDetail = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllCast, setShowAllCast] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false); // State for showing more reviews

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}`,
          { params: { api_key: "d9692375f0d37a505f8a47a4535a8f0d" } }
        );
        setMovie(response.data);

        // Fetch Cast details
        const castResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/credits`,
          { params: { api_key: "d9692375f0d37a505f8a47a4535a8f0d" } }
        );
        setCast(castResponse.data.cast);

        // Fetch Reviews
        const reviewsResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/reviews`,
          { params: { api_key: "d9692375f0d37a505f8a47a4535a8f0d" } }
        );
        setReviews(reviewsResponse.data.results);
      } catch (error) {
        console.error("Error fetching movie details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovieDetail();
  }, [movieId]);

  const handleToggleCast = () => {
    setShowAllCast((prev) => !prev);
  };

  const handleToggleReviews = () => {
    setShowAllReviews((prev) => !prev);
  };

  // Format date as '20/10/1995 (IN)'
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} (IN)`;
  };

  // Format time as '3h 10m'
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <span className="text-xl font-semibold">Loading...</span>
        </div>
      ) : movie ? (
        <div className="movie-detail px-4 sm:px-6 md:px-12 py-6">
          {/* Movie Header */}
          <div className="flex flex-col sm:flex-row items-center sm:space-x-10 mb-8 relative">
            <img
              src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              alt={movie.title}
              className="w-full sm:w-80 rounded-lg shadow-lg mb-4 sm:mb-0"
            />
            <div className="text-center sm:text-left mt-4 sm:mt-0">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">{movie.title}</h1>
              <div className="flex justify-center sm:justify-start space-x-4 mb-4">
                <span className="bg-yellow-500 text-black px-3 py-1 rounded text-sm sm:text-base">
                  IMDb {movie.vote_average.toFixed(1)}
                </span>
                <span className="bg-red-500 text-white px-3 py-1 rounded text-sm sm:text-base">
                  97% 🍅
                </span>
                <span className="bg-green-500 text-black px-3 py-1 rounded text-sm sm:text-base">
                  {movie.vote_average * 10}% {/* Content Score */}
                </span>
              </div>
              <p className="text-lg text-gray-300 mb-4">{formatDate(movie.release_date)}</p>
              <p className="text-lg text-gray-300 mb-4">{formatTime(movie.runtime)} </p>
              <p className="text-gray-300 mb-4"><strong>Tagline: </strong>{movie.tagline}</p> 
            </div>
          </div>

          {/* Background Image Section */}
          <div className="space-y-4 mb-8">
            <h2 className="text-2xl font-semibold">Overview</h2>
            <p className="text-lg text-gray-300">{movie.overview}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p><strong>Status:</strong> {movie.status}</p>
                <p><strong>Original Language:</strong> {movie.original_language}</p>
              </div>
              <div>
                <p><strong>Budget:</strong> ${movie.budget.toLocaleString()}</p>
                <p><strong>Revenue:</strong> ${movie.revenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Writer and Director */}
          <div className="flex flex-col sm:flex-row sm:space-x-10 mb-8">
            <div className="flex-1">
              <h2 className="text-xl font-semibold">Director</h2>
              <p className="text-gray-300">{movie.director ? movie.director.name : "N/A"}</p>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">Writer</h2>
              <p className="text-gray-300">{movie.writer ? movie.writer.name : "N/A"}</p>
            </div>
          </div>

          {/* Cast Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold">Cast</h2>
            <div className="flex flex-wrap justify-start space-x-4 mt-4">
              {cast.slice(0, showAllCast ? cast.length : 6).map((actor) => (
                <div key={actor.cast_id} className="text-center w-32 sm:w-40">
                  <img
                    src={`https://image.tmdb.org/t/p/w200/${actor.profile_path}`}
                    alt={actor.name}
                    className="w-full h-48 object-cover rounded-lg mx-auto"
                  />
                  <p className="text-gray-300 text-sm mt-2">{actor.name}</p>
                  <p className="text-gray-500 text-sm">{actor.character}</p>
                </div>
              ))}
            </div>
            <button
              className="mt-4 text-blue-400 hover:underline"
              onClick={handleToggleCast}
            >
              {showAllCast ? "Show Less" : "View More"}
            </button>
          </div>

          {/* Reviews Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold">Reviews</h2>
            {reviews.length > 0 ? (
              <div className="space-y-4 mt-4">
                {reviews.slice(0, showAllReviews ? reviews.length : 2).map((review) => (
                  <div key={review.id} className="bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg text-gray-300">{review.author}</h3>
                    <p className="text-gray-300 mt-2">{review.content.length > 1000 && !showAllReviews ? `${review.content.slice(0, 1000)}...` : review.content}</p>
                  </div>
                ))}
                {reviews.length > 2 && (
                  <button
                    onClick={handleToggleReviews}
                    className="text-blue-400 hover:underline mt-4"
                  >
                    {showAllReviews ? "Show Less" : "See More"}
                  </button>
                )}
              </div>
            ) : (
              <p className="text-gray-400 mt-4">No reviews available.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center text-xl text-gray-400">Movie not found!</div>
      )}
    </div>
  );
};

export default MovieDetail;


