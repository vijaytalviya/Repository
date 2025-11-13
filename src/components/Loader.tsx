import React from "react";
import "../styles/loader.css";

const Loader: React.FC = () => {
  return (
    <div className="loader-container">
      <div className="loader" role="status" aria-label="Loading..." />
    </div>
  );
};

export default Loader;
