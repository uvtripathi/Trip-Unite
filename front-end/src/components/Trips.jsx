import React, { useEffect, useState, useContext } from 'react';
import './Trips.css';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import images from '../image';

/* ── Inline icons ── */
const IconUsers = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconRupee = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12M6 8h12M6 13l8.5 8L14 13H6"/>
  </svg>
);
const IconPerson = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconArrow = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

function Trips({ id, title, count, budget, preference, createdBy }) {
  const { setCurrentTrip } = useContext(UserContext);
  const [img, setImg] = useState('');

  useEffect(() => {
    const n = Math.floor(Math.random() * 9);
    if (images[n]) setImg(images[n].url);
  }, []);

  /* Gender preference badge color */
  const prefColor =
    preference === 'Female' ? '#f9a8d4' :
    preference === 'Male'   ? '#93c5fd' :
    '#d8b4fe';

  return (
    <div className="trip-card-v2">

      {/* Cover image */}
      <div
        className="trip-card-cover"
        style={{ backgroundImage: `url(${img})` }}
      >
        {/* Preference badge */}
        <span className="trip-pref-badge" style={{ color: prefColor, borderColor: prefColor }}>
          {preference || 'Any'}
        </span>
      </div>

      {/* Card body */}
      <div className="trip-card-body">
        <h3 className="trip-card-title">{title}</h3>

        {/* Creator */}
        {createdBy && (
          <p className="trip-card-creator">
            <IconPerson />
            <span>by <strong>{createdBy}</strong></span>
          </p>
        )}

        {/* Stats row */}
        <div className="trip-card-stats">
          <div className="trip-stat">
            <IconUsers />
            <span>{count} traveller{count !== 1 ? 's' : ''}</span>
          </div>
          <div className="trip-stat">
            <IconRupee />
            <span>₹{budget?.toLocaleString()}</span>
          </div>
        </div>

        {/* CTA */}
        <Link to="/join" style={{ textDecoration: 'none' }}>
          <button
            className="trip-join-btn"
            onClick={() => setCurrentTrip(id)}
          >
            Join This Trip <IconArrow />
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Trips;