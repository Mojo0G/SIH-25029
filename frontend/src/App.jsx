import React from "react";
import { Button } from "./components/ui/button";
import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./layout/layout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
      <Route index element={<div>Home Page</div>} />
      </Route>
    </Routes>
  );
}

export default App;
