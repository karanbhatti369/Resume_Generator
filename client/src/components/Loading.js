import React from "react";
import "./Loading.css"; 

const Loading = () => {
  return (
    <div className="loading-container">
      <span className="loader"></span>
      <h1>Loading, please wait ...</h1>
    </div>
  );
};

export default Loading;
