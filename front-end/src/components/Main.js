import React, { useEffect, useState, useContext } from "react";
import "./Main.css";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Trips from "./Trips";
import Spinner from "./Spinner";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { UserContext } from "../context/userContext";
import { changeLanguage } from "i18next";
import { getApiUrl } from "../util/api";
import BrandLogo from "./common/BrandLogo";
import ThemeToggle from "./common/ThemeToggle";

function Main() {
  const { userIdRef, userId, setUserId, currentTrip, setCurrentTrip } =
    useContext(UserContext);
  const location = useLocation();
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  };
  const { t } = useTranslation();
  const [tripss, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(getApiUrl("/api/auth/allTrips"));
        if (!response.ok) throw new Error("Network response was not ok");
        const allTrips = await response.json();
        console.log("Fetched trips:", allTrips);
        setTrips(allTrips);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Please try again!");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="background">
      <div className="wrapper1">
        <div className="container1 flex-col">

          {/* ── Premium Frosted-Glass Navbar ── */}
          <nav className="main-navbar">
            <Link to="/" style={{ textDecoration: "none" }}>
              <BrandLogo />
            </Link>

            <div className="main-nav-links-wrap">
              <Link to="/" style={{ textDecoration: "none" }}>
                <ul className={`home ${location.pathname === "/" ? "active-nav" : ""}`}>
                  {t("home")}
                </ul>
              </Link>

              <ul className="lang">
                <LanguageSelector />
              </ul>

              <Link to="/about" style={{ textDecoration: "none" }}>
                <ul className={`about ${location.pathname === "/about" ? "active-nav" : ""}`}>
                  {t("about")}
                </ul>
              </Link>

              <Link to="/contact" style={{ textDecoration: "none" }}>
                <ul className={`main-contact ${location.pathname === "/contact" ? "active-nav" : ""}`}>
                  {t("contactus")}
                </ul>
              </Link>

              <ThemeToggle />
            </div>
          </nav>

          {/* ── Page header ── */}
          <div style={{
            width: '100%',
            textAlign: 'center',
            padding: '2rem 2rem 0.5rem',
          }}>
            <h1 style={{
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-0.02em',
              margin: 0,
              fontFamily: 'Inter, sans-serif',
            }}>
              {t("Adventureawaits")}
            </h1>

            {!loading && tripss?.trips && (
              <p style={{
                color: 'rgba(255,255,255,0.65)',
                fontSize: '1rem',
                marginTop: '0.5rem',
                fontFamily: 'Inter, sans-serif',
              }}>
                {tripss.trips.length} trip{tripss.trips.length !== 1 ? 's' : ''} listed — pick one to join
              </p>
            )}
          </div>

          {/* ── Trip cards grid ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.5rem',
            padding: '2rem',
            width: '100%',
            boxSizing: 'border-box',
          }}>
            {loading ? (
              <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                <Spinner />
              </div>
            ) : (
              tripss?.trips?.map((trip) => (
                <Trips
                  key={trip._id}
                  id={trip._id}
                  title={trip.Destination}
                  count={trip.TravellerCount}
                  budget={trip.estimatedBudget}
                  preference={trip.Gender}
                  createdBy={trip.createdBy}
                />
              ))
            )}
          </div>


          <Link to="/create">
            <div className="create-trip">
              <button>{t("createtrip")}</button>
            </div>
          </Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Main;
