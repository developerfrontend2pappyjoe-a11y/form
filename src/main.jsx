import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import InfoDetails from "./infodetails.jsx";
import Button from "./button.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/info-details" element={<InfoDetails />} />
        <Route path="/button" element={<Button />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
