import React from 'react';
import { assets } from '../assets/assets';

const StarRating = ({ rating, setRating, hover, setHover, comment, setComment }) => {
  return (
    <div className="mb-4">
      <div className="flex gap-1 mb-2">
        {[...Array(5)].map((_, index) => {
          const starValue = index + 1;
          return (
            <img
              key={index}
              className="w-5 cursor-pointer"
              src={starValue <= (hover || rating) ? assets.star_icon : assets.star_dull_icon}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(starValue)}
              alt=""
            />
          );
        })}
      </div>
      <textarea
        rows="3"
        className="w-full border border-gray-300 rounded p-2 text-sm"
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
    </div>
  );
};

export default StarRating;
