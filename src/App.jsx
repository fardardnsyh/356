import React from "react";
import Navbar from "./components/Navbar";
import Dictionary from "./components/Dictionary";

const App = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen max-w-7xl mx-auto">
        <Dictionary />
      </div>
    </>
  );
};

export default App;
