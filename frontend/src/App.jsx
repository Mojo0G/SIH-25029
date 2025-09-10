import React from "react";
import { Button } from "./components/ui/button";
import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./layout/layout";
import Landing from "./pages/landing";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
      <Route index element={<Landing/>} />
      </Route>
    </Routes>
  );
}

export default App;
