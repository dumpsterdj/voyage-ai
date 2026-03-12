import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import Navbar           from "./components/Navbar";
import Home             from "./components/Home";
import Chatbot          from "./components/Chatbot";
import ItineraryPlanner from "./components/ItineraryPlanner";
import Destinations     from "./components/Destinations";
import BlogList         from "./components/BlogList";
import Blog             from "./components/Blog";
import AdminUpload      from "./components/AdminUpload";
import "./index.css";

function PlannerPage() {
  const [params] = useSearchParams();
  const prefill  = params.get("destination") || "";
  return <ItineraryPlanner prefillDestination={prefill} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="page-wrapper">
        <div className="bg-layer" />
        <Routes>
          {/* Admin — no navbar */}
          <Route path="/admin" element={<AdminUpload />} />

          {/* Public routes — with Navbar */}
          <Route path="/*" element={
            <>
              <Navbar />
              <Routes>
                <Route path="/"             element={<Home />} />
                <Route path="/destinations" element={<Destinations />} />
                <Route path="/blog"         element={<BlogList />} />
                <Route path="/blog/:slug"   element={<Blog />} />
                <Route path="/chat"         element={<Chatbot />} />
                <Route path="/planner"      element={<PlannerPage />} />
                <Route path="*"             element={<Navigate to="/" replace />} />
              </Routes>
            </>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}