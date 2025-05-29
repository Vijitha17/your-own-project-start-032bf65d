import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="w-12 h-12 border-4 border-t-4 border-primary rounded-full animate-spin border-t-transparent"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;