import React from "react";
import { Link } from "react-router-dom";
import { HeartIcon } from "@heroicons/react/outline";
import { HeartIcon as FilledHeartIcon } from "@heroicons/react/solid";

const MovieCard = ({ movie, isLiked, toggleLike }) => {
  return (
    <div className="w-full sm:w-64 rounded-lg shadow-lg overflow-hidden bg-white hover:shadow-xl transition-shadow duration-300">
      {/* Wrap the entire card in a Link */}
      <Link to={`/movie/${movie.id}`}>
        {/* Movie Poster */}
        <div className="relative">
          <img
            src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-72 object-cover"
          />
        </div>

        {/* Movie Details */}
        <div className="p-4">
          {/* Release Date */}
          <p className="text-xs text-gray-500 mb-1">{movie.release_date}</p>
          {/* Title */}
          <h3 className="text-base font-semibold text-gray-800 mb-2 truncate">
            {movie.title}
          </h3>

          {/* Ratings */}
          <div className="flex items-center space-x-3">
            {/* IMDb */}
            <div className="flex items-center bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full text-xs">
              <span className="font-medium">IMDb</span>
              <span className="ml-1">{movie.vote_average.toFixed(2)}/100</span>
            </div>
            {/* Rotten Tomatoes */}
            <div className="flex items-center bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">
              <span>🍅</span>
              <span className="ml-1">78%</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Like Button (outside of the Link to avoid triggering navigation) */}
      <div
        className="absolute top-3 right-3 bg-white rounded-full p-1 cursor-pointer"
        onClick={() => toggleLike(movie.id)}
      >
        {isLiked ? (
          <FilledHeartIcon className="h-6 w-6 text-red-600" />
        ) : (
          <HeartIcon className="h-6 w-6 text-gray-400" />
        )}
      </div>
    </div>
  );
};

export default MovieCard;









