import React from 'react'
import "./Page2.css"
import { useTranslation } from "react-i18next";
import { TfiWorld } from "react-icons/tfi";
import { FaBookBookmark } from "react-icons/fa6";
import { CiLocationOn } from "react-icons/ci";
import { AiOutlineLike } from "react-icons/ai";

/* ── Featured Destinations (real image cards) ── */
const destinations = [
  { id: 'card1', name: 'Kashmir', dates: 'Jul 12–20', tag: 'Mountains' },
  { id: 'card2', name: 'Kerala',  dates: 'Jul 5–10',  tag: 'Backwaters' },
  { id: 'card3', name: 'Mumbai',  dates: 'Jul 10–15', tag: 'City' },
  { id: 'card4', name: 'Agra',    dates: 'Jul 18–22', tag: 'Heritage' },
];

function Page2() {
  const { t } = useTranslation();

  return (
    <div className="page2-wrapper" id="page_2">

      {/* ── Feature Pills ── */}
      <div className="p2-features">
        <div className="p2-feature-item">
          <span className="p2-feature-icon"><TfiWorld /></span>
          <div>
            <div className="p2-feature-title">{t('discoverplaces')}</div>
            <div className="p2-feature-desc">{t('uncover')}</div>
          </div>
        </div>
        <div className="p2-feature-item">
          <span className="p2-feature-icon"><FaBookBookmark /></span>
          <div>
            <div className="p2-feature-title">{t('plantrips')}</div>
            <div className="p2-feature-desc">{t('seameless')}</div>
          </div>
        </div>
        <div className="p2-feature-item">
          <span className="p2-feature-icon"><CiLocationOn /></span>
          <div>
            <div className="p2-feature-title">{t('travel')}</div>
            <div className="p2-feature-desc">{t('connect')}</div>
          </div>
        </div>
        <div className="p2-feature-item">
          <span className="p2-feature-icon"><AiOutlineLike /></span>
          <div>
            <div className="p2-feature-title">{t('share')}</div>
            <div className="p2-feature-desc">{t('sharejourney')}</div>
          </div>
        </div>
      </div>

      {/* ── Featured Destinations ── */}
      <div className="p2-destinations-section">
        <h2 className="p2-section-title">{t('upcomingtrips')}</h2>
        <p className="p2-section-sub">Handpicked destinations just for you</p>

        <div className="p2-dest-grid">
          {destinations.map(dest => (
            <div key={dest.id} className={`p2-dest-card ${dest.id}`}>
              <div className="p2-dest-overlay" />
              <div className="p2-dest-tag">{dest.tag}</div>
              <div className="p2-dest-info">
                <div className="p2-dest-name">{t(dest.name) || dest.name}</div>
                <div className="p2-dest-dates">✈ {dest.dates}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Page2;