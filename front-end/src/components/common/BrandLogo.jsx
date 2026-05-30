import React from "react";
import { FaPlaneDeparture } from "react-icons/fa";

function BrandLogo() {
  return (
    <div className="brand-logo" aria-label="TripUnite logo">
      <div className="brand-logo-mark">
        <span className="brand-logo-glow"></span>
        <FaPlaneDeparture />
      </div>
      <div className="brand-logo-text">
        <span className="brand-logo-top">Trip</span>
        <span className="brand-logo-bottom">Unite</span>
      </div>
    </div>
  );
}

export default BrandLogo;
