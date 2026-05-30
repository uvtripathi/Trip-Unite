import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import BrandLogo from "./common/BrandLogo";
import Spinner from "./Spinner";
import { getApiUrl } from "../util/api";
import ThemeToggle from "./common/ThemeToggle";
import "./Dashboard.css";

/* ── Status badge ── */
const StatusBadge = ({ status }) => {
  const map = {
    pending:  { color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  label: "⏳ Pending"  },
    approved: { color: "#22c55e", bg: "rgba(34,197,94,0.12)",   label: "✅ Approved" },
    rejected: { color: "#ef4444", bg: "rgba(239,68,68,0.12)",   label: "❌ Rejected" },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{
      color: s.color, background: s.bg, border: `1px solid ${s.color}`,
      borderRadius: 50, padding: "0.25rem 0.9rem", fontSize: "0.75rem",
      fontWeight: 700, letterSpacing: "0.03em", whiteSpace: "nowrap",
    }}>
      {s.label}
    </span>
  );
};

function Dashboard() {
  const navigate = useNavigate();
  const [view, setView]         = useState("created"); // "created" | "joined"
  const [createdTrips, setCreatedTrips] = useState([]);
  const [joinedTrips,  setJoinedTrips]  = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);   // trip for leader panel
  const [members, setMembers]   = useState([]);
  const [loadingMain, setLoadingMain] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [userName, setUserName] = useState("");
  const [actionLoading, setActionLoading] = useState(null); // member_id being acted on

  // ── Load user name ──
  useEffect(() => {
    const raw = localStorage.getItem("isAuthenticated");
    if (raw !== "true") { navigate("/login"); return; }
    try {
      const ud = JSON.parse(localStorage.getItem("userData"));
      setUserName(ud?.user?.fullName || "");
    } catch {}
  }, [navigate]);

  // ── Fetch created trips ──
  const fetchCreated = useCallback(async () => {
    setLoadingMain(true);
    try {
      const { data } = await axios.get(getApiUrl("/api/auth/userTrips"), { withCredentials: true });
      setCreatedTrips(data.trips || []);
    } catch { setCreatedTrips([]); }
    finally { setLoadingMain(false); }
  }, []);

  // ── Fetch joined trips (includes status) ──
  const fetchJoined = useCallback(async () => {
    setLoadingMain(true);
    try {
      const { data } = await axios.get(getApiUrl("/api/auth/joinedTrips"), { withCredentials: true });
      setJoinedTrips(data.trips || []);
    } catch { setJoinedTrips([]); }
    finally { setLoadingMain(false); }
  }, []);

  useEffect(() => { fetchCreated(); fetchJoined(); }, [fetchCreated, fetchJoined]);

  // ── Fetch members for a specific trip (leader view) ──
  const openLeaderPanel = async (trip) => {
    setSelectedTrip(trip);
    setLoadingMembers(true);
    try {
      const { data } = await axios.get(
        getApiUrl(`/api/auth/tripMembers/${trip._id}`),
        { withCredentials: true }
      );
      setMembers(data.members || []);
    } catch { setMembers([]); }
    finally { setLoadingMembers(false); }
  };

  // ── Approve or Reject ──
  const handleStatus = async (memberId, status) => {
    setActionLoading(memberId);
    try {
      await axios.patch(
        getApiUrl(`/api/auth/tripMembers/${memberId}/status`),
        { status },
        { withCredentials: true }
      );
      // Refresh members list
      setMembers(prev => prev.map(m => m.id === memberId ? { ...m, status } : m));
    } catch (err) {
      alert(err?.response?.data?.message || "Action failed");
    } finally { setActionLoading(null); }
  };

  const trips = view === "created" ? createdTrips : joinedTrips;

  return (
    <div className="dash-wrapper">
      {/* ── Navbar ── */}
      <nav className="dash-nav">
        <Link to="/" style={{ textDecoration: "none" }}><BrandLogo /></Link>
        <div className="dash-nav-right">
          <Link to="/" className="dash-nav-link">Home</Link>
          <Link to="/main" className="dash-nav-link">Explore</Link>
          <Link to="/create" className="dash-nav-link dash-nav-cta">+ Create Trip</Link>
          <div className="nav-divider" />
          <ThemeToggle />
        </div>
      </nav>

      <div className="dash-layout">
        {/* ── Sidebar ── */}
        <aside className="dash-sidebar">
          <div className="dash-welcome">
            <div className="dash-avatar">{userName?.[0]?.toUpperCase() || "U"}</div>
            <div>
              <div className="dash-username">{userName}</div>
              <div className="dash-role">Trip Member</div>
            </div>
          </div>

          <div className="dash-sidebar-links">
            <button
              className={`dash-sidebar-btn ${view === "created" ? "active" : ""}`}
              onClick={() => { setView("created"); setSelectedTrip(null); }}
            >
              ✈️ My Created Trips
              <span className="dash-count">{createdTrips.length}</span>
            </button>
            <button
              className={`dash-sidebar-btn ${view === "joined" ? "active" : ""}`}
              onClick={() => { setView("joined"); setSelectedTrip(null); }}
            >
              🎒 My Joined Trips
              <span className="dash-count">{joinedTrips.length}</span>
            </button>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="dash-main">

          {/* Leader panel overlay */}
          {selectedTrip && (
            <div className="dash-leader-panel">
              <div className="dlp-header">
                <div>
                  <h2 className="dlp-title">👑 Leader View — {selectedTrip.Destination}</h2>
                  <p className="dlp-sub">Review join requests for this trip</p>
                </div>
                <button className="dlp-close" onClick={() => setSelectedTrip(null)}>✕ Close</button>
              </div>

              {loadingMembers ? (
                <div className="dlp-loading"><Spinner /></div>
              ) : members.length === 0 ? (
                <div className="dlp-empty">No join requests yet.</div>
              ) : (
                <div className="dlp-table-wrap">
                  <table className="dlp-table">
                    <thead>
                      <tr>
                        <th>Name</th><th>Age</th><th>Gender</th>
                        <th>Contact</th><th>Status</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map(m => (
                        <tr key={m.id}>
                          <td>{m.name}</td>
                          <td>{m.age}</td>
                          <td>{m.gender}</td>
                          <td>{m.contact}</td>
                          <td><StatusBadge status={m.status} /></td>
                          <td>
                            {m.status === "pending" ? (
                              <div className="dlp-actions">
                                <button
                                  className="dlp-btn approve"
                                  disabled={actionLoading === m.id}
                                  onClick={() => handleStatus(m.id, "approved")}
                                >
                                  {actionLoading === m.id ? "…" : "✓ Approve"}
                                </button>
                                <button
                                  className="dlp-btn reject"
                                  disabled={actionLoading === m.id}
                                  onClick={() => handleStatus(m.id, "rejected")}
                                >
                                  {actionLoading === m.id ? "…" : "✕ Reject"}
                                </button>
                              </div>
                            ) : (
                              <span style={{ fontSize: "0.78rem", color: "var(--text2)" }}>
                                {m.status === "approved" ? "Accepted" : "Declined"}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Trip list */}
          {!selectedTrip && (
            <>
              <h1 className="dash-section-title">
                {view === "created" ? "✈️ Trips You Created" : "🎒 Trips You Joined"}
              </h1>

              {loadingMain ? (
                <div className="dash-loading"><Spinner /></div>
              ) : trips.length === 0 ? (
                <div className="dash-empty">
                  <p>{view === "created" ? "You haven't created any trips yet." : "You haven't joined any trips yet."}</p>
                  <Link to={view === "created" ? "/create" : "/main"} className="dash-empty-cta">
                    {view === "created" ? "+ Create your first trip" : "Explore Trips →"}
                  </Link>
                </div>
              ) : (
                <div className="dash-trip-grid">
                  {trips.map(trip => (
                    <div key={trip._id} className="dash-trip-card">
                      <div className="dtc-header">
                        <h3 className="dtc-dest">{trip.Destination}</h3>
                        {/* Status badge for JOINED trips */}
                        {view === "joined" && <StatusBadge status={trip.joinStatus} />}
                        {/* Leader badge for CREATED trips */}
                        {view === "created" && (
                          <span className="dtc-leader-badge">👑 Leader</span>
                        )}
                      </div>

                      <div className="dtc-meta">
                        <span>📅 {trip.StartDate?.substr(0,10)} → {trip.EndDate?.substr(0,10)}</span>
                        <span>₹{trip.estimatedBudget?.toLocaleString()}</span>
                        <span>👥 {trip.TravellerCount || "—"} travellers</span>
                        <span>📍 Meet: {trip.MeetUPLocation}</span>
                      </div>

                      {trip.Description && (
                        <p className="dtc-desc">{trip.Description}</p>
                      )}

                      {view === "created" && (
                        <button
                          className="dtc-manage-btn"
                          onClick={() => openLeaderPanel(trip)}
                        >
                          👥 Manage Join Requests
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
