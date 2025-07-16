import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AboutPage from "./pages/About";
import NotFound from "./pages/NotFound";

const App = () => {
  console.log("App rendering, React:", React);
  console.log("React.useEffect:", React.useEffect);
  
  return (
    <div>
      <h1>App is working!</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
