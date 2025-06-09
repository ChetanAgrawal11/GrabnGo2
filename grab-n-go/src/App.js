import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./components/Main";
import Main2 from "./components/Main2";
import Main3 from "./components/Main3";
import Signup from "./components/SignUp";
import Login from "./components/Login";
import ResOwnerPage from "./components/ResOwnerPage";
import AllRestaurantsPage from "./components/AllRestaurantsPage";
import TiffinPage from "./components/TiffinService";
import AllTiffin from "./components/AllTiffin"; // ✅ Import AllTiffin component
import TiffinRequest from "./components/TiffinRequest";
import Page from "./components/Page";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Main3 />} />
        <Route path="/canteen" element={<Main2 />} />
        <Route path="/canteeninside" element={<Main />} />
        <Route path="/resowner" element={<ResOwnerPage />} />
        <Route path="/all-restaurants" element={<AllRestaurantsPage />} />
        <Route path="/tiffin" element={<TiffinPage />} />
        <Route path="/alltiffin" element={<AllTiffin />} /> {/* ✅ New route */}
        <Route path="/tiffinRequests" element={<TiffinRequest />} /> //{" "}
        {/* <-- New route */}
      </Routes>
    </Router>
  );
}

export default App;
