import { lazy, Suspense, useEffect } from "react";
import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import RouteLoader from "./components/common/RouteLoader";

// ── Apply saved theme IMMEDIATELY before render (no flash) ──
const savedTheme = localStorage.getItem("theme") || "dark";
document.documentElement.setAttribute("data-theme", savedTheme);

const Home = lazy(() => import("./components/Home"));
const Login = lazy(() => import("./components/Login"));
const Main = lazy(() => import("./components/Main"));
const ChatBot = lazy(() => import("./components/chatbot/ChatBot.js"));
const Create = lazy(() => import("./components/Create"));
const JoinTrip = lazy(() => import("./components/JoinTrip.js"));
const About = lazy(() => import("./components/About.js"));
const Showcase = lazy(() => import("./components/Showcase.js"));
const Contact = lazy(() => import("./components/Contact.js"));
const Dashboard = lazy(() => import("./components/Dashboard.jsx"));

function App() {
  const { i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang && (savedLang === "en" || savedLang === "हिं")) {
      console.log("i am here", { savedLang });
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  return (
    <Suspense fallback={<RouteLoader />}>
      <div className="route-shell" key={location.pathname}>
        <Routes location={location}>
          <Route
            path="/"
            element={
              <>
                <Home />
                <ChatBot />
              </>
            }
          />
          <Route path="/signup" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/main" element={<Main />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<Create />} />
          <Route path="/join" element={<JoinTrip />} />
          <Route path="/about" element={<About />} />
          <Route path="/showcase" element={<Showcase />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Suspense>
  );
}

export default App;
