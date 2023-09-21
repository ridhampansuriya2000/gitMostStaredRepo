import React from "react";
import './App.css';
import { Routes, Route } from "react-router-dom"
import Dashboard from "./Components/Dashboard/Dashboard";

function App() {
  return (
      <>
        <Routes>
          <Route path={'/'} element={<Dashboard/>} />
        </Routes>
      </>
  );
}

export default App;
