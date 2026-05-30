import React from "react";
import "./RouteLoader.css";

function RouteLoader() {
  return (
    <div className="route-loader-wrap" role="status" aria-label="Loading page">
      <div className="route-loader-card">
        <div className="route-loader-brand">TripUnite</div>
        <div className="route-loader-bar">
          <span></span>
        </div>
        <p>Loading your next trip...</p>
      </div>
    </div>
  );
}

export default RouteLoader;
