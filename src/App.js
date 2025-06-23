import React from "react";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HeroSection from "./pages/HeroSection";
import SelectedWorksSection from "./pages/SelectedWorksSection";
import VisualGallerySection from "./pages/VisualGallerySection";

function App() {
  return (
    <div className="main-bg">
      <Header />
      <HeroSection />
      <SelectedWorksSection />
      <VisualGallerySection />
      <Footer />
    </div>
  );
}

export default App;
